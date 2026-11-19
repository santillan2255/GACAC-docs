# ProCoop: relevamiento público y base funcional para un sistema propio

Versión: 0.17  
Fecha: 3 de noviembre de 2026  
Estado: documento de trabajo ampliado, revisado en coherencia, contrastado con el mercado argentino y con el complemento de análisis y diseño integrado; pendiente de validación con la cooperativa

## Advertencia principal para la definición de arquitectura

**IMPORTANTE — REVISAR EXPRESAMENTE AL DEFINIR LA ARQUITECTURA:** se está definiendo un sistema integral de gestión de cooperativas que contiene un ERP, un CRM y otros componentes: multitenancy, autogestión, facturación, operación técnica, comunicación, APIs para terceros y relación con organismos gubernamentales. Esta combinación, junto con la prestación SaaS multitenant en la nube, debe revisarse como una decisión central de arquitectura antes de cerrar su diseño. No debe quedar implícita ni tratarse como un conjunto de pantallas sin límites de responsabilidad definidos.

La revisión debe establecer qué capacidades comparten identidad y datos, cuáles tienen límites propios, cómo se integran, cómo se evita duplicación y cómo se preservan aislamiento por tenant, seguridad, auditoría y simulaciones separadas de producción. **Este documento no decide todavía monolito, monolito modular, microservicios ni un stack concreto.** La sección 58 registra la revisión obligatoria y las decisiones pendientes.

**REQUISITO TRANSVERSAL DESDE EL INICIO DEL DESARROLLO:** cada cooperativa debe disponer de un diccionario de términos y etiquetas de interfaz configurables por tenant. La identidad de la organización incluye su lenguaje, además de marca, colores y logos. La arquitectura y el desarrollo de pantallas deben contemplarlo desde la primera versión, sin dejar los textos configurables incrustados de forma fija en cada pantalla. La sección 65 especifica este requisito.

## Propósito y alcance

Este documento reúne el relevamiento público de ProCoop y una propuesta funcional para desarrollar una plataforma propia de gestión de cooperativas de servicios.

El alcance comprende una solución SaaS multitenant en la nube con un catálogo de capacidades y servicios habilitables por cooperativa y un ERP para cooperativas, con autogestión de la organización y del ciclo completo de servicios del socio, gestión comercial, facturación configurable para Argentina, operación técnica, atención y administración económica.

La investigación se basó en información del fabricante, fichas de aplicaciones e instructivos publicados por cooperativas. No se contó con acceso a una instalación ni con un manual administrativo completo. Por eso, este documento no constituye un inventario exhaustivo de la versión actual de ProCoop.

**Actualización 0.15:** el proyecto incluye además un relevamiento en modo solo lectura de una base DEMO de ProCoop 10.4.6.722, en `procoop-relevamiento/README.md`. Ese material aporta menú completo, jerarquía Persona–Titular–Cuenta–Grupo Factura–Servicio, estructura de comprobantes con hasta cuatro vencimientos y tablas de facturación. La sección 97 incorpora sus consecuencias. Sus capturas contienen datos que parecen reales y no deben difundirse sin anonimizar.

**Actualización 0.17:** la sección 102 incorpora completo el complemento de análisis funcional y diseño, con sus propuestas AGR-001 a AGR-036. La sección 103 admite, junto con la factura separada, la factura multiservicio mediante grupos de facturación, como hacen ProCoop, GSP y Scapin. La sección 104 incluye la liquidación de sueldos en el alcance, con GLMSUIT RRHH como referencia. La sección 105 organiza todo el material por solución a diseñar: ERP, CRM, landing de cada tenant, plataforma, cobranza, pasarelas de pago, liquidación de impuestos y APIs.

Se distinguen tres niveles:

- **Confirmado públicamente:** alcance identificado en las fuentes enumeradas al final.
- **Requisito informado por el solicitante:** definición recibida para el producto propio, diferenciada del relevamiento de ProCoop. La estructura multitenant y los perfiles de acceso se registran en la sección 42; la identidad de marca y la landing de cada tenant, en la sección 43; la facturación por servicio y la agrupación opcional de cuenta corriente, en la sección 44.
- **Propuesta para el sistema propio:** desglose funcional de diseño que debe validarse con una cooperativa piloto. No implica que ProCoop incluya cada una de esas funciones.

## 1. Módulos y complementos publicados por ProCoop

El fabricante describe el siguiente alcance [F1]:

| Módulo | Alcance publicado |
|---|---|
| Asociados y usuarios | Cartera unificada, suministros y cuentas corrientes. |
| Servicios | Configuración de prestaciones medidas y no medidas. |
| Consumos | Lecturas, validaciones y telemedición. |
| Facturación | Emisión por servicios y sectores; modalidad electrónica. |
| Ventas | Contado, cargos en factura y cuotas. |
| Cobranzas | Recargos, retenciones y entidades recaudadoras. |
| Créditos | Mora, seguimiento y convenios de financiación. |
| Técnica | Órdenes, mantenimiento y factibilidad de conexiones. |
| Compras | Proveedores, comprobantes y pagos. |
| Stock | Depósitos y materiales utilizados. |
| Tesorería | Cajas, bancos y valores. |
| Contabilidad | Asientos, mayores, balances y cierres. |

También enumera los complementos **POS, R-Pos, Conector, Turnero, SMS, Web, CMS y Actividades**. Publica soluciones para electricidad, gas, telefonía, agua, internet, televisión y servicios sociales. La descripción de CMS y algunos complementos no permite reconstruir su funcionamiento completo [F1].

**P-Móvil** está orientado a las lecturas en campo: múltiples rutas, controles de rango, observaciones y registro de fecha, hora y ubicación GPS [F2].

**CoopOnline** permite consultar cuentas, deudas, consumos y reclamos. Su ficha también anuncia adhesión a factura electrónica y débito automático [F3]. Un instructivo de una cooperativa documenta registro, validación por correo, vinculación de cuentas, descarga de comprobantes y pagos mediante Pagos360. Esa integración corresponde a la implementación documentada y no demuestra que todas las cooperativas trabajen igual [F4].

Una presentación de Fecescor de 2026 menciona novedades laborales y contables de ProCoop. Es evidencia de ese alcance adicional, pero insuficiente para inventariar un módulo completo de sueldos [F5].

## 2. Organización propuesta del sistema propio

**Desde esta sección se desarrolla el sistema propio: se distinguen propuestas funcionales y requisitos informados por el solicitante. Las fuentes sobre ProCoop se enumeran en la sección 36; los requisitos multitenant recibidos se detallan en la sección 42. El contenido no es un manual de ProCoop ni afirma que ProCoop tenga cada función.**

Los módulos de las secciones 3 a 31 incluyen objetivo, límite, alcance, un caso de uso y datos de ejemplo. Las secciones 42 a 61 incorporan los requisitos recibidos y sus efectos transversales, con fuentes y pendientes diferenciados. Las secciones 58 a 61 agregan la revisión expresa de arquitectura, APIs de datos, seguridad y relación con organismos gubernamentales; la 62 registra sus fuentes, la 63 decisiones pendientes y la 64 el posicionamiento competitivo y el requisito SaaS en la nube. La sección 65 incorpora el diccionario y las etiquetas de interfaz propios de cada tenant como requisito transversal desde el inicio. La sección 45 precisa usuarios, roles y perfiles; la 46 incorpora noticias; la 47 amplía el CRM y la 48 establece solicitudes de alta y baja de todos los servicios. Las secciones 32 a 35 son guías transversales de diseño y planificación, no módulos adicionales. Las secciones 66 a 95 amplían catálogo, registro, cuentas, lotes, productos, instalación, contabilidad, geografía, copia de servicios, comunidad, titularidad y particularidades por servicio. La sección 96 registra la revisión de coherencia de la versión 0.15, la 97 los requisitos complementarios detectados y la 98 sus pendientes. Las secciones 99 a 101 contrastan el documento con otros sistemas del mercado argentino e incorporan los requisitos que surgen de esa comparación. La sección 102 contiene el complemento de análisis funcional y diseño (AGR-001 a AGR-036); la 103, la factura multiservicio; la 104, personal y sueldos; la 105, el mapa de soluciones a diseñar, y la 106, sus pendientes. El anexo de mensajes originales es la sección 107.

**Convención de ejemplos:** personas, códigos, cantidades, importes, fechas y configuraciones son ficticios y se proponen como datos precargados de demostración. Todos los importes monetarios están expresados en pesos argentinos (ARS). Los cálculos omiten tributos salvo que se indique lo contrario; no son tarifas vigentes, políticas aprobadas ni documentación fiscal. Los casos de uso se leen de forma independiente salvo la secuencia integrada de la sección 40. Ninguna precarga queda habilitada para producción sin validación y aprobación.

En este documento, **límite** identifica hasta dónde llega la responsabilidad del módulo y qué delega; **alcance** enumera las operaciones incluidas. Los ejemplos no constituyen decisiones de alcance ya aprobadas.

### Estructura multitenant — requisito informado

La solución será **SaaS en la nube y multitenant**: la cooperativa utilizará el servicio sin tener que instalar y operar servidores propios para alojar el sistema de gestión. La infraestructura y operación central corresponden al servicio de plataforma; responsabilidades y niveles de servicio se definirán. En este modelo, cada cooperativa constituirá un tenant, es decir, una organización con su propio ámbito de datos y administración dentro de la plataforma.

Habrá dos niveles de administración:

- **Plataforma:** administrador de la plataforma, con responsabilidad global sobre la gestión de los tenants. El detalle de sus permisos, incluido cualquier acceso a información operativa de una cooperativa, queda por definir.
- **Cooperativa/tenant:** administración y usuarios de cada organización, con roles internos como administrador de cooperativa, financiero y contable, además de los perfiles que se definan para sus empleados y asociados/socios.

Cada tenant tendrá sus propios asociados, empleados, usuarios y asignaciones de roles. La autorización se determinará dentro del tenant correspondiente. Los permisos de una cooperativa no habilitarán por sí mismos acceso a otra.

El aislamiento deberá abarcar los procesos de todos los módulos: consultas, modificaciones, documentos, reportes, exportaciones e integraciones. La forma técnica de implementar ese aislamiento se decidirá posteriormente.

### Marca y landing por cooperativa — requisito informado

El alta de una cooperativa como tenant debe habilitar su aplicación de administración y una landing configurable propia. Desde la administración, el tenant podrá gestionar su marca, colores, logos y splash, incluyendo imágenes para desktop, aplicación móvil, aplicación de empleados y aplicación de socios. También podrá configurar su diccionario de términos y las etiquetas visibles de la interfaz; la personalización comprende identidad visual y lenguaje propio de la cooperativa. El detalle de cómo se implementa cada canal queda pendiente.

La landing será un punto de entrada para que el socio consulte servicios e ingrese a la aplicación. El recorrido debe permitir consultar, activar y desactivar servicios; las condiciones, autenticación y eventuales aprobaciones de cada acción se definirán posteriormente. La sección 43 desarrolla este módulo y sus ejemplos.

### Facturación por servicio y agrupación opcional — requisito informado

Cada cooperativa brinda sus servicios y factura cada uno por separado a cada socio. El tenant define si esas obligaciones se presentan separadas o se agrupan en una cuenta corriente del socio asociada a un resumen de cuenta. La agrupación mantiene las facturas y el detalle por servicio; no implica emitir una única factura multiservicio. La sección 44 detalla esta definición y las decisiones pendientes.

**Precisión 0.17:** además de la factura separada, el tenant puede emitir varios servicios en un mismo comprobante mediante grupos de facturación, como es práctica habitual en el mercado. Cada servicio conserva su detalle, saldo y protecciones. La sección 103 prevalece sobre las frases de este documento que excluían esa modalidad.

### Autogestión y ERP — ampliación informada

El tenant debe poder autogestionar su cooperativa con un ERP integrado y el socio debe poder recorrer el ciclo de servicio desde la solicitud y coordinación de visitas hasta consumo, facturación, pago, reclamos y baja. Se incluyen suspensión y reactivación, tableros diferenciados, alertas y auditoría de cada cambio. El ERP admite varios planes de cuentas por cooperativa para simulaciones. Las secciones 50 a 55 desarrollan estos requisitos y precisan sus límites.

### Servicios habilitables y alta pública — ampliación informada

La plataforma ofrece capacidades propias por servicio que se habilitan o deshabilitan para cada tenant. Por ejemplo, una cooperativa puede ofrecer Agua, Electricidad y Cementerio parque; otra Electricidad y Gas. El catálogo habilitado determina qué puede ofrecerse a su comunidad. Cualquier persona puede registrarse de forma sencilla e iniciar la contratación de un servicio disponible; el alta de usuario no equivale por sí misma a adquirir la calidad de asociado ni a tener el servicio activo. Las secciones 66 y 67 detallan estos requisitos.

Cada servicio admite uno o más ciclos de corte de facturación para universos de clientes, procesamiento batch y una bandeja clara de casos no facturables. La cuenta corriente puede ser separada por servicio o unificada; las reglas de mora, suspensión y reactivación se configuran con límites normativos por servicio, según las secciones 68 a 70.

### Configuración independiente, copia de servicios y comunidad

Cada servicio se configura de forma independiente dentro de su tenant. Se podrá copiar la configuración de un servicio de una cooperativa a otra para utilizarla como base y lanzar la oferta a la comunidad del tenant destino, conservando independencia de datos, permisos y operación. La sección 81 desarrolla el mecanismo.

Para el componente de comunidad se requiere tomar y reutilizar en la mayor medida posible la experiencia y capacidades de **Connectyx**, cuya referencia de proyecto indicada por el solicitante está en `C:\Users\lenovo\Documents\CONNECTYX\connectia`. La sección 82 registra esta referencia y la revisión necesaria para determinar qué reutilizar.

### Titularidad y particularidades por servicio — ampliación informada

Cada contratación debe vincularse con un titular identificado por DNI o CUIT. Un mismo domicilio puede tener varias contrataciones del mismo tipo de servicio, incluso con titulares diferentes: dos hermanos pueden contratar conexiones independientes de Internet y pagar cada uno la suya. La dirección no es una clave única de contrato ni determina por sí misma responsabilidad de pago. La sección 83 desarrolla este modelo.

Cada servicio requiere sus propios productos, precios, beneficios, recargos, intereses, documentos, auxiliares de cuenta y procesos de solicitud, alta, baja y operación. Las secciones 84 a 95 incorporan una investigación por dominio, centrada en Internet, Electricidad y Agua en Córdoba, Gas, Cementerio parque y Banco de sangre, y otras prestaciones cooperativas. Se distinguen fuentes verificadas, propuesta de diseño y validación local pendiente.

### Espacios de trabajo

La plataforma contempla los siguientes canales y espacios de trabajo; su separación técnica y la distribución de funciones se definirán posteriormente:

| Espacio | Usuarios | Uso |
|---|---|---|
| Administración de la cooperativa | Usuarios internos y empleados del tenant con roles comerciales, financieros, contables, técnicos u otros autorizados | Gestionar la operación de su propia cooperativa según permisos. |
| Portal del asociado | Asociados/socios, titulares y personas autorizadas dentro del tenant | Consultar, pagar y realizar gestiones sobre sus cuentas autorizadas, incluyendo consulta y activación/desactivación de servicios según las reglas que se definan. |
| Landing de la cooperativa | Visitantes y socios de cada tenant | Presentar la marca y servicios, permitir consultas y ofrecer acceso a la aplicación de socios. |
| Aplicación de empleados | Empleados y usuarios internos autorizados del tenant | Acceder a las funciones habilitadas para su trabajo con la identidad visual de su cooperativa; distribución de funciones pendiente. |
| Aplicación de lecturas | Lecturistas y supervisores | Relevar medidores y resolver observaciones. |
| Aplicación técnica | Técnicos, cuadrillas y contratistas | Ejecutar conexiones, reparaciones y mantenimiento. |
| Administración de la plataforma | Administrador de la plataforma y otros perfiles globales que se acuerden | Gestionar tenants y configuración global; permisos operativos sobre cada cooperativa pendientes de definición. |

No necesariamente serían cinco desarrollos separados: pueden compartir backend, identidad y componentes.

## 3. Personas, asociados y relaciones

### Objetivo

Mantener, dentro de cada cooperativa/tenant, una identidad de negocio consistente y una ficha integral de cada persona y de sus relaciones con esa cooperativa.

### Límite y relación con otros módulos

Administra identidad, documentación y relaciones. La contratación pertenece al módulo de suministros; la deuda, a cuenta corriente. Ser asociado no activa automáticamente una prestación.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Registrar personas físicas y jurídicas.
- Mantener datos identificatorios, fiscales y de contacto.
- Distinguir asociado, cliente no asociado, solicitante y beneficiario.
- Registrar DNI/CUIT y las relaciones verificadas entre identificaciones de una misma persona sin confundir usuario, titular, pagador o conviviente.
- Registrar domicilios personales, fiscales y de correspondencia.
- Asociar documentación y controlar su vencimiento.
- Detectar posibles duplicados.
- Registrar representantes y personas autorizadas.
- Conservar historial de cambios.
- Gestionar ingreso, baja y situación del asociado.
- Consultar todos sus contratos, inmuebles, facturas, pagos y gestiones desde una ficha.
- Registrar preferencias de comunicación y autorizaciones.

**Regla de diseño:** dentro del mismo tenant, una persona debe poder contratar varios servicios en diferentes inmuebles sin duplicarse. La membresía cooperativa, la titularidad comercial y la ocupación de una vivienda deben ser relaciones diferentes.

**Requisito multitenant:** cada cooperativa tendrá su propio padrón de asociados y sus relaciones de personas. Una coincidencia de nombre, documento o correo entre cooperativas no autoriza a consultar ni fusionar sus registros. Persona, asociado, empleado y usuario de acceso son conceptos diferentes. Una persona puede tener varias relaciones dentro de la misma cooperativa; los permisos se otorgan por roles y alcance. Queda pendiente definir si una misma credencial podrá vincularse con varios tenants.

### Caso de uso de ejemplo — CU-03

**Actor:** Administrativo de atención.

**Situación inicial:** Una persona solicita asociarse y contratar agua; se dispone de los datos mínimos exigidos por la cooperativa.

**Desarrollo:**

1. Buscar coincidencias antes de crear la persona.
2. Registrar a Ana Pérez, contacto y domicilio; adjuntar la documentación solicitada.
3. Crear su relación de asociada y dejarla habilitada para iniciar una solicitud comercial.

**Resultado esperado:** Persona PER-001 y asociada ASO-001 creadas sin duplicación; todavía no existe un suministro activo.

**Excepción o control:** Si aparece una persona coincidente, revisar y utilizar el registro existente; no fusionar automáticamente identidades dudosas.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Persona | PER-001 — Ana Pérez, personaje ficticio |
| Relación | Asociada |
| Estado | Activa |
| Contacto de demostración | ana@example.com |

## 4. Inmuebles, contratos y suministros

### Objetivo

Relacionar personas, ubicaciones y prestaciones durante toda la vida del contrato, conservando su historia.

### Límite y relación con otros módulos

Administra el vínculo contractual y sus fechas. No modifica la identidad de la persona, ejecuta instalaciones ni calcula importes. El cambio de titular no reasigna automáticamente deuda histórica.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Registrar inmuebles, unidades, parcelas y ubicaciones.
- Buscar calles y localidades del país mediante un catálogo geográfico nacional y registrar direcciones normalizadas.
- Georreferenciar el domicilio de prestación y mostrarlo en Google Maps; contemplar confirmación del punto y excepciones de cobertura según sección 77.
- Crear un contrato o suministro por prestación, con titular identificado por DNI o CUIT.
- Admitir varios contratos/conexiones del mismo servicio en un domicilio, incluso con titulares diferentes y obligaciones independientes.
- No imponer unicidad por domicilio y tipo de servicio ni trasladar deuda entre convivientes por compartir dirección; ver sección 83.
- Relacionar propietario, ocupante, titular y responsable de pago.
- Registrar fechas de solicitud, aprobación, instalación y activación.
- Administrar estados: solicitado, pendiente, activo, suspendido y cerrado.
- Registrar cambios de titularidad con fecha efectiva.
- Gestionar mudanzas y transferencias.
- Mantener condiciones comerciales particulares.
- Adjuntar contratos y documentación técnica.
- Consultar instalaciones y equipos asociados.
- Consultar el historial de interrupciones, cambios y actuaciones.

**Caso importante:** si una persona se muda, el sistema debe conservar quién era titular cuando se generó cada cargo. Cambiar el titular actual no debe reescribir el pasado.

### Caso de uso de ejemplo — CU-04

**Actor:** Administrativo comercial.

**Situación inicial:** Ana ya está registrada y una solicitud de agua tiene aprobación técnica.

**Desarrollo:**

1. Seleccionar el inmueble INM-001.
2. Crear SUM-AG-001 con Ana como titular y plan Agua residencial.
3. Registrar la fecha efectiva de activación una vez confirmada la instalación.

**Resultado esperado:** Contrato activo, vinculado a su titular e inmueble y disponible para el ciclo de liquidación.

**Excepción o control:** Si falta la aprobación de instalación, mantener pendiente el contrato y no iniciar cargos que exijan activación.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Inmueble | INM-001 — Calle Ejemplo 100, ubicación ficticia |
| Suministro | SUM-AG-001 |
| Plan | AG-RES |
| Activación propuesta | 01/11/2026 |

## 5. Catálogo de prestaciones y planes

### Objetivo

Definir las prestaciones, planes y condiciones comerciales que la cooperativa puede ofrecer y contratar.

### Límite y relación con otros módulos

Define el producto y sus requisitos, pero no su deuda ni un precio definitivo dentro de cada contrato. Los importes y reglas de cálculo se administran mediante versiones tarifarias.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Crear tipos de prestación.
- Mantener un catálogo de servicios/capacidades de plataforma y su habilitación por tenant.
- Permitir ofertas distintas por cooperativa, incluyendo el servicio Cementerio parque informado por el solicitante.
- Diferenciar habilitación del servicio en el tenant, oferta comercial y contratación individual; ver sección 66.
- Definir unidades de medición y periodicidad.
- Registrar planes comerciales.
- Modelar productos, subservicios y conceptos facturables de cada prestación, diferenciando instalación, abono, promociones temporales, financiación, subsidios y reglas por plan; ver sección 72.
- Establecer requisitos de contratación.
- Determinar si necesita instalación, evaluación técnica o equipamiento.
- Definir condiciones de suspensión y baja.
- Configurar conceptos que pueden cobrarse.
- Administrar paquetes de prestaciones.
- Gestionar promociones con fechas de inicio y fin.
- Permitir planes discontinuados que sigan vigentes para contratos anteriores.
- Mantener versiones históricas de cada plan.

**Ejemplo:** un cambio comercial puede aplicarse únicamente a nuevas contrataciones, sin modificar a quienes mantienen un plan anterior.

### Caso de uso de ejemplo — CU-05

**Actor:** Responsable comercial.

**Situación inicial:** La organización decide ofrecer internet residencial.

**Desarrollo:**

1. Crear el servicio Internet y el plan Fibra 100.
2. Definir velocidad, periodicidad mensual, necesidad de equipo y aprobación de cobertura.
3. Publicar el plan para nuevas solicitudes y vincular su tarifa vigente.

**Resultado esperado:** Plan disponible para contratar con requisitos explícitos y precio vinculado por vigencia.

**Excepción o control:** Un plan discontinuado no se ofrece a nuevos clientes, pero conserva las condiciones históricas de contratos anteriores.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Servicio | INT — Internet |
| Plan | INT-100 — Fibra 100 |
| Característica | 100 Mbps; servicio no medido para esta demostración |
| Requisito | Factibilidad y equipo instalado |

## 6. Tarifas y motor de cálculo

### Objetivo

Calcular importes de forma reproducible a partir de cantidades, condiciones y una versión tarifaria identificable.

### Límite y relación con otros módulos

Calcula y explica precios; no emite comprobantes ni registra pagos. No supone porcentajes fiscales o tarifas reales: deben parametrizarse y aprobarse para cada organización.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Crear versiones de tarifas con vigencias.
- Configurar importes fijos y componentes variables.
- Administrar escalas, mínimos y bonificaciones.
- Definir reglas por tipo de contrato, grupo, plan comercial y condiciones del usuario.
- Calcular precio por cantidad (P × Q), abonos, componentes fijos y variables, subsidios, bonificaciones, descuentos, cargos y tributos por servicio y jurisdicción.
- Versionar reglas de excepción, alcance, vigencia, bases de cálculo, topes, prioridades y compatibilidades.
- Registrar la procedencia y vigencia del beneficio sin confundir subsidio público con promoción del tenant.
- Validar la habilitación de conceptos y su inclusión en cada factura; ver secciones 51 y 52.
- Gestionar conceptos calculados sobre otros conceptos.
- Establecer orden de cálculo y redondeo.
- Permitir excepciones autorizadas.
- Simular una liquidación antes de aplicarla.
- Comparar versiones y medir el efecto económico de un cambio.
- Mostrar cómo se obtuvo cada importe.
- Conservar una copia de las reglas utilizadas en cada liquidación.

**Ejemplo:** ante una consulta, el operador debería poder explicar qué cantidad se cobró, con qué precio, qué descuentos se aplicaron y cómo se obtuvo el total.

**Regla:** una tarifa anterior debe seguir siendo reproducible aunque posteriormente cambien los precios.

### Caso de uso de ejemplo — CU-06

**Actor:** Analista comercial autorizado.

**Situación inicial:** Se aprobó un consumo de agua de 20 m³ y existe una tarifa vigente de demostración.

**Desarrollo:**

1. Seleccionar TAR-AG-2026-11.
2. Aplicar cargo fijo de ARS 3.000 y 20 m³ a ARS 500 por m³.
3. Revisar el detalle y entregar el resultado de ARS 13.000 a liquidación.

**Resultado esperado:** Cálculo de ARS 13.000 explicado y asociado a la versión tarifaria, sin emisión ni cobro.

**Excepción o control:** Si no existe tarifa vigente o hay dos versiones incompatibles para el mismo caso, bloquear y pedir revisión.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Tarifa | TAR-AG-2026-11 |
| Cargo fijo | ARS 3.000 |
| Precio por m³ | ARS 500 |
| Consumo | 20 m³ |
| Total didáctico | ARS 13.000; sin modelar tributos |

## 7. Equipos y medidores

### Objetivo

Mantener la identificación y trayectoria de los equipos, incluyendo sus instalaciones, retiros y condiciones de uso.

### Límite y relación con otros módulos

Gestiona el activo físico y su instalación temporal; no confunde equipo con contrato. No aprueba automáticamente el consumo derivado de un reemplazo.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Inventariar equipos mediante identificadores únicos.
- Registrar fabricante, modelo y características.
- Administrar estados: disponible, instalado, retirado, en reparación y descartado.
- Registrar instalación y retiro.
- Conservar lecturas de colocación y retiro.
- Gestionar cambios de equipo.
- Registrar inspecciones, ensayos y mantenimiento.
- Adjuntar fotografías y certificados.
- Consultar la trayectoria completa del equipo.
- Impedir instalaciones incompatibles o simultáneas.
- Registrar precintos y accesorios cuando corresponda.

**Caso crítico:** reemplazar un medidor durante un período requiere calcular correctamente lo consumido con cada equipo.

### Caso de uso de ejemplo — CU-07

**Actor:** Encargado técnico.

**Situación inicial:** Una orden autoriza reemplazar el medidor de SUM-AG-001 y hay un equipo disponible.

**Desarrollo:**

1. Registrar retiro de MED-001 con lectura final 1.270 m³.
2. Instalar MED-002 con lectura inicial 0 m³ y fecha efectiva.
3. Conservar ambas instalaciones y enviar los registros a control de consumos.

**Resultado esperado:** Trayectoria de los dos equipos conservada y sin superposición indebida de instalaciones.

**Excepción o control:** Si MED-002 ya está instalado en otro suministro, impedir la asignación hasta resolver la inconsistencia.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Equipo retirado | MED-001 |
| Equipo nuevo | MED-002 |
| Estado anterior del nuevo | Disponible |
| Estado final del nuevo | Instalado |

## 8. Lecturas y relevamiento en campo

### Objetivo

Capturar lecturas y evidencias en campo, incluso sin conectividad, y entregarlas de manera trazable para su validación.

### Límite y relación con otros módulos

Registra observaciones de campo; no convierte toda lectura en consumo liquidable. La validación definitiva corresponde al control de consumos y no al dispositivo por sí solo.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Planificar campañas de lectura.
- Asignar recorridos a operadores.
- Descargar trabajo al dispositivo.
- Trabajar sin conexión.
- Capturar lectura, observación y evidencia fotográfica.
- Registrar motivos por los que no pudo realizarse una lectura.
- Advertir posibles errores antes de guardar.
- Permitir correcciones con trazabilidad.
- Sincronizar sin duplicar registros.
- Resolver conflictos entre datos del dispositivo y del servidor.
- Supervisar avances y pendientes.
- Reasignar trabajo.
- Cerrar una campaña una vez controlada.

**Regla de diseño:** distinguir lectura capturada, lectura validada y consumo aprobado para liquidar. Una corrección no debería borrar el dato original ni quién lo relevó.

### Caso de uso de ejemplo — CU-08

**Actor:** Lecturista.

**Situación inicial:** Ruta R-01 descargada y medidor MED-001 asociado a SUM-AG-001.

**Desarrollo:**

1. Abrir la tarea de lectura y verificar suministro y equipo.
2. Registrar estado 1.270 m³, fotografía y observación; guardar localmente si no hay conexión.
3. Sincronizar y confirmar la recepción sin duplicar la captura.

**Resultado esperado:** Lectura capturada pendiente de validación con operador, momento y evidencia asociados.

**Excepción o control:** Si el medidor es inaccesible, registrar ese motivo; no introducir cero para representar ausencia de lectura.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Ruta | R-01 — Centro |
| Lectura anterior de referencia | 1.250 m³ |
| Lectura capturada | 1.270 m³ |
| Estado | Pendiente de validación |

## 9. Control de consumos

### Objetivo

Transformar registros de medición en cantidades aprobadas, detectando inconsistencias y justificando estimaciones o ajustes.

### Límite y relación con otros módulos

Valida cantidades y su procedencia; no fija el precio ni emite la factura. Una alerta requiere evaluación y no implica necesariamente error o fraude.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Calcular diferencias entre registros válidos.
- Resolver reemplazos de equipos y cambios de período.
- Detectar valores negativos o incompatibles.
- Comparar contra el comportamiento histórico.
- Identificar posibles errores de captura.
- Gestionar consumos estimados con motivo y autorización.
- Regularizar estimaciones cuando llegue una medición válida.
- Administrar casos pendientes de inspección.
- Bloquear liquidaciones con inconsistencias relevantes.
- Mostrar el origen de cada cantidad liquidada.

**Criterio:** no tratar toda anomalía como un error. Puede existir una vivienda desocupada, una pérdida, una actividad estacional o un cambio real de uso.

### Caso de uso de ejemplo — CU-09

**Actor:** Supervisor de consumos.

**Situación inicial:** Existen lecturas anterior 1.250 m³ y actual 1.270 m³ para el mismo equipo y período.

**Desarrollo:**

1. Calcular la diferencia de 20 m³.
2. Revisar continuidad del equipo, fechas y alertas.
3. Aprobar la cantidad para el ciclo de noviembre.

**Resultado esperado:** Consumo validado de 20 m³, trazable a ambas lecturas.

**Excepción o control:** Si aparece 12.700 m³ como estado capturado, enviar a revisión y bloquear ese caso hasta resolverlo.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Período | 2026-11 |
| Cantidad calculada | 20 m³ |
| Origen | Lecturas reales |
| Decisión | Aprobado para liquidar |

## 10. Liquidación y facturación

### Objetivo

Convertir cantidades y cargos aprobados en liquidaciones revisables y comprobantes emitidos sin duplicación, facturando por separado cada servicio a cada socio dentro de su cooperativa/tenant.

### Límite y relación con otros módulos

Es responsable del ciclo de cálculo y emisión. La confirmación fiscal depende de la integración aplicable; generar un borrador no equivale a emitir. El cobro corresponde a otros módulos.
**Criterio:** separar el cálculo comercial de la emisión definitiva del comprobante.

**Requisito informado:** la facturación es separada por servicio. La agrupación configurada por el tenant corresponde a cuenta corriente y resumen, conservando la individualidad de las facturas. El caso de que un socio tenga varios suministros del mismo servicio queda pendiente de definición.

### Alcance funcional

El módulo contempla las siguientes operaciones:

- Abrir períodos de liquidación.
- Configurar por servicio uno o más ciclos y fechas de corte para universos de clientes.
- Generar lotes con validación por caso, progreso y resultados individuales.
- Identificar claramente casos con errores, responsable de corrección y reintento, sin detener por un error individual el resto válido; ver sección 69.
- Seleccionar contratos a procesar.
- Ejecutar simulaciones.
- Presentar errores y advertencias.
- Comparar resultados contra el período anterior.
- Revisar variaciones importantes.
- Aprobar resultados antes de emitir.
- Emitir una factura separada por servicio a cada socio o, si el tenant lo configura, un comprobante multiservicio por grupo de facturación con apertura por servicio (sección 103).
- Conservar en cada factura el tenant, socio y servicio al que corresponde.
- Generar comprobantes individuales o masivos.
- Administrar numeración y puntos de emisión.
- Gestionar notas de crédito y débito.
- Generar documentos descargables.
- Distribuir comprobantes por canales habilitados.
- Registrar el resultado de cada envío.
- Reanudar procesos interrumpidos.
- Evitar dobles emisiones.
- Conservar el detalle de cálculo de cada documento.

**Caso crítico:** si se corta una integración externa durante un lote, el sistema debe identificar qué documentos se emitieron y cuáles quedaron pendientes antes de reintentar.

### Caso de uso de ejemplo — CU-10

**Actor:** Responsable de facturación.

**Situación inicial:** SUM-AG-001 está activo, el consumo es válido y la tarifa está aprobada.

**Desarrollo:**

1. Simular el período y revisar ARS 13.000.
2. Aprobar la liquidación y solicitar la emisión por el canal configurado.
3. Guardar el identificador definitivo y poner el documento a disposición del titular.

**Resultado esperado:** FAC-DEMO-001 emitida por ARS 13.000, pendiente de cobro y vinculada con su cálculo.

**Excepción o control:** Ante respuesta externa incierta, consultar la emisión antes de reintentar; no generar otra factura a ciegas.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Liquidación | LIQ-001 |
| Comprobante | FAC-DEMO-001 — identificador interno ficticio |
| Importe | ARS 13.000 |
| Vencimiento de ejemplo | 15/11/2026 |

## 11. Cuenta corriente

### Objetivo

Explicar el saldo y la composición de las obligaciones de cada socio o titular dentro de su tenant, manteniendo la relación entre documentos y cancelaciones y la agrupación de cuenta corriente que configure la cooperativa.

### Límite y relación con otros módulos

Administra movimientos comerciales e imputaciones; no recibe físicamente fondos ni confirma por sí misma una transacción bancaria.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Consultar movimientos y saldos.
- Mostrar cargos, pagos, ajustes y créditos disponibles.
- Identificar documentos pendientes y parcialmente cancelados.
- Separar capital, gastos y otros componentes.
- Consultar saldos a una fecha histórica.
- Imputar pagos según reglas configurables.
- Gestionar pagos a cuenta.
- Reasignar imputaciones con autorización.
- Aplicar la configuración del tenant para mantener cuentas separadas por servicio o agrupar obligaciones del socio en una cuenta corriente.
- Emitir el resumen de cuenta asociado, con identificación y saldo de cada factura separada por servicio.
- Conservar el detalle por servicio tanto en la vista agrupada como en las imputaciones.
- Emitir estados de cuenta.
- Conciliar movimientos comerciales con contabilidad.
- Seguir obligaciones y pagos por asociado, contrato y servicio en cuentas separadas o unificadas, conservando el documento de origen y su asiento.
- Mostrar antigüedad, vencimientos, cobros parciales, acuerdos y acciones de seguimiento según la sección 75.
- Consultar el detalle por contrato y por titular.

**Regla fundamental:** un importe pendiente en una pasarela no debe considerarse cobrado hasta cumplir la condición de confirmación definida.

**Agrupación opcional por tenant:** un resumen agrupa información de obligaciones existentes; no crea por sí mismo una nueva deuda adicional. Si se agrupan facturas de distintos servicios, cada una conserva su identidad, saldo y cancelaciones. La distribución de un pago entre varias facturas requiere una regla de imputación explícita, todavía pendiente de acuerdo.

### Caso de uso de ejemplo — CU-11

**Actor:** Operador de cuenta corriente.

**Situación inicial:** FAC-DEMO-001 por ARS 13.000 está pendiente y se confirmó un pago de ARS 5.000.

**Desarrollo:**

1. Consultar el documento y el pago confirmado.
2. Imputar ARS 5.000 a la obligación seleccionada.
3. Mostrar el documento parcialmente cancelado y el saldo remanente.

**Resultado esperado:** Saldo de ARS 8.000, con origen e imputación visibles.

**Excepción o control:** Si el pago está pendiente de confirmación, mostrarlo informativamente sin reducir aún la deuda.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Documento | FAC-DEMO-001 |
| Importe original | ARS 13.000 |
| Pago imputado | ARS 5.000 |
| Saldo | ARS 8.000 |

## 12. Cajas y recepción de pagos

### Objetivo

Registrar cobros presenciales, emitir recibos y controlar los fondos y operaciones de cada turno de caja.

### Límite y relación con otros módulos

Controla caja y recepción de pagos; no altera precios ni elimina deuda mediante edición directa. Los cobros digitales se confirman por la integración correspondiente.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Abrir cajas por operador o sucursal.
- Registrar fondos iniciales.
- Cobrar uno o varios documentos.
- Combinar medios de pago.
- Registrar pagos parciales.
- Emitir recibos.
- Consultar operaciones del turno.
- Anular mediante un procedimiento autorizado.
- Realizar arqueos.
- Comparar saldo esperado y contado.
- Registrar diferencias con justificación.
- Cerrar turnos y rendir fondos.
- Establecer límites y permisos.
- Mantener trazabilidad entre recibo, movimiento de caja e imputación.

**Regla:** los movimientos confirmados deberían corregirse mediante operaciones trazables, sin desaparecer del historial.

### Caso de uso de ejemplo — CU-12

**Actor:** Cajero.

**Situación inicial:** Caja CAJ-01 abierta con fondo de ARS 20.000; FAC-DEMO-001 debe ARS 13.000, antes del pago parcial del ejemplo anterior.

**Desarrollo:**

1. Seleccionar la factura y registrar ARS 5.000 en efectivo.
2. Emitir REC-DEMO-001 y aplicar el pago a cuenta corriente.
3. Cerrar el turno y comparar el efectivo esperado con el contado.

**Resultado esperado:** Saldo de la factura ARS 8.000 y efectivo esperado ARS 25.000, si no hubo otros movimientos.

**Excepción o control:** Una diferencia de arqueo requiere registro y justificación; no se corrige borrando recibos.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Caja | CAJ-01 |
| Fondo inicial | ARS 20.000 |
| Cobro | ARS 5.000 — Efectivo |
| Recibo | REC-DEMO-001 |

## 13. Integraciones de cobro y conciliación

### Objetivo

Recibir confirmaciones de pagos externos y conciliar la cancelación comercial con la acreditación financiera.

### Límite y relación con otros módulos

El proveedor ejecuta el pago. Este módulo integra, valida y concilia; no considera que volver a la página de éxito sea prueba suficiente de cobro.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Conectar proveedores de pago mediante adaptadores.
- Crear solicitudes de pago identificables.
- Recibir confirmaciones y consultar estados.
- Procesar notificaciones repetidas sin duplicar cobros.
- Gestionar rechazos, devoluciones y contracargos.
- Importar rendiciones.
- Comparar importes brutos, comisiones y acreditaciones.
- Identificar pagos sin correspondencia.
- Enviar diferencias a revisión.
- Mantener evidencia de cada transacción.
- Conciliar lo que pagó el asociado con lo que recibió la organización.

**Ejemplo:** el socio puede pagar $100.000 y la cuenta bancaria recibir un neto menor por cargos del proveedor. El pago del socio y el gasto financiero deben quedar registrados por separado.

### Caso de uso de ejemplo — CU-13

**Actor:** Proceso de integración y tesorero.

**Situación inicial:** Existe una solicitud externa por el saldo de ARS 8.000 de FAC-DEMO-001.

**Desarrollo:**

1. Recibir una confirmación verificable de TX-DEMO-001.
2. Registrar una sola vez el pago y cancelar ARS 8.000 de deuda.
3. Conciliar ARS 8.000 brutos, ARS 160 de comisión y ARS 7.840 netos.

**Resultado esperado:** Factura cancelada y acreditación neta explicada; una notificación repetida no crea otro pago.

**Excepción o control:** Un contracargo posterior genera el circuito de revisión y ajustes trazables; no elimina la transacción original.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Transacción | TX-DEMO-001 |
| Pago bruto | ARS 8.000 |
| Comisión ficticia | ARS 160 |
| Acreditación neta | ARS 7.840 |

## 14. Gestión de deuda y acuerdos

### Objetivo

Organizar el seguimiento de deuda y la formalización y control de acuerdos de regularización.

### Límite y relación con otros módulos

Gestiona acuerdos sobre obligaciones existentes. No puede hacer que la deuda original y su financiación se cobren dos veces ni ordenar automáticamente suspensiones sin el circuito definido.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Segmentar deuda por antigüedad, monto y situación.
- Administrar expedientes de seguimiento.
- Registrar contactos, compromisos y respuestas.
- Programar próximos pasos.
- Configurar propuestas de regularización.
- Simular alternativas.
- Aprobar condiciones especiales.
- Registrar acuerdos aceptados.
- Controlar cumplimiento e incumplimiento.
- Gestionar refinanciaciones.
- Evitar que una deuda quede reclamada o financiada dos veces.
- Identificar situaciones que requieren revisión humana.

**Criterio:** la suspensión de un servicio debería pasar por un circuito con controles y excepciones configurables.

### Caso de uso de ejemplo — CU-14

**Actor:** Gestor de deuda.

**Situación inicial:** Otro titular de demostración tiene deuda confirmada de ARS 60.000 y se autorizó un plan sin interés.

**Desarrollo:**

1. Seleccionar las obligaciones incluidas y verificar que no estén en otro acuerdo.
2. Registrar anticipo de ARS 15.000 y tres cuotas de ARS 15.000.
3. Formalizar el acuerdo y seguir pagos y vencimientos.

**Resultado esperado:** Acuerdo por ARS 60.000 con obligaciones de origen identificadas y sin doble exigencia.

**Excepción o control:** Si no se paga el anticipo, mantener el estado que corresponda a la política acordada; no marcar el convenio como cumplido.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Acuerdo | ACU-001 |
| Deuda incluida | ARS 60.000 |
| Anticipo | ARS 15.000 |
| Financiación de ejemplo | 3 cuotas de ARS 15.000, sin interés |

## 15. Solicitudes comerciales y atención

### Objetivo

Administrar expedientes comerciales desde la solicitud inicial hasta su resolución, coordinando documentación y derivaciones.

### Límite y relación con otros módulos

Conduce el trámite; la evaluación técnica, ejecución física y liquidación de cargos corresponden a sus módulos especializados.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Recibir solicitudes presenciales y digitales.
- Permitir que socios soliciten el alta y la baja de cualquiera de los servicios brindados por su cooperativa, con requisitos específicos por prestación.
- Incorporar las solicitudes al CRM como casos trazables y conducirlas desde supervisión hacia las áreas responsables.
- Gestionar altas, bajas, cambios y consultas.
- Clasificar motivos y requisitos.
- Solicitar documentación faltante.
- Asignar responsables.
- Registrar comunicaciones.
- Vincular solicitudes con contratos, inmuebles y comprobantes.
- Derivar a evaluación técnica.
- Informar estado al solicitante.
- Controlar vencimientos.
- Registrar resolución y conformidad.
- Medir tiempos de atención.

**Regla de diseño:** una solicitud puede originar varios trabajos y movimientos administrativos. Conviene conservar un expediente común.

### Caso de uso de ejemplo — CU-15

**Actor:** Agente de atención.

**Situación inicial:** Ana solicita incorporar internet en INM-001.

**Desarrollo:**

1. Crear SOL-001 con motivo Alta de internet y plan INT-100.
2. Validar documentación y enviar a evaluación de cobertura.
3. Informar el avance y derivar a contratación cuando se apruebe.

**Resultado esperado:** Solicitud trazable que puede originar un contrato y una orden, sin perder el expediente inicial.

**Excepción o control:** Si falta documentación, registrar qué falta y mantener pendiente; no dar de alta una prestación activa.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Solicitud | SOL-001 |
| Motivo | Alta de internet |
| Canal | Presencial |
| Estado inicial | Pendiente de documentación |

## 16. Reclamos e incidentes

### Objetivo

Registrar y resolver reclamos individuales e incidentes comunes con seguimiento, responsables y comunicación al usuario.

### Límite y relación con otros módulos

Gestiona atención y coordinación; no sustituye la ejecución de una reparación ni garantiza que cerrar una orden resuelva todos los casos vinculados.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Crear casos con número de seguimiento dentro del CRM de cada tenant.
- Recibir pedidos, reclamos y otras gestiones desde formularios, chat y bot.
- Vincular claramente socio, servicio, cuenta y, cuando corresponda, contrato o factura.
- Adjuntar fotografías y conservar la conversación del caso.
- Ofrecer asistencia de IA para describir, resumir y clasificar el reclamo, como propuesta validable.
- Ingresar casos a una bandeja de supervisores para su revisión y derivación a las áreas de la cooperativa.
- Mantener la responsabilidad y el seguimiento hasta la resolución por empleados autorizados.
- Clasificar por prestación, motivo, prioridad y ubicación.
- Registrar fotos y documentación.
- Establecer responsables y plazos.
- Gestionar estados y derivaciones.
- Asociar reclamos duplicados.
- Agrupar afectados por un incidente común.
- Comunicar avances.
- Reabrir casos.
- Identificar recurrencias.
- Medir satisfacción.
- Mantener el historial completo de atención.

**Ejemplo:** una falla de una zona puede generar numerosos reclamos individuales, pero debería tener una sola gestión técnica del incidente.

### Caso de uso de ejemplo — CU-16

**Actor:** Operador de reclamos.

**Situación inicial:** Varios usuarios informan falta de agua en una misma zona.

**Desarrollo:**

1. Registrar REC-001 y detectar un incidente común INC-001.
2. Vincular los casos y solicitar intervención técnica.
3. Comunicar avances y confirmar la resolución antes de cerrar.

**Resultado esperado:** Casos individuales ligados a una única gestión del incidente y con historial de atención.

**Excepción o control:** Si el incidente general se resuelve pero un domicilio sigue afectado, mantener o reabrir ese caso para revisión específica.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Reclamo | REC-001 |
| Incidente | INC-001 |
| Motivo | Falta de agua |
| Prioridad ficticia | Alta, sujeta a reglas de la cooperativa |

## 17. Factibilidad, conexiones y órdenes técnicas

### Objetivo

Evaluar viabilidad de conexiones y conducir trabajos técnicos hasta su ejecución, revisión y efecto contractual autorizado.

### Límite y relación con otros módulos

Gestiona evaluación y órdenes; no autoriza por sí solo condiciones comerciales, cobros o cambios de titularidad.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Evaluar solicitudes de nueva conexión.
- Registrar inspecciones y condiciones.
- Preparar presupuestos.
- Aprobar o rechazar factibilidad con motivo.
- Generar órdenes.
- Asignar cuadrillas, turnos y equipamiento.
- Reservar materiales.
- Registrar ejecución y resultados.
- Informar al socio el estado En camino del instalador, sin presuponer seguimiento GPS en vivo.
- Registrar equipo seriado previamente asignado al instalador, instalación efectiva y movimiento de stock correspondiente.
- Capturar conformidad o firma de la instalación y conservar su evidencia.
- Enviar encuesta de satisfacción y procesar su respuesta, vinculada a la intervención.
- Vincular la activación efectiva con prorrateo y modalidad de facturación del contrato; ver sección 73.
- Capturar fotografías y conformidad.
- Gestionar trabajos incompletos.
- Revisar el cierre.
- Activar el contrato cuando se cumplan las condiciones.

**Regla importante:** cerrar una orden técnica y habilitar la facturación deben ser eventos relacionados, con una fecha efectiva explícita.

### Caso de uso de ejemplo — CU-17

**Actor:** Supervisor y cuadrilla técnica.

**Situación inicial:** SOL-001 tiene documentación completa y se requiere conectar internet.

**Desarrollo:**

1. Aprobar cobertura y crear OT-001.
2. Reservar equipo y asignar cuadrilla.
3. Registrar instalación, prueba y conformidad; enviar la fecha efectiva para activar el contrato.

**Resultado esperado:** Orden revisada y contrato habilitable desde la fecha confirmada, con materiales y evidencia vinculados.

**Excepción o control:** Si no hay acceso al inmueble, registrar visita fallida y reprogramar sin declarar instalada la conexión.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Orden | OT-001 |
| Tipo | Instalación de internet |
| Cuadrilla | CUA-01 |
| Equipo previsto | ONT-DEMO-001 |

## 18. Mantenimiento, infraestructura y mapas

### Objetivo

Mantener el inventario técnico de infraestructura y planificar intervenciones con su ubicación, historia y afectación.

### Límite y relación con otros módulos

Gestiona activos de red y mantenimiento. La simulación avanzada de redes solo integra el alcance si se acuerda expresamente; un mapa no la proporciona por sí mismo.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Inventariar infraestructura por ubicación.
- Relacionar activos y componentes.
- Programar inspecciones y mantenimiento.
- Gestionar averías.
- Registrar intervenciones y materiales.
- Consultar historial y costo por activo.
- Planificar interrupciones.
- Identificar contratos potencialmente afectados.
- Visualizar infraestructura y trabajos en mapas.
- Consultar documentación técnica.
- Controlar garantías y vencimientos.

**Posible ampliación:** topología de redes y análisis de afectación. La complejidad depende de si el servicio es eléctrico, sanitario o de telecomunicaciones.

### Caso de uso de ejemplo — CU-18

**Actor:** Responsable de mantenimiento.

**Situación inicial:** La válvula VAL-001 tiene una inspección preventiva programada.

**Desarrollo:**

1. Consultar ubicación e historial.
2. Crear intervención y señalar la zona potencialmente afectada.
3. Registrar tareas, materiales y resultado; programar el próximo control.

**Resultado esperado:** Historial técnico actualizado y mantenimiento trazable por activo.

**Excepción o control:** Si surge una avería, abrir la intervención correctiva y vincular incidentes sin ocultar el mantenimiento programado original.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Activo | VAL-001 — Válvula de red |
| Zona | Z-01 |
| Intervención | Inspección preventiva |
| Frecuencia ficticia | Trimestral |

## 19. Compras y proveedores

### Objetivo

Conducir la adquisición de bienes o servicios y controlar su relación con proveedores, entregas y obligaciones de pago.

### Límite y relación con otros módulos

Administra el circuito de compra; el stock confirma movimientos físicos y tesorería ejecuta pagos. Aprobar una orden no equivale a recibir mercadería.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Registrar proveedores y condiciones.
- Recibir solicitudes internas.
- Vincular requerimientos y líneas de órdenes de compra con servicios, centros de costos y órdenes técnicas cuando corresponda.
- Identificar compras y materiales compartidos sin duplicar la operación por servicio; ver sección 78.
- Solicitar y comparar cotizaciones.
- Gestionar niveles de aprobación.
- Emitir órdenes de compra.
- Registrar entregas parciales.
- Controlar diferencias de cantidades y precios.
- Vincular documentación comercial.
- Administrar devoluciones.
- Consultar obligaciones y vencimientos.
- Preparar pagos.
- Determinar y practicar retenciones cuando corresponda al régimen de la cooperativa y vincular certificados y obligaciones fiscales con el módulo de organismos gubernamentales de la sección 61.
- Medir cumplimiento de proveedores.

**Control:** separar a quien solicita, quien aprueba, quien recibe y quien autoriza el pago.

### Caso de uso de ejemplo — CU-19

**Actor:** Comprador y aprobador.

**Situación inicial:** Depósito solicita diez medidores para reposición.

**Desarrollo:**

1. Registrar requerimiento y comparar ofertas.
2. Aprobar una orden por 10 unidades a ARS 20.000 cada una.
3. Registrar entrega parcial de 6 y controlar el documento correspondiente.

**Resultado esperado:** Compra de ARS 200.000 base; 6 unidades recibidas y 4 pendientes, sin dar por entregado todo el pedido.

**Excepción o control:** Si el precio facturado no coincide con la condición aprobada, retener para revisión antes de autorizar el pago.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Orden | OC-001 |
| Cantidad pedida | 10 medidores |
| Precio unitario didáctico | ARS 20.000, sin modelar tributos |
| Primera entrega | 6 unidades |

## 20. Inventario y materiales

### Objetivo

Controlar existencias, disponibilidad, reservas y consumo de materiales y equipos por ubicación y destino.

### Límite y relación con otros módulos

Administra cantidades físicas y su valorización según política acordada. No convierte una reserva o entrega a cuadrilla en consumo definitivo.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Mantener catálogo, unidades y equivalencias.
- Administrar almacenes y ubicaciones.
- Registrar ingresos, egresos y transferencias.
- Reservar materiales para trabajos.
- Registrar entregas a cuadrillas o instaladores identificados, con equipos seriados y custodia.
- Al instalar, registrar la salida/aplicación desde la custodia del instalador al contrato, sin descontar dos veces el depósito central.
- Conservar la titularidad del equipo y diferenciar venta, consumo, préstamo/comodato u otra modalidad que se defina.
- Registrar entregas a cuadrillas.
- Controlar devoluciones y sobrantes.
- Gestionar productos seriados.
- Realizar inventarios físicos.
- Registrar ajustes aprobados.
- Configurar niveles mínimos.
- Consultar disponibilidad y valorización.
- Vincular cada consumo con su destino.
- Identificar materiales/equipos destinados o reservados para servicios y registrar entregas, consumos y devoluciones por intervención.
- Mantener una existencia física única por ubicación y serie, aunque un artículo sirva a varios servicios.

**Ejemplo:** entregar veinte unidades a una cuadrilla no implica que las veinte se hayan utilizado. Conviene distinguir entrega, consumo y devolución.

### Caso de uso de ejemplo — CU-20

**Actor:** Encargado de depósito.

**Situación inicial:** DEP-01 dispone de veinte conectores y OT-001 requiere cuatro.

**Desarrollo:**

1. Reservar cuatro unidades y mostrar dieciséis disponibles.
2. Entregar cuatro a la cuadrilla.
3. Registrar tres consumidas y una devuelta al depósito.

**Resultado esperado:** Diecisiete conectores quedan en depósito y tres consumidos en la orden, sin saldo pendiente en cuadrilla.

**Excepción o control:** Si existe faltante físico, registrar ajuste autorizado y evidencia; no modificar la existencia sin movimiento.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Artículo | MAT-CON-01 — Conector |
| Depósito | DEP-01 |
| Existencia inicial | 20 unidades |
| Consumo final | 3 unidades |

## 21. Tesorería y planificación de fondos

### Objetivo

Conocer y proyectar la posición financiera, administrar movimientos de fondos y controlar acreditaciones y compromisos.

### Límite y relación con otros módulos

Administra dinero y proyecciones; no genera por sí mismo la deuda del asociado ni reemplaza los registros contables. Un cobro esperado no es disponibilidad bancaria.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Administrar cuentas financieras.
- Registrar transferencias internas.
- Proyectar cobros y pagos.
- Programar obligaciones.
- Diferenciar pagos netos a proveedores y obligaciones por retenciones a ingresar a organismos; vincular declaración, pago y conciliación fiscal.
- Controlar vencimientos de instrumentos.
- Conciliar extractos.
- Identificar movimientos sin registrar.
- Clasificar gastos financieros.
- Establecer autorizaciones.
- Consultar posición diaria.
- Elaborar escenarios de liquidez.
- Relacionar cada movimiento con su origen.

**Resultado esperado:** la gerencia puede ver cuánto dinero tiene disponible y qué compromisos próximos podrían consumirlo.

### Caso de uso de ejemplo — CU-21

**Actor:** Tesorero.

**Situación inicial:** Banco de demostración tiene ARS 100.000 y se confirmó una acreditación neta de ARS 7.840.

**Desarrollo:**

1. Conciliar la acreditación con TX-DEMO-001.
2. Incorporar un pago a proveedor de ARS 30.000 previsto para el día siguiente.
3. Mostrar saldo actual y posición proyectada.

**Resultado esperado:** Saldo actual ARS 107.840 y proyección ARS 77.840, suponiendo que no haya otros movimientos.

**Excepción o control:** Si el banco aún no acredita, mantener el importe en tránsito y no sumarlo al disponible de esa cuenta.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Cuenta | BAN-DEMO-01 |
| Saldo inicial | ARS 100.000 |
| Acreditación | ARS 7.840 |
| Compromiso futuro | ARS 30.000 |

## 22. Contabilidad y análisis económico

### Objetivo

Registrar y explicar el efecto económico de las operaciones, conciliando auxiliares y preservando los períodos contables.

### Límite y relación con otros módulos

Es responsable del registro contable y sus cierres; no sustituye aprobación comercial, confirmación de cobros ni recepción física. Las reglas profesionales se definirán con el área contable.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Configurar ejercicios, períodos y varios planes de cuentas por cooperativa.
- Distinguir planes de cuentas, versiones y escenarios de simulación de planes comerciales de servicios.
- Relacionar operaciones y cuentas mediante reglas versionadas y equivalencias.
- Ejecutar simulaciones sin emitir comprobantes, mover fondos ni modificar los registros oficiales.
- Comparar escenarios y conciliarlos con el mismo universo de origen; ver sección 55.
- Administrar centros de costos propios de cada tenant y su relación con servicios, áreas, sucursales y otras dimensiones autorizadas.
- Definir imputaciones directas y distribución de costos compartidos con reglas versionadas, sin duplicar el gasto de origen.
- Mantener cuentas y movimientos contables reales separados de los escenarios y cuentas de simulación.
- Conciliar facturas, cobros, imputaciones y saldos de cuenta corriente con los registros contables; ver sección 75.
- Definir centros de costo y dimensiones de análisis.
- Registrar asientos con documentación de origen.
- Revisar y aprobar ajustes.
- Conciliar cuentas.
- Bloquear períodos cerrados.
- Gestionar reaperturas autorizadas.
- Preparar informes.
- Analizar resultados por prestación.
- Distribuir gastos comunes mediante reglas explícitas.
- Conservar trazabilidad desde un informe hasta la operación que lo originó.

**Regla importante:** la contabilidad debe poder reconciliarse con los módulos comerciales y financieros. Un saldo no debería depender de consultas que interpretan de manera distinta los mismos movimientos.

### Caso de uso de ejemplo — CU-22

**Actor:** Contador.

**Situación inicial:** Se confirmó el pago digital de ARS 8.000, con acreditación neta ARS 7.840 y comisión ARS 160.

**Desarrollo:**

1. Recuperar la operación conciliada.
2. Generar el asiento simplificado de demostración y revisar su equilibrio.
3. Vincular el asiento al pago y comprobar la conciliación del auxiliar.

**Resultado esperado:** Débitos Banco ARS 7.840 y Comisiones ARS 160; crédito Créditos por servicios ARS 8.000. Total de cada lado: ARS 8.000.

**Excepción o control:** Si se requieren cuentas transitorias, desgloses u otros conceptos, aplicar el esquema aprobado; el ejemplo no es una política contable real.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Asiento | ASI-DEMO-001 |
| Debe Banco | ARS 7.840 |
| Debe Comisiones | ARS 160 |
| Haber Créditos por servicios | ARS 8.000 |

## 23. Ventas adicionales y financiación comercial

### Objetivo

Gestionar ventas adicionales y sus entregas y obligaciones, incluyendo financiación comercial autorizada.

### Límite y relación con otros módulos

Administra la venta y su cronograma; no mezcla la operación nueva con la refinanciación de deuda anterior. El cobro se registra por cajas o pagos externos.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Administrar artículos y servicios adicionales.
- Preparar presupuestos.
- Registrar pedidos y entregas.
- Aplicar listas de precios.
- Controlar disponibilidad.
- Gestionar devoluciones.
- Configurar condiciones de financiación.
- Generar cronogramas.
- Identificar cuotas pendientes, cobradas o canceladas.
- Gestionar cancelación anticipada.
- Relacionar cada obligación con su operación original.

**Criterio:** diferenciar la financiación de una venta nueva de la regularización de una deuda anterior, aunque compartan herramientas.

### Caso de uso de ejemplo — CU-23

**Actor:** Vendedor.

**Situación inicial:** Un asociado solicita un equipo de venta por ARS 90.000 y tiene aprobado un plan sin interés.

**Desarrollo:**

1. Registrar el artículo y confirmar disponibilidad.
2. Crear la venta con tres cuotas de ARS 30.000.
3. Registrar entrega y generar las obligaciones correspondientes sin duplicarlas en el ciclo de servicios.

**Resultado esperado:** Venta identificada, entrega trazable y cronograma de ARS 90.000 total.

**Excepción o control:** Si se devuelve el artículo, tramitar devolución y ajustes sobre las cuotas según el estado de cobro.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Venta | VEN-001 |
| Artículo | ART-ROU-01 — Router de venta |
| Precio ficticio | ARS 90.000 |
| Plan | 3 cuotas de ARS 30.000, sin interés |

## 24. Servicios sociales y beneficiarios

### Objetivo

Administrar grupos, beneficiarios y autorizaciones de servicios sociales según coberturas y condiciones vigentes.

### Límite y relación con otros módulos

Administra cobertura y prestaciones autorizadas. No constituye una historia clínica ni resuelve decisiones asistenciales; la información sensible requiere permisos específicos.
Si se apunta a cooperativas que los brindan, este módulo necesita reglas propias.

### Alcance funcional

El módulo contempla las siguientes operaciones:

- Registrar grupos de cobertura.
- Diferenciar los servicios sociales de Cementerio parque; este último se incorpora al catálogo como prestación propia cuyo detalle debe relevarse, sin asumir que se resuelve con un plan de cobertura familiar.
- Mantener beneficiarios y relaciones.
- Controlar altas y bajas.
- Gestionar planes y condiciones de acceso.
- Registrar solicitudes de prestación.
- Verificar cobertura vigente a la fecha del evento.
- Relacionar prestadores.
- Registrar autorizaciones y costos.
- Consultar prestaciones utilizadas.
- Administrar excepciones.
- Proteger documentación sensible con permisos específicos.

**Criterio:** no asumir que los servicios sociales se resuelven únicamente con un abono mensual.

### Caso de uso de ejemplo — CU-24

**Actor:** Operador de servicios sociales.

**Situación inicial:** Un grupo familiar tiene un plan de demostración activo y solicita una prestación incluida.

**Desarrollo:**

1. Identificar al beneficiario y la fecha solicitada.
2. Verificar cobertura y condiciones a esa fecha.
3. Registrar autorización y prestador, o derivar la excepción a un responsable.

**Resultado esperado:** Prestación autorizada o rechazada con motivo, sin revelar documentación a operadores no habilitados.

**Excepción o control:** Si el beneficiario no estaba incorporado en la fecha del evento, enviar a revisión sin alterar retroactivamente la cobertura sin autorización.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Grupo | GRU-001 |
| Plan | SOC-FAM — Familiar |
| Integrantes de ejemplo | Ana y dos beneficiarios ficticios |
| Abono ilustrativo | ARS 8.000 por grupo y mes |

## 25. Portal y aplicación del asociado

### Objetivo

Permitir que titulares y autorizados consulten y gestionen sus prestaciones de forma autónoma y comprensible.

### Límite y relación con otros módulos

Es un canal sobre procesos del sistema; no puede cambiar tarifas, aprobar acuerdos excepcionales ni validar un pago por la sola acción del usuario.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Permitir registro sencillo de cualquier persona, antes de contratar o asociarse.
- Distinguir usuario registrado, asociado y titular de contrato; completar requisitos de cada etapa sin bloquear el registro con todos los datos fiscales de una futura factura.
- Registrarse y recuperar acceso.
- Vincular contratos mediante verificación.
- Autorizar a otras personas.
- Consultar obligaciones y movimientos.
- Mostrar facturas separadas por servicio o comprobantes multiservicio con apertura por servicio (sección 103) y, si el tenant habilita agrupación, la cuenta corriente y su resumen sin perder el detalle.
- Descargar documentos.
- Pagar y seguir el resultado.
- Consultar evolución de uso.
- Iniciar solicitudes.
- Registrar y seguir reclamos.
- Actualizar datos permitidos.
- Gestionar preferencias de comunicación.
- Acceder desde la landing de su cooperativa a la aplicación de socios.
- Consultar servicios disponibles y contratados e iniciar o ejecutar su activación y desactivación según las condiciones y aprobaciones que se definan.
- Presentar la marca de la cooperativa, con sus colores y recursos gráficos por canal.
- Consultar noticias en el muro de la app de socios, según el público y canal de publicación.
- Acceder al CRM para pedidos y reclamos mediante formulario, chat o bot, con fotos y ticket de seguimiento.
- Solicitar el alta y la baja de cualquiera de los servicios que brinde el tenant.
- Concertar y seguir visitas desde la app, y consultar su resultado.
- Ver que el instalador está en camino, revisar y firmar la conformidad de instalación por el canal definido y responder una encuesta de satisfacción.
- Consultar la fecha efectiva de inicio y el detalle del primer cobro, con o sin prorrateo y según modalidad anticipada o vencida.
- Consultar consumos y facturas, pagar y registrar reclamos dentro del ciclo completo de autogestión.
- Solicitar suspensión temporal y reactivación; consultar condiciones y costos aplicables antes de confirmar, según las secciones 52 y 53.
- Consultar avisos de interrupciones.
- Descargar constancias.
- Consultar acuerdos y cuotas.
- Ver una explicación comprensible de los importes.

**Control importante:** conocer un número de cuenta no debería ser suficiente para acceder a información privada de otro titular.

### Caso de uso de ejemplo — CU-25

**Actor:** Asociada titular.

**Situación inicial:** Ana tiene acceso validado y una relación autorizada con SUM-AG-001.

**Desarrollo:**

1. Ingresar y seleccionar la cuenta.
2. Consultar FAC-DEMO-001 y, si tiene saldo, iniciar el pago por el canal habilitado.
3. Ver el resultado confirmado y descargar el comprobante o registrar una consulta.

**Resultado esperado:** Gestión realizada con acceso restringido a las cuentas autorizadas y estado de pago consistente con el backend.

**Excepción o control:** Si intenta vincular una cuenta ajena sin verificación suficiente, denegar acceso y ofrecer el circuito de acreditación.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Usuario de demostración | ana@example.com |
| Cuenta autorizada | SUM-AG-001 |
| Acción | Consultar factura y pagar |
| Estado de pago posible | Pendiente de confirmación |

## 26. Tareas internas, atención presencial y comunicaciones

### Objetivo

Coordinar trabajo interno, organizar la atención presencial y comunicar eventos con seguimiento y responsables.

### Límite y relación con otros módulos

Los tres componentes son distinguibles y pueden implementarse por separado. Crear una tarea o enviar un mensaje no confirma que la operación comercial o técnica haya ocurrido.
### Alcance funcional


Se proponen tres componentes relacionados:

| Componente | Funciones propuestas |
|---|---|
| Tareas | Responsables, vencimientos, recurrencias, evidencias, aprobaciones y escalamiento. |
| Atención presencial | Recepción, motivos, colas, llamados, derivaciones y medición de espera. |
| Comunicaciones | Plantillas, destinatarios, campañas, preferencias y seguimiento de entrega. |

Los mensajes deberían poder originarse en eventos: emisión de un documento, confirmación de pago, avance de una solicitud o interrupción programada.

Cada envío debe conservar destinatario, contenido, fecha y resultado.

**Requisito informado de noticias:** cada tenant debe poder publicar noticias en la landing, la app de socios y la app de empleados, con presentación en muro de noticias tomando Connectyx como referencia funcional. La sección 82 amplía esa referencia al componente de comunidad y registra la ubicación del proyecto proporcionada por el solicitante. La sección 46 desarrolla objetivo, alcance, límites y ejemplos; no se presupone acceso al código o una réplica de detalles aún no relevados.

### Caso de uso de ejemplo — CU-26

**Actor:** Supervisor, recepcionista y operador de comunicaciones.

**Situación inicial:** Existe una obligación interna, una persona en recepción y un evento notificable.

**Desarrollo:**

1. Tareas: crear una revisión mensual, asignar responsable, adjuntar evidencia y cerrar.
2. Atención: entregar turno A-001 para Caja, llamar y registrar atención o ausencia.
3. Comunicaciones: generar un aviso de factura y registrar si el proveedor lo acepta, entrega o rechaza.

**Resultado esperado:** Tarea trazable, turno con tiempos registrados y comunicación con resultado diferenciado por canal.

**Excepción o control:** Un envío fallido debe quedar identificado; no declarar notificado al asociado solo porque el sistema encoló el mensaje.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Tarea | TAR-001 — Revisión mensual |
| Turno | A-001 — Caja |
| Plantilla | AVISO-FACTURA |
| Variables de ejemplo | Nombre: Ana; importe: ARS 13.000; vencimiento: 15/11/2026 |

## 27. Gestión cooperativa institucional

### Objetivo

Mantener información institucional, membresías y actuaciones de gobierno cooperativo de forma trazable.

### Límite y relación con otros módulos

El alcance definitivo requiere validación institucional. Generar un padrón preliminar no certifica su validez legal ni reemplaza decisiones de los órganos de la cooperativa.
### Alcance funcional


Para un producto específicamente cooperativo, se evaluaría:

- Registro de membresías y situaciones.
- Aportes y movimientos de capital.
- Documentación institucional.
- Preparación de padrones bajo reglas configurables.
- Asambleas, convocatorias y asistencia.
- Actas y resoluciones.
- Autoridades y mandatos.
- Seguimiento de decisiones.
- Documentos e informes institucionales.

**Estado del relevamiento:** no se confirmó el detalle de estas funciones en ProCoop. Se incluyen como una línea de producto a validar con una cooperativa real.

### Caso de uso de ejemplo — CU-27

**Actor:** Secretaría institucional.

**Situación inicial:** Se solicita preparar información para una asamblea de demostración.

**Desarrollo:**

1. Definir fecha de corte y criterios aprobados.
2. Generar padrón preliminar y revisar observaciones.
3. Registrar aprobación, convocatoria y acta con sus documentos.

**Resultado esperado:** Documentación versionada y criterios utilizados conservados.

**Excepción o control:** Si cambia una condición de elegibilidad, conservar la versión previa y requerir la revisión que corresponda.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Evento | ASM-DEMO-001 |
| Estado de padrón | Preliminar |
| Fecha de corte ficticia | 30/11/2026 |
| Documento | Acta y resolución de aprobación |

## 28. Personal y liquidaciones laborales

### Objetivo

Incorporar o integrar la gestión laboral necesaria sin imponer una liquidación de sueldos completa en la primera versión.

**Precisión 0.17:** por decisión del solicitante, la liquidación de sueldos y la gestión de RRHH pasan a formar parte del alcance del ERP, con GLMSUIT RRHH como referencia. La sección 104 lo especifica. La importación de este caso de uso se mantiene como alternativa para quien conserve su sistema laboral.

### Límite y relación con otros módulos

Módulo opcional pendiente de alcance. La propuesta inicial puede limitarse a importar resultados del sistema laboral; no implica implementar normas, convenios ni cálculo salarial.
### Alcance funcional


Se propone tratarlo como una decisión independiente de alcance.

Una solución propia podría contemplar legajos, novedades, licencias, conceptos, simulaciones, liquidaciones, recibos y contabilización. Sin embargo, no debe asumirse que es necesario desarrollar todo eso para competir en la gestión de servicios.

Se puede comenzar integrando el sistema laboral existente. La evidencia pública encontrada sobre ProCoop no alcanza para describir exhaustivamente su funcionamiento en esta área.

### Caso de uso de ejemplo — CU-28

**Actor:** Responsable de personal y contador.

**Situación inicial:** El sistema laboral externo cerró una liquidación y produjo un archivo autorizado.

**Desarrollo:**

1. Importar la referencia y los totales del período.
2. Validar correspondencia de centros de costo y evitar duplicados.
3. Enviar el resumen aprobado a contabilidad y tesorería.

**Resultado esperado:** Liquidación externa identificada y contabilizable sin recalcular salarios en esta plataforma.

**Excepción o control:** Si el archivo ya se importó o no coincide el total, detener y solicitar conciliación.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Lote | NOM-DEMO-2026-11 |
| Origen | Sistema laboral externo |
| Cantidad ficticia | 2 legajos |
| Total ficticio importado | ARS 2.000.000; no es cálculo salarial |

## 29. Seguridad, permisos y auditoría

### Objetivo

Administrar usuarios, roles y permisos en dos niveles —plataforma y cooperativa/tenant—, controlar quién puede actuar sobre cada ámbito y preservar evidencias de las operaciones relevantes.

### Límite y relación con otros módulos

Es transversal. Otorgar un rol no sustituye aprobaciones de negocio ni autoriza al usuario a acceder a otra organización. La auditoría registra hechos sin permitir su edición ordinaria.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Usuarios y roles de administración global de la plataforma.
- Usuarios, empleados y asociados/socios propios de cada cooperativa/tenant.
- Roles internos por tenant, incluyendo administrador de cooperativa, financiero y contable.
- Asignaciones de roles limitadas al tenant correspondiente.
- Roles por tarea y responsabilidad.
- Restricciones por organización y sucursal.
- Permisos sobre acciones específicas, definidos mediante roles.
- Perfiles de acceso a pantallas y navegación, diferenciados de los roles funcionales.
- Comprobación conjunta de tenant, usuario habilitado, perfil de pantalla y permiso de acción.
- Aprobaciones según importe o riesgo.
- Doble factor de autenticación y políticas para exigirlo según el tipo de cuenta y riesgo.
- Autenticación con Google mediante un flujo federado validado, conservando permisos y ámbito del tenant.
- Cambio y recuperación segura de contraseña, con segundo factor y procedimiento para pérdida de factores.
- Autenticación reforzada para operaciones sensibles.
- Controles de seguridad verificables y versionados, según sección 60.
- Auditoría de cada cambio persistente del sistema: datos de negocio, configuración, reglas, roles, perfiles y asignaciones.
- Registro de cambios con valores anteriores y posteriores, actor, momento, ámbito de plataforma o tenant, origen y resultado.
- Trazabilidad de cambios ejecutados por procesos, bots o integraciones; sin registrar contraseñas ni secretos.
- Consulta y exportación de auditoría sujetas a permisos; ver sección 54.
- Consulta de accesos relevantes.
- Gestión de sesiones.
- Restricción y registro de exportaciones.
- Protección de información sensible.
- Copias de seguridad y pruebas de recuperación.
- Seguimiento de acciones realizadas por integraciones.

**Regla:** no alcanza con ocultar botones; los permisos y el tenant autorizado deben verificarse también en el servidor.

**Dos niveles de autorización:** el administrador de plataforma y el administrador de cooperativa son perfiles distintos. Un administrador de cooperativa administra su propio tenant; sus permisos no se extienden a otras cooperativas ni a la configuración global. No se presupone acceso irrestricto del administrador de plataforma a datos operativos: ese alcance debe acordarse explícitamente. La matriz definitiva de permisos sigue pendiente.

**Precisión informada en la versión 0.4:** se diferencian usuarios, roles y perfiles. Los roles determinan las funciones y acciones permitidas; los perfiles determinan a qué pantallas se accede. La disponibilidad de una pantalla no autoriza por sí misma todas sus acciones. La sección 45 desarrolla esta distinción y sus ejemplos.

### Caso de uso de ejemplo — CU-29

**Actor:** Administrador de usuarios de la cooperativa/tenant, según el permiso que se defina.

**Situación inicial:** Se incorpora un empleado como usuario de la cooperativa ficticia TEN-001 para operar CAJ-01.

**Desarrollo:**

1. Dar de alta o vincular al usuario dentro de TEN-001 y asignar el rol Cajero, restringido a la sucursal correspondiente.
2. Permitir cobro y consulta de sus operaciones.
3. Intentar cambiar una tarifa o anular sin aprobación y verificar denegación y registro.

**Resultado esperado:** operador habilitado para sus tareas dentro de TEN-001 y bloqueado para acciones ajenas a su responsabilidad o datos de otro tenant.

**Excepción o control:** Si un usuario pierde su función, revocar permisos y sesiones según el procedimiento acordado.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Tenant | TEN-001 — Cooperativa Ejemplo A |
| Usuario | USR-CAJ-01 |
| Rol | Cajero |
| Permitido | Registrar cobros en CAJ-01 |
| Requiere aprobación | Anulación de recibo |
| No permitido | Editar tarifas |

## 30. Reportes y tableros

### Objetivo

Brindar indicadores reproducibles y consultas que permitan explicar resultados y detectar desvíos.

### Límite y relación con otros módulos

Consulta y agrega información; no corrige operaciones mediante edición de un tablero. Cada indicador debe declarar universo, período, fecha de corte y fórmula.
### Alcance funcional


**Requisito informado:** deben existir dashboards separados para el administrador de plataforma y para el administrador de cada tenant, además de alertas y acceso autorizado a auditoría. Los indicadores globales no habilitan por sí mismos acceso al detalle operativo de una cooperativa. La sección 54 desarrolla este alcance.

Como mínimo, se contemplan estos grupos:

| Área | Indicadores y consultas propuestas |
|---|---|
| Comercial | Contratos activos, solicitudes, altas, bajas y evolución. |
| Uso | Cantidades registradas, anomalías y pendientes de relevamiento. |
| Liquidación | Importes, variaciones, incidencias y documentos pendientes. |
| Recaudación | Cobros, canales, pendientes y diferencias. |
| Deuda | Antigüedad, evolución, acuerdos y recupero. |
| Operación | Trabajos, atrasos, incidentes y tiempos de resolución. |
| Materiales | Disponibilidad, movimientos y necesidades. |
| Finanzas | Posición, compromisos y proyección. |
| Resultados | Ingresos, costos y análisis por prestación. |
| Atención | Demanda, tiempos, recurrencia y satisfacción. |

Cada indicador debería tener una definición documentada y permitir llegar a los registros que lo componen.

### Caso de uso de ejemplo — CU-30

**Actor:** Gerente.

**Situación inicial:** El escenario de demostración contiene una factura de ARS 13.000 y pagos confirmados de ARS 5.000 y ARS 8.000.

**Desarrollo:**

1. Elegir el universo de esa factura y su fecha de corte.
2. Consultar importe emitido, cancelado y saldo.
3. Abrir el detalle y comparar con documentos e imputaciones.

**Resultado esperado:** Emitido ARS 13.000, cancelado ARS 13.000 y saldo ARS 0. La acreditación bancaria neta se presenta como otro indicador.

**Excepción o control:** Si hay pagos en proceso, separarlos de los confirmados para no sobrestimar la cobranza.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Universo | FAC-DEMO-001 únicamente |
| Emitido | ARS 13.000 |
| Cobros confirmados aplicados | ARS 13.000 |
| Saldo comercial | ARS 0 |

## 31. Integraciones, importaciones y migración

### Objetivo

Intercambiar datos y migrar información con controles de integridad, trazabilidad y conciliación.

### Límite y relación con otros módulos

Transporta y valida información según contratos de intercambio; no elude reglas de negocio ni transforma una importación técnicamente exitosa en aceptación funcional automática.
### Alcance funcional

El módulo contempla las siguientes operaciones:

- Una o varias APIs documentadas y tokenizadas para que cada cooperativa obtenga sus datos y los utilice en dashboards, BI u otras herramientas autorizadas.
- Clientes de integración, alcances, vencimiento, revocación y trazabilidad por tenant, según sección 59.
- API documentada.
- Credenciales y permisos por integración.
- Importaciones con validación previa.
- Exportaciones controladas.
- Identificadores externos.
- Registro de errores y reintentos.
- Prevención de duplicados.
- Seguimiento del estado de las interfaces.
- Herramientas para comparar datos migrados.
- Conciliación de saldos iniciales.
- Carga de históricos con su procedencia.
- Ejecuciones de prueba antes de la migración definitiva.

**Criterio:** la migración merece un proyecto propio. Importar personas y contratos es solo una parte; también hay que resolver saldos, documentos abiertos, equipos instalados y trazabilidad histórica.

### Caso de uso de ejemplo — CU-31

**Actor:** Implementador y responsable del área.

**Situación inicial:** Se recibe un archivo de demostración con tres suministros, uno de ellos inconsistente.

**Desarrollo:**

1. Ejecutar validación previa y mostrar los errores por fila.
2. Corregir la fila observada o excluirla de manera explícita y aprobar la carga.
3. Importar, comparar cantidades y saldos y conservar el reporte de conciliación.

**Resultado esperado:** Datos aceptados con identificador de ejecución y evidencia del control realizado.

**Excepción o control:** Si se repite el mismo lote, reconocerlo y evitar duplicados; una corrección debe tener una ejecución identificada.

### Datos y valores de ejemplo para precarga

| Campo o concepto | Valor ilustrativo |
|---|---|
| Lote | MIG-DEMO-001 |
| Filas recibidas | 3 |
| Filas inicialmente válidas | 2 |
| Error ilustrativo | Suministro sin titular asociado |

## 32. Particularidades según el servicio

El núcleo común puede compartirse, pero cada prestación puede necesitar una extensión:

| Prestación | Aspectos que se evaluarían específicamente |
|---|---|
| Electricidad | Características de conexión, medición especializada, demanda e infraestructura. |
| Agua | Estimaciones, pérdidas, inspecciones y modalidades de suministro. |
| Gas | Condiciones técnicas, inspecciones y ajustes de medición. |
| Internet | Planes, equipos del cliente, instalación y aprovisionamiento. |
| Telefonía | Numeración, registros de uso y relación con plataformas de telecomunicaciones. |
| Televisión | Paquetes, equipos y activaciones. |
| Servicios sociales | Beneficiarios, cobertura y autorizaciones. |

Estos son requisitos candidatos para validar, no una lista de funciones confirmadas de ProCoop ni obligaciones universales.

## 33. Entidades principales del modelo

Antes de diseñar pantallas, se propone definir estas diferencias:

| Entidad | Qué representa |
|---|---|
| Tenant/cooperativa | Organización con ámbito propio de datos, asociados, empleados, usuarios, roles internos, configuración de marca y landing. |
| Configuración de marca del tenant | Colores y recursos visuales vinculados a una cooperativa y a sus canales. |
| Diccionario del tenant | Términos, significados de referencia y denominaciones visibles elegidas por una cooperativa. |
| Etiqueta de interfaz | Texto visible identificado por una clave estable y un contexto; admite el valor por tenant permitido. |
| Versión de diccionario | Conjunto identificado de textos efectivos, con historial de cambios y alcance. |
| Configuración de landing del tenant | Contenidos, presentación de servicios y accesos de la landing de una cooperativa. |
| Usuario | Identidad de acceso a la aplicación; su relación con uno o varios tenants queda por definir. |
| Vinculación de usuario con tenant | Relación que determina en qué cooperativa puede actuar un usuario y en qué estado está habilitado. |
| Rol | Conjunto de permisos sobre funciones y acciones, de plataforma o de tenant, con alcances diferenciados. |
| Perfil de acceso | Conjunto de pantallas y opciones de navegación habilitadas para un usuario en su ámbito. |
| Turno o visita | Reserva de una franja y recursos para una actuación sobre un servicio, con estados y resultado. |
| Producto o subservicio | Componente comercial de una prestación, vinculado a planes, condiciones y conceptos. |
| Concepto facturable | Cargo o ajuste con base, periodicidad, disparador, vigencia y reglas, por ejemplo instalación o abono. |
| Promoción contractual | Beneficio aplicable a un contrato, con inicio, duración, base y reglas de finalización. |
| Custodia de equipo | Asignación trazable de un equipo a depósito, instalador o instalación del cliente. |
| Conformidad de instalación | Evidencia de aceptación o disconformidad vinculada a la actuación técnica y su versión. |
| Encuesta y respuesta | Instrumento de satisfacción y resultado vinculado a la visita/servicio, con procesamiento definido. |
| Beneficio y regla tarifaria | Condición versionada aplicable a un grupo, plan, contrato o beneficiario con base y vigencia. |
| Plan de cuentas | Estructura contable de una cooperativa; admite alternativas y versiones. |
| Cuenta contable | Clasificación de una imputación dentro de un plan; el ámbito real o simulado se identifica explícitamente. |
| Centro de costos | Unidad de análisis interno que recibe costos directos o asignados; no equivale necesariamente a un servicio. |
| Regla de distribución | Criterio versionado que reparte un importe entre centros/dimensiones sin duplicar su origen. |
| Escenario de simulación | Conjunto aislado de hipótesis, reglas y resultados sobre un universo de origen identificado. |
| Evento de auditoría | Evidencia de un cambio persistente, su actor, ámbito, origen y momento. |
| Alerta | Condición detectada, destinatarios autorizados y estado de tratamiento. |
| Cliente de API | Integración autorizada de una cooperativa, con identidad, permisos y ciclo de credenciales. |
| Régimen fiscal del tenant | Obligación identificada por organismo, impuesto, jurisdicción, carácter y vigencia. |
| Retención practicada | Importe retenido a un tercero y vinculado con pago, régimen, certificado y obligación de ingreso. |
| Presentación fiscal | Lote o declaración con versión, estado, respuesta, acuse y relación con operaciones de origen. |
| Noticia | Contenido de un tenant con canales de publicación y público destinatario. |
| Caso o ticket CRM | Expediente de pedido, reclamo u otra gestión, con seguimiento y relaciones con socio, servicio y cuenta. |
| Conversación y mensaje | Interacciones vinculadas al caso; distingue mensajes del socio, bot y personal autorizado. |
| Adjunto de caso | Foto u otro archivo vinculado al expediente y sujeto a sus permisos. |
| Área y derivación | Unidad responsable y registro de la asignación o transferencia del caso. |
| Asignación de rol | Relación entre usuario, rol y ámbito autorizado. |
| Empleado | Relación laboral u operativa de una persona con una cooperativa; no equivale automáticamente a un permiso de acceso. |
| Persona | Individuo u organización registrado en el ámbito de una cooperativa. |
| Asociado | Relación institucional con la cooperativa. |
| Inmueble | Lugar físico. |
| Referencia geográfica | Provincia, localidad y calle con identificación, origen y versión del catálogo. |
| Dirección de prestación | Domicilio normalizado y texto original, vinculado al inmueble y a uno o varios contratos, incluso del mismo servicio y de titulares distintos. |
| Ubicación georreferenciada | Coordenadas, fuente, precisión/estado de confirmación e historial del punto de prestación. |
| Contrato o suministro | Prestación contratada para una ubicación. |
| Equipo | Dispositivo físico identificable. |
| Instalación | Relación temporal entre equipo y ubicación. |
| Registro de lectura | Observación capturada. |
| Consumo validado | Cantidad aprobada para liquidar. |
| Liquidación | Resultado del cálculo comercial. |
| Comprobante | Documento emitido; para facturación de servicios, conserva el tenant, socio y servicio correspondiente. |
| Cuenta corriente | Registro de obligaciones y cancelaciones; separada o agrupada según la configuración del tenant. |
| Resumen de cuenta | Presentación del estado y documentos de una cuenta; no genera deuda adicional por repetir los importes que resume. |
| Pago | Operación de recepción de dinero. |
| Imputación | Aplicación de un pago o crédito a una obligación. |
| Reclamo | Caso de atención. |
| Orden técnica | Trabajo a ejecutar. |
| Movimiento contable | Registro económico asociado. |
| Capacidad de plataforma | Servicio que la plataforma sabe gestionar y puede habilitarse a un tenant. |
| Oferta del tenant | Servicio habilitado y publicado por una cooperativa para su comunidad, con configuración y versión propias. |
| Titular del contrato | Persona identificada por DNI o CUIT responsable de un contrato; distinta del usuario, ocupante o pagador. |
| Ciclo de facturación y universo | Calendario de corte, emisión y vencimientos aplicado a un conjunto definido de contratos de un servicio. |
| Lote de facturación | Ejecución identificable de un ciclo, con selección congelada, resultado por caso y excepciones. |
| Política de cuenta y mora | Configuración versionada de agrupación, mínimo de pago, instancias, avisos y efectos por servicio. |
| Trama de vencimientos | Conjunto de fechas de vencimiento de un comprobante y los recargos aplicables a cada una. |
| Concepto por cuenta de terceros | Importe que la cooperativa cobra para otro organismo o entidad bajo convenio, con rendición separada. |
| Copia de configuración | Ejecución trazable que lleva componentes de un servicio de un tenant a otro sin datos operativos. |
| Unidad y derecho de sepultura | Recurso físico de cementerio parque y derecho sobre él, distintos de la ocupación y del pagador. |
| Convenio de cobertura | Acuerdo con un prestador externo, por ejemplo banco de sangre, con vigencia, beneficiarios y condiciones. |
| Consentimiento y finalidad | Registro de la base y finalidad con que se tratan los datos personales de una persona en un tenant. |

Esta separación evita problemas posteriores, especialmente en mudanzas, cambios de titular, sustitución de equipos, pagos parciales y correcciones.

## 34. Escenarios de validación funcional

Además de recorrer pantallas, deben probarse escenarios completos:

1. Una persona contrata varias prestaciones en distintos domicilios.
2. Cambia el titular a mitad de un período.
3. Se reemplaza un equipo entre dos lecturas.
4. Llega una lectura válida después de haber estimado.
5. Cambia una tarifa y se necesita reproducir una liquidación anterior.
6. Un proceso masivo se interrumpe y continúa sin duplicados.
7. Se recibe dos veces la misma confirmación de pago.
8. Un pago queda pendiente y luego es rechazado.
9. Se cancela parcialmente una obligación.
10. Se corrige un documento ya emitido.
11. Se realiza un acuerdo sobre deuda existente.
12. Una cuadrilla devuelve materiales sobrantes.
13. Se intenta modificar una operación de un período cerrado.
14. Se migran saldos y deben coincidir con el sistema de origen.
15. Se restaura una copia y se comprueba que la operación puede continuar.
16. Un usuario de TEN-001 intenta consultar, modificar o exportar datos de TEN-002 y se deniega la operación.
17. Un administrador de cooperativa intenta asignarse privilegios globales de plataforma y se deniega la operación.
18. Un socio consulta únicamente sus cuentas autorizadas dentro del tenant correspondiente.
19. Una búsqueda o reporte incluye solo el tenant autorizado, incluso si otra cooperativa utiliza los mismos códigos internos.
20. Se revoca una asignación de rol en una cooperativa y se comprueba que el usuario pierde el acceso a las operaciones afectadas.
21. Se configura la marca de TEN-001 y se comprueba que no modifica los colores ni logos de TEN-002.
22. El alta de un tenant habilita su administración y la disponibilidad de su landing, según el circuito de configuración y publicación que se defina.
23. Un socio ingresa desde la landing de TEN-001 y conserva ese ámbito al acceder a su aplicación.
24. Se solicita activar o desactivar un servicio y se distingue el resultado inmediato de una solicitud pendiente de aprobación o ejecución técnica.
25. Un socio tiene dos servicios y recibe dos facturas independientes, aunque el tenant agrupe su cuenta corriente.
26. Una cooperativa habilita agrupación y otra mantiene separación; las configuraciones no se afectan entre sí.
27. Un resumen muestra el total de sus facturas sin volver a contabilizarlo como otra obligación.
28. Un pago aplicado a una factura reduce su saldo y el total agrupado de forma consistente.
29. Se comprueba que un resumen no incorpora facturas de otro socio ni de otro tenant.
30. Un usuario ve una pantalla mediante su perfil, pero no puede ejecutar una acción que su rol no permite.
31. Una noticia exclusiva para empleados no aparece en la landing ni en la app de socios.
32. Un socio crea un reclamo con foto por chat; recibe un ticket y el caso llega a supervisión con servicio y cuenta identificados.
33. El supervisor deriva el ticket a un área y el empleado conserva conversación, fotos e historial al resolverlo.
34. Una propuesta de clasificación de IA equivocada puede corregirse y no provoca una baja o cobro por sí sola.
35. Se puede solicitar alta y baja de cada servicio ofertado por el tenant, distinguiendo solicitud y ejecución efectiva.
36. Dos socios intentan reservar el último turno y se evita confirmar el mismo recurso dos veces.
37. Un socio completa el ciclo solicitud–visita–prestación–consumo–factura–pago–reclamo–baja.
38. Se combinan reglas por grupo y plan respetando bases, topes, prioridades y vigencias.
39. Una simulación de cambio tarifario no emite facturas ni modifica deuda real.
40. Se compara un plan contable operativo con uno alternativo sin duplicar asientos oficiales.
41. Una suspensión y reactivación aplican únicamente costos habilitados y explicados; solicitar baja no genera cargo por baja.
42. Cada cambio persistente, incluidos los de procesos automáticos, puede rastrearse mediante auditoría.
43. El dashboard de un tenant no muestra datos de otro; el de plataforma respeta sus permisos globales.
44. La baja pública de un servicio alcanzado no exige crear una cuenta previamente.
45. Un token de BI de TEN-001 no consulta datos de TEN-002 ni ejecuta escrituras fuera de su alcance.
46. Revocar o vencer una credencial de integración impide su uso posterior según el plazo técnico definido.
47. El acceso con Google no concede afiliación ni roles por mera coincidencia de correo.
48. La recuperación de contraseña no elimina el segundo factor ni permite su reinicio con un correo solamente.
49. Un certificado o presentación fiscal se vincula con la cooperativa, régimen y operaciones de origen correctos.
50. Reintentar una presentación fiscal no duplica retenciones ni da por aceptado un envío rechazado.
51. TEN-001 utiliza Socio y TEN-002 utiliza Asociado para el mismo concepto interno, sin cambiar datos ni permisos.
52. Una etiqueta del tenant se actualiza de forma consistente en los canales configurados y no aparece en otro tenant.
53. Si falta una etiqueta personalizada, se utiliza el texto base previsto en lugar de una clave técnica vacía.
54. Cambiar un nombre visible no altera los campos de API, códigos de estado, facturas históricas ni reglas de negocio.
55. Un cambio del diccionario queda auditado y solo puede realizarlo un usuario autorizado.
56. Una cooperativa ofrece Agua, Electricidad y Cementerio parque y otra solo Electricidad y Gas; sus catálogos no se mezclan.
57. Deshabilitar una oferta no elimina contratos, cuentas, facturas ni historia existentes.
58. Una persona se registra antes de ser asociada y puede solicitar un servicio ofertado sin obtener acceso a datos ajenos.
59. Un ciclo batch selecciona clientes de su universo y evita duplicar un mismo contrato/servicio/período por solapamiento o reintento.
60. Un caso que solicita factura A y carece de CUIT se identifica antes de emitir, mientras los otros casos válidos continúan.
61. Una respuesta fiscal autorizada con observaciones se conserva como tal y no se reemite como si fuera un rechazo.
62. Una política de mora unificada evalúa cada servicio y sus restricciones antes de ordenar suspensión o reactivación.
63. Un importe reclamado, protegido o con pago en proceso se trata conforme a las reglas definidas, sin generar un corte ciego por el saldo agregado.
64. Un producto de internet aplica una instalación única, un abono mensual y una promoción de duración limitada sin duplicar conceptos.
65. Un cambio de estado En camino aparece al socio correcto y no revela información de otra visita.
66. Un módem asignado al instalador solo se registra una vez como aplicado a la instalación y conserva su trazabilidad.
67. La conformidad firmada queda vinculada a la orden y no se altera silenciosamente al editar datos posteriores.
68. Una encuesta no respondida no bloquea por sí misma la activación de un servicio instalado.
69. El primer período aplica la fecha efectiva y las reglas de prorrateo, descuento y cobro anticipado/vencido aprobadas.
70. Repetir la sincronización de cierre de instalación no duplica activación, salida de equipo, encuesta ni cargo.
71. Cada factura y cobro se puede rastrear a sus imputaciones comerciales y asientos reales, con saldos conciliados por servicio y asociado.
72. Una distribución entre centros de costos conserva el importe total de origen y no registra dos veces el gasto.
73. Cambiar un criterio en un escenario simulado no modifica cuentas, centros ni movimientos de producción.
74. Una cuenta corriente unificada permite explicar el saldo de cada servicio contratado sin volver a contabilizar el resumen.
75. El análisis por centro distingue ingresos/costos de los importes efectivamente cobrados y sus saldos pendientes.
76. Buscar una calle homónima devuelve opciones acotadas por localidad/provincia y no elige otra localidad silenciosamente.
77. Un domicilio no hallado puede registrarse con evidencia y revisión, sin inventar coordenadas ni impedir toda solicitud.
78. El mapa del domicilio de prestación no se sustituye por la posición actual del dispositivo del usuario.
79. Una orden de compra con líneas para varios servicios conserva una única compra y cantidades/importe conciliados.
80. Recepción, stock, aplicación a un servicio y pago a proveedor se concilian sin duplicar equipos ni gastos.
81. La cuenta corriente, facturación, cobranza y tesorería permiten seguir un mismo documento hasta su cancelación y acreditación.
82. Se copia un servicio de TEN-001 a TEN-002 como configuración independiente, sin trasladar socios, contratos, deuda, stock ni secretos.
83. Un cambio posterior en el servicio de TEN-001 no modifica automáticamente la configuración copiada en TEN-002.
84. La copia detecta referencias exclusivas del origen y solicita sustitución o resolución antes de publicar.
85. Lanzar la oferta copiada la hace disponible a usuarios del destino sin contratarla automáticamente para toda su comunidad.
86. Las capacidades comunitarias reutilizadas de Connectyx conservan aislamiento, marca, lenguaje y permisos del tenant destino.
87. Dos titulares con DNI distintos contratan Internet en el mismo domicilio, con equipos, facturas, pagos y baja independientes.
88. El incumplimiento o baja de un hermano no se imputa al otro por coincidencia de dirección.
89. Un servicio no se activa sin titular e identificación DNI/CUIT requerida; el registro inicial de usuario puede seguir siendo simple.
90. Una tarifa eléctrica de abastecimiento a la cooperativa no se aplica como precio minorista por defecto.
91. Un servicio de agua no medido no calcula un consumo ficticio como si existiera medidor.
92. Gas registra las correcciones y cantidades facturables conforme a su régimen, sin reutilizar sin cambios la fórmula de agua.
93. La baja de un abono de Cementerio parque no elimina la ocupación ni los derechos de sepultura.
94. Banco de sangre como cobertura por convenio no genera stock comercial ni precio por unidad de sangre.
95. Las reglas copiadas de un tenant se adaptan a la jurisdicción y modalidad reales de cada servicio antes de publicarse.

## 35. Estrategia inicial de desarrollo

Se recomienda elegir una cooperativa piloto y una prestación concreta, antes de implementar todos los componentes simultáneamente.

| Etapa | Resultado esperado |
|---|---|
| 1. Relevamiento | Procesos reales, documentos, reglas, excepciones y alcance acordado. |
| 2. Núcleo comercial | Personas, contratos, catálogo, tarifas y cuenta corriente. |
| 3. Ciclo operativo | Relevamiento o novedades, validación, liquidación y emisión. |
| 4. Cobro | Cajas, pagos externos, imputación y conciliación. |
| 5. Atención | Portal, solicitudes, reclamos y órdenes. |
| 6. Administración | Compras, materiales, tesorería y contabilidad o sus integraciones. |
| 7. Extensiones | Otras prestaciones, infraestructura avanzada y módulos opcionales. |

**Primera versión útil:** completar un ciclo real de registrar un contrato, determinar lo que corresponde cobrar, emitir, recibir el pago, imputarlo y explicar el saldo.

Para conocer con mayor precisión el sistema actual de ProCoop, se necesita un relevamiento autorizado de una instalación real: menú completo, demostraciones por rol, documentos de salida y ejemplos de excepciones. Ese material permitiría transformar este mapa en una especificación verificable, con funciones identificadas, pantallas, reglas y criterios de aceptación.

El diferencial más difícil de reproducir será la combinación de reglas comerciales, históricos, conciliación y excepciones operativas. El punto de partida recomendado es documentar ese núcleo con una cooperativa piloto y construir una implementación propia.

## 36. Fuentes del relevamiento público

Fuentes consultadas durante la investigación inicial del 3 de noviembre de 2026. La fecha de consulta no implica que toda la documentación corresponda a la última versión del producto.

- **[F1] ProCoop Gestión, sitio del fabricante:** https://www.procoopsrl.com.ar/productos/p-gestion.html
- **[F2] ProCoop P-Móvil, sitio del fabricante:** https://www.procoopsrl.com.ar/productos/p-movil.html
- **[F3] CoopOnline, ficha del desarrollador en Google Play:** https://play.google.com/store/apps/details?hl=es_AR&id=com.Procoop.CoopOnline
- **[F4] Funcionamiento Web ProCoop, instructivo publicado por CoopCosecha, versión 1.0 del 25/11/2021:** https://www.coopcosecha.com.ar/pdf/procoop.pdf
- **[F5] Fecescor, 6.º Encuentro de Gerentes y/o Jefes Administrativos de Cooperativas, presentación de ProCoop sobre novedades laborales y contables 2026:** https://fecescor.com.ar/evento/6to-encuentro-de-gerentes-y-o-jefes-administrativos-de-cooperativas/

## 37. Pendientes para continuar el trabajo

- [ ] Definir cooperativa piloto y prestaciones iniciales.
- [ ] Validar módulos necesarios para la primera versión.
- [ ] Relevar una instalación autorizada de referencia.
- [ ] Obtener muestras de comprobantes y reportes sin datos personales innecesarios.
- [ ] Documentar reglas tarifarias y casos excepcionales.
- [ ] Desglosar funciones en requisitos con identificadores estables.
- [ ] Definir roles, permisos y aprobaciones.
- [ ] Diseñar procesos y pantallas por módulo.
- [ ] Diseñar modelo de datos y relaciones.
- [ ] Identificar integraciones y condiciones de acceso.
- [ ] Definir migración y conciliación de saldos.
- [ ] Convertir los escenarios funcionales en criterios de aceptación.
- [ ] Estimar etapas una vez acordado el alcance.

## 38. Historial de cambios

| Versión | Fecha | Cambio |
|---|---|---|
| 0.17 | 2026-11-03 | Integración completa del complemento de análisis funcional y diseño (AGR-001 a AGR-036, hipótesis de diseño, escenarios ESC-01 a ESC-05, orden de trabajo y plantilla de decisión) con su correspondencia de referencias; factura multiservicio por grupos de facturación como modalidad válida junto a la separada (FAC-005 a FAC-012); liquidación de sueldos y gestión de RRHH incorporadas al alcance con GLMSUIT RRHH como referencia (SUE-001 a SUE-014); mapa de ocho soluciones a diseñar. El anexo pasa a la sección 107. |
| 0.16 | 2026-11-03 | Relevamiento de 14 sistemas del mercado argentino y matriz comparativa; nuevos requisitos MER-001 a MER-020: usuario-generador (Ley 27.424 y RG ARCA 5746/2025), comprobante Liquidación de Servicios Públicos y regímenes informativos, grandes usuarios, consumo no registrado, garantías, incobrables y gestión judicial, cobradores, reparto de facturas, obras y contribución por mejoras, cargos de ventas en factura, capital y excedentes, workflow de autorizaciones, generador de reportes, informes regulatorios, telefonía, red de ISP, flota, mesa de entradas, garantías de equipos, autolectura, facturación in situ y salida del cliente. El anexo pasa a la sección 102. |
| 0.15 | 2026-11-03 | Revisión de coherencia del documento completo; incorporación del relevamiento local de la base DEMO de ProCoop; requisitos complementarios de protección de datos personales, factura electrónica ARCA, vencimientos y recargos, conceptos por cuenta de terceros, prepago, telemedición, canales de cobro, capital cooperativo, requisitos no funcionales, ambientes y migración desde ProCoop; catálogo de precarga con Cementerio parque y Banco de sangre; nuevas entidades; el anexo de mensajes pasa a la sección 99. |
| 0.14 | 2026-11-03 | Anexo final con los 20 mensajes originales del solicitante de este hilo, ordenados y transcritos sin correcciones, incluidas consultas, reiteraciones e indicaciones de trabajo. |
| 0.13 | 2026-11-03 | Titular DNI/CUIT y múltiples conexiones independientes en un domicilio; investigación por servicio y jurisdicción: Internet, Electricidad/Agua de Córdoba, Gas, Cementerio parque, Banco de sangre y prestaciones complementarias; catálogo de reglas y procesos específicos con fuentes. |
| 0.12 | 2026-11-03 | Independencia de configuración por servicio y tenant; copia de configuración entre cooperativas para lanzar ofertas; Connectyx como referencia prioritaria de comunidad y registro de la ruta local indicada por el solicitante. |
| 0.11 | 2026-11-03 | Catálogo nacional de calles y direcciones, georreferenciación de prestación y Google Maps; refuerzo de órdenes de compra y stock vinculados con servicios, e integración de cuentas corrientes, facturación, cobranza y tesorería. |
| 0.10 | 2026-11-03 | Refuerzo del ERP contable: centros de costos, cuentas reales y simuladas, reglas de imputación/distribución y trazabilidad conciliada entre facturación, cobros y cuentas corrientes por asociado y servicio. |
| 0.9 | 2026-11-03 | Productos/subservicios y conceptos por plan, promociones temporales y financiación; instalación integral con cita, En camino, equipo del instalador, conformidad firmada, stock y encuesta; activación y primer cobro con prorrateo y modalidad anticipada/vencida. |
| 0.8 | 2026-11-03 | Catálogo de capacidades y servicios habilitables por tenant, Cementerio parque, registro público sencillo, políticas de cuenta y mora configurables con límites por servicio; ciclos de corte y facturación batch con excepciones y corrección por caso; fuentes fiscales y regulatorias. |
| 0.7 | 2026-11-03 | Diccionario de términos y etiquetas de UI configurables por cooperativa desde el inicio; extensión de identidad visual a lenguaje; claves estables, alcance multicanal, ejemplos y controles de consistencia. |
| 0.6 | 2026-11-03 | Advertencia expresa de revisión arquitectónica ERP/CRM; APIs tokenizadas y acceso de cooperativas a sus datos; seguridad actual, 2FA, Google y recuperación; módulo de organismos gubernamentales y agentes de retención, con fuentes oficiales; posicionamiento frente a ProCoop y solución SaaS multitenant en la nube sin servidores del tenant. |
| 0.5 | 2026-11-03 | Autogestión integral y visitas; P × Q y excepciones por grupos y planes; investigación oficial argentina de subsidios, tributos y bajas; suspensión/reactivación con costos habilitados; dashboards, alertas y auditoría de cada cambio; ERP y múltiples planes de cuentas con simulaciones aisladas. |
| 0.4 | 2026-11-03 | Precisión de roles funcionales y perfiles de pantallas; noticias por landing y apps; CRM de pedidos y reclamos con chat, bot, IA, fotos y tickets derivados por supervisión; solicitudes de alta y baja de cualquier servicio; reafirmación de facturación separada y agrupación opcional. |
| 0.3 | 2026-11-03 | Incorporación de requisitos informados: estructura multitenant, cooperativa como tenant, administración global y roles internos; identidad visual por canal, administración y landing configurable de cada cooperativa, consulta y activación/desactivación de servicios; facturación separada por servicio y agrupación opcional de cuenta corriente y resumen; ajustes de entidades y validación. |
| 0.2 | 2026-11-03 | Ampliación de los 29 módulos con objetivo, límite, alcance, caso de uso y datos ilustrativos; incorporación de catálogos de precarga y circuito integrado de facturación y cobro. |
| 0.1 | 2026-11-03 | Creación a partir del relevamiento y la propuesta funcional desarrollados en la conversación; incorporación de fuentes y pendientes de trabajo. |

## 39. Catálogos y parámetros de ejemplo para precarga

### 39.1. Finalidad y reglas de precarga

La precarga permite recorrer una demostración sin inventar datos en cada pantalla. Incluye catálogos seleccionables, valores sugeridos y registros ficticios relacionados. No equivale a cargar precios vigentes en una organización real.

- Seleccionar un servicio puede sugerir unidad, periodicidad y requisitos del plan.
- Seleccionar un contrato propone el titular, inmueble y tarifa vigente, sin sobrescribir cambios históricos.
- Seleccionar un comprobante para cobrar propone su saldo pendiente, pero el operador puede registrar un pago parcial si tiene permiso.
- Una configuración sensible requiere aprobación; no se acepta silenciosamente un valor sugerido.
- Un dato desconocido queda vacío o pendiente. No se reemplaza por cero, una fecha inventada o una autorización supuesta.
- Los datos de demostración deben identificarse y mantenerse separados de los datos operativos.

### 39.2. Servicios, unidades y formas de liquidación

| Código | Servicio de ejemplo | Plan | Unidad o base | Modalidad ilustrativa | Cargo de ejemplo | Requisito de ejemplo |
|---|---|---|---|---|---|---|
| ELE | Electricidad | ELE-RES — Residencial | kWh | Medido | ARS 4.000 fijos + ARS 100/kWh | Factibilidad y medidor instalado |
| AG | Agua | AG-RES — Residencial | m³ | Medido | ARS 3.000 fijos + ARS 500/m³ | Conexión y medidor instalado |
| GAS | Gas | GAS-RES — Residencial | m³ | Medido; fórmula simplificada para demostración | ARS 3.500 fijos + ARS 200/m³ | Aprobación técnica y medición |
| INT | Internet | INT-100 — Fibra 100 | Contrato/mes | Abono no medido en este ejemplo | ARS 25.000/mes | Cobertura y equipo instalado |
| TEL | Telefonía | TEL-BAS — Básico | Contrato/mes y minutos | Abono con uso adicional | ARS 6.000/mes + ARS 20/minuto adicional | Línea activa; reglas de uso a definir |
| TV | Televisión | TV-BAS — Básico | Contrato/mes | Abono | ARS 15.000/mes | Cobertura y activación |
| SOC | Servicios sociales | SOC-FAM — Familiar | Grupo/mes | Cobertura familiar ficticia | ARS 8.000/mes | Beneficiarios registrados y cobertura aprobada |
| CEM | Cementerio parque | CEM-PAR — Parcela | Derecho/unidad y mantenimiento | Derecho adquirido más mantenimiento periódico | Sin importe precargado | Unidad disponible, instrumento firmado y reglamento vigente; ver sección 90 |
| SAN | Banco de sangre | SAN-CONV — Cobertura por convenio | Grupo/beneficiario | Cobertura administrativa por convenio | ARS 0 al socio en la modalidad financiada por la cooperativa | Convenio vigente y beneficiarios registrados; ver sección 91 |

**Todos los importes y fórmulas de esta tabla son inventados.** El gas y la electricidad pueden necesitar reglas mucho más complejas en una implementación real. Las coberturas sociales y las condiciones de telecomunicaciones deben relevarse específicamente.

### 39.3. Conceptos que pueden configurar una liquidación

| Código | Concepto | Ejemplo de dato | Origen del valor | Validación o decisión pendiente |
|---|---|---|---|---|
| CF-AG | Cargo fijo de agua | ARS 3.000 | Versión de tarifa | Vigencia y aplicabilidad |
| CV-AG | Consumo de agua | 20 m³ × ARS 500 | Consumo aprobado y tarifa | No usar lectura capturada sin validar |
| AB-INT | Abono de internet | ARS 25.000/mes | Plan y tarifa | Prorrateo y fecha de inicio a definir |
| BON-PROM | Bonificación promocional | 10 % sobre abono de internet | Promoción autorizada | Base, duración y compatibilidad |
| INS-INT | Instalación de internet | ARS 30.000 por única vez | Cargo aprobado | Cuándo se devenga y si puede financiarse |
| CUO-VEN | Cuota de venta adicional | ARS 30.000; cuota 1 de 3 | Venta financiada | No duplicar con otra obligación |
| AJU-COM | Ajuste comercial | Importe sujeto a aprobación | Expediente autorizado | Motivo y documentación correctiva |
| TRIB-PEND | Tributos aplicables | Sin valor precargado | Configuración específica | Relevamiento y validación fiscal antes de operar |
| REC-PEND | Recargo por mora | Deshabilitado en la demostración | Política autorizada | Base, tasa, períodos y excepciones a definir |

**Ejemplo de promoción:** abono de internet ARS 25.000 menos bonificación de ARS 2.500 = ARS 22.500, sin modelar otros conceptos. Una instalación de ARS 30.000 es un cargo distinto; no se suma automáticamente todos los meses.

### 39.4. Medios de cobro y confirmación

| Código | Medio | Valor sugerido al cobrar | Cuándo se registra como confirmado | Control |
|---|---|---|---|---|
| EFE | Efectivo | Saldo pendiente del documento | Cuando el cajero registra y confirma la recepción | Caja abierta y recibo |
| TRA | Transferencia | Saldo pendiente | Cuando se verifica la operación según el circuito acordado | Una imagen de comprobante no confirma por sí sola |
| QR | Pago QR | Saldo pendiente | Confirmación verificable del proveedor | Identificador único y prevención de duplicados |
| TAR | Tarjeta por proveedor integrado | Saldo pendiente | Estado autorizado/confirmado definido para la integración | Rechazos, devoluciones y contracargos |
| DEB | Débito automático | Obligaciones elegibles | Resultado confirmado de la presentación | Rechazos y reintentos controlados |
| REC | Entidad recaudadora externa | Según documento o rendición | Rendición validada según el contrato operativo | Conciliación de bruto, cargos y neto |

La habilitación de cada medio y la contratación de sus proveedores quedan pendientes. La tabla no afirma integraciones ya disponibles.

### 39.5. Estados seleccionables de ejemplo

| Entidad | Estados ilustrativos | Control principal |
|---|---|---|
| Solicitud | Borrador; Pendiente de documentación; En evaluación; Aprobada; Rechazada; Cancelada | Aprobar una solicitud no implica servicio instalado |
| Contrato | Solicitado; Pendiente de instalación; Activo; Suspendido; Cerrado | Fechas efectivas y condiciones de cada cambio |
| Lectura | Capturada; Observada; Validada; Reemplazada por corrección trazable | Conservar el registro original |
| Liquidación | Borrador; Con observaciones; Aprobada; Emitida | Evitar modificación del cálculo que respalda un documento definitivo |
| Comprobante | Borrador; Pendiente de emisión; Emitido; Corregido mediante documento vinculado | Separar estado documental de saldo |
| Saldo de obligación | Pendiente; Parcialmente cancelado; Cancelado | Se deriva de movimientos e imputaciones, no de edición libre |
| Pago externo | Iniciado; Pendiente; Confirmado; Rechazado; Devuelto; Con contracargo | Transiciones permitidas según proveedor |
| Orden técnica | Pendiente; Asignada; En ejecución; Visita fallida; Ejecutada; Revisada; Cancelada | Ejecución y revisión son hitos distintos |
| Reclamo | Abierto; Asignado; En tratamiento; Resuelto; Cerrado; Reabierto | Registrar motivo, responsable y cambios |

Los estados definitivos, sus nombres y las transiciones autorizadas deben validarse. No todos los usuarios podrán cambiar cualquier estado.

### 39.6. Roles y valores sugeridos

| Rol | Acceso de ejemplo | Valores propuestos al operar | Restricción relevante |
|---|---|---|---|
| Atención | Personas, solicitudes y consultas | Canal Presencial; sucursal del operador | No modifica importes emitidos |
| Lecturista | Rutas asignadas y capturas | Ruta asignada; equipo esperado | No cambia tarifas ni aprueba consumos observados |
| Supervisor de consumos | Control de cantidades | Período abierto | Debe justificar correcciones |
| Facturación | Simulación, revisión y emisión | Período abierto y tarifa vigente | No reemite sin controlar el estado previo |
| Cajero | Cobros y cierre de su caja | Caja del turno; saldo pendiente | Anulación con aprobación según reglas |
| Técnico | Órdenes asignadas | Cuadrilla y trabajos asignados | No activa condiciones comerciales excepcionales |
| Tesorería | Conciliación y fondos | Cuenta seleccionada explícitamente | No confunde bruto cobrado con neto acreditado |
| Contabilidad | Asientos e informes | Ejercicio y período habilitados | Bloqueo de períodos cerrados |
| Asociado | Sus cuentas autorizadas | Contrato seleccionado | Sin acceso a terceros no autorizados |

## 40. Ejemplo integrado: agua, liquidación y dos cobros

### 40.1. Objetivo del circuito

Mostrar cómo se relacionan los módulos y los valores de demostración desde la contratación hasta la cancelación de una factura. Este ejemplo es una única secuencia; los casos individuales de las secciones anteriores pueden representar momentos distintos.

### 40.2. Datos iniciales

| Dato | Valor |
|---|---|
| Titular ficticia | PER-001 — Ana Pérez |
| Asociada | ASO-001 |
| Inmueble ficticio | INM-001 — Calle Ejemplo 100 |
| Contrato activo | SUM-AG-001 |
| Servicio y plan | AG — Agua; AG-RES — Residencial |
| Medidor | MED-001 |
| Lecturas de demostración | Anterior: 1.250 m³; actual: 1.270 m³ |
| Consumo aprobado | 20 m³ |
| Tarifa de demostración | Cargo fijo ARS 3.000; variable ARS 500/m³ |
| Tributos | No modelados en este ejercicio |

### 40.3. Pasos y resultados

| Paso | Responsable funcional | Acción | Resultado |
|---|---|---|---|
| 1 | Personas | Identificar a Ana y su relación de asociada | PER-001 y ASO-001, sin duplicados |
| 2 | Contratos | Verificar SUM-AG-001 activo en INM-001 | Prestación elegible para el período |
| 3 | Lecturas | Capturar 1.270 m³ | Registro pendiente de validación |
| 4 | Consumos | Comparar con 1.250 m³ y aprobar | 20 m³ liquidables |
| 5 | Tarifas | Calcular ARS 3.000 + (20 × ARS 500) | Liquidación base ARS 13.000 |
| 6 | Facturación | Revisar, aprobar y emitir | FAC-DEMO-001 por ARS 13.000 |
| 7 | Cuenta corriente | Registrar la obligación | Saldo ARS 13.000 |
| 8 | Caja | Cobrar ARS 5.000 en efectivo | REC-DEMO-001; saldo ARS 8.000 |
| 9 | Portal y pagos | Iniciar pago digital del saldo | Operación pendiente; saldo sigue ARS 8.000 |
| 10 | Integración | Confirmar TX-DEMO-001 por ARS 8.000 una sola vez | Pago confirmado y factura cancelada |
| 11 | Conciliación | Conciliar bruto ARS 8.000, comisión ARS 160 y neto ARS 7.840 | Diferencia explicada por cargo del proveedor |
| 12 | Tesorería y contabilidad | Registrar acreditación y efecto contable | Fondos y auxiliares conciliados |
| 13 | Reportes | Consultar el universo de esa factura | Emitido ARS 13.000; cancelado ARS 13.000; saldo ARS 0 |

### 40.4. Valores sugeridos en las pantallas

- **Al elegir Agua residencial:** sugerir unidad m³, ciclo mensual y necesidad de medidor; vincular la tarifa que corresponda a la fecha.
- **Al abrir SUM-AG-001:** mostrar titular, inmueble y equipo desde relaciones vigentes, sin volver a escribirlos.
- **Al validar consumo:** recuperar lectura anterior, mostrar actual y calcular la diferencia; exigir revisión si aparece una inconsistencia.
- **Al simular la liquidación:** completar conceptos desde la tarifa y cantidades aprobadas; mostrar el detalle antes de aprobar.
- **Al cobrar por primera vez:** sugerir ARS 13.000 como importe pendiente; permitir cambiar a ARS 5.000 si se autoriza el pago parcial.
- **Al iniciar el segundo cobro:** recuperar saldo actualizado ARS 8.000, no el total original.
- **Al recibir confirmación digital:** completar identificador, importe y estado desde la respuesta validada del proveedor; no desde campos manipulables del navegador.
- **Al conciliar:** comparar la operación confirmada con la rendición y el banco; registrar explícitamente la comisión.

### 40.5. Comprobaciones del ejemplo

| Comprobación | Cálculo | Resultado |
|---|---|---|
| Consumo | 1.270 − 1.250 | 20 m³ |
| Variable | 20 × ARS 500 | ARS 10.000 |
| Liquidación | ARS 3.000 + ARS 10.000 | ARS 13.000 |
| Saldo tras primer pago | ARS 13.000 − ARS 5.000 | ARS 8.000 |
| Saldo final | ARS 13.000 − ARS 5.000 − ARS 8.000 | ARS 0 |
| Acreditación digital neta | ARS 8.000 − ARS 160 | ARS 7.840 |
| Fondos recibidos de ambos cobros, netos del cargo digital | ARS 5.000 + ARS 7.840 | ARS 12.840 |
| Explicación de la diferencia | ARS 13.000 − ARS 12.840 | ARS 160 de comisión; no es deuda de Ana |

El efectivo inicial de caja no es ingreso por esta factura. Tampoco se debe restar la comisión al importe cancelado por la asociada.

## 41. Definiciones pendientes sobre límites y ejemplos

Estos puntos se mantienen abiertos hasta recibir la información de la cooperativa:

- [ ] Confirmar los nombres y agrupaciones de módulos que necesita el solicitante.
- [ ] Determinar cuáles son obligatorios, opcionales o integraciones con sistemas existentes.
- [ ] Sustituir los servicios y planes ficticios por el catálogo real aprobado.
- [ ] Definir cuadros tarifarios, vigencias, tributos, redondeo y prorrateos.
- [ ] Confirmar qué valores se sugieren, cuáles se pueden editar y cuáles requieren aprobación.
- [ ] Definir la política de pagos parciales, anticipos, imputaciones y anulaciones.
- [ ] Elegir medios y proveedores de cobro y documentar cuándo se confirma cada operación.
- [ ] Validar roles y responsables por módulo.
- [ ] Confirmar los límites entre atención, contratos, técnica, facturación y contabilidad.
- [ ] Reemplazar los datos ficticios por casos de prueba autorizados cuando corresponda.

La descripción por módulo se incorporó en la versión 0.2. La versión 0.3 añade la estructura multitenant informada por el solicitante. Las decisiones pendientes continúan abiertas y los importes ilustrativos no constituyen condiciones comerciales aprobadas.

## 42. Cooperativas como tenants, usuarios y roles — requisitos informados

### 42.1. Origen y estado

Información aportada por el solicitante el 3 de noviembre de 2026. Estos requisitos corresponden al sistema propio y se incorporan como base de trabajo. No se atribuyen a ProCoop. Los detalles que todavía no se informaron se mantienen pendientes.

### 42.2. Requisitos recibidos

| Identificador | Requisito informado | Consecuencia funcional |
|---|---|---|
| MT-001 | La aplicación debe ser multitenant. | La plataforma debe reconocer y respetar el ámbito de cada organización. |
| MT-002 | Cada cooperativa será un tenant. | La cooperativa es la unidad de separación y administración organizacional. |
| MT-003 | Existirá un administrador de la plataforma. | Se requiere un nivel de administración global diferenciado de los usuarios de cooperativas. |
| MT-004 | Cada tenant tendrá sus propios asociados/socios. | El padrón y las relaciones de asociados se administran dentro de su cooperativa. |
| MT-005 | Cada tenant tendrá sus propios usuarios y roles internos. | Las asignaciones de acceso son específicas del tenant y no se trasladan implícitamente entre cooperativas. |
| MT-006 | Se contemplan perfiles de administrador, financiero y contable dentro de cada tenant. | Deben distinguirse esos perfiles y definir posteriormente sus permisos concretos. |
| MT-007 | Se contemplan empleados de cada cooperativa. | Se registra su pertenencia y se habilita su acceso mediante los roles que correspondan. |
| MT-008 | Se contemplan usuarios asociados/socios de la cooperativa. | El acceso del socio debe vincularse con su relación y con las cuentas que tenga autorizadas en ese tenant. |

### 42.3. Objetivo

Permitir que varias cooperativas utilicen la misma plataforma y que cada una administre su operación, sus asociados, su personal y sus accesos de forma independiente, bajo un nivel global de administración de la solución.

### 42.4. Límite

El administrador de cooperativa actúa dentro de su tenant. Los usuarios internos y socios actúan según sus roles y relaciones autorizadas dentro de esa cooperativa. El administrador de plataforma pertenece al nivel global; sus facultades concretas y cualquier intervención sobre datos operativos de tenants quedan pendientes de definición.

El requisito multitenant no decide por sí solo si habrá una base de datos compartida o separada, si un usuario tendrá una o varias credenciales ni si habrá dominios diferentes por cooperativa. Esas decisiones se documentarán cuando se definan.

### 42.5. Alcance funcional inicial

- Identificar la cooperativa/tenant en cuyo ámbito se realiza cada operación.
- Distinguir administración global de plataforma y administración interna de cada cooperativa.
- Mantener asociados, empleados y usuarios vinculados con su cooperativa.
- Definir roles internos por tenant y asignarlos a sus usuarios según autorización.
- Aplicar los permisos del rol junto con el ámbito del tenant.
- Limitar el acceso de socios a sus datos y cuentas autorizadas.
- Mantener el aislamiento entre cooperativas en operaciones, documentos, búsquedas y reportes.
- Registrar el usuario, tenant y acción en la auditoría de operaciones relevantes.

Estos puntos desarrollan las consecuencias funcionales de los requisitos recibidos. El detalle de pantallas, reglas de alta, permisos y administración se completará con la información posterior.

### 42.6. Perfiles y pertenencia

| Perfil o condición | Ámbito | Descripción | Pendiente de definir |
|---|---|---|---|
| Administrador de plataforma | Global | Administra la solución y sus tenants. | Facultades exactas, acceso de soporte y acciones sobre datos de cooperativas. |
| Administrador de cooperativa | Su tenant | Administra la cooperativa en las funciones que se autoricen. | Alta de usuarios, configuración y delegación de permisos. |
| Financiero | Su tenant | Perfil orientado a las funciones financieras. | Consultas, ejecución de movimientos, autorizaciones y límites. |
| Contable | Su tenant | Perfil orientado a las funciones contables. | Registración, aprobación, cierres, reaperturas y reportes. |
| Empleado | Cooperativa a la que pertenece | Condición de pertenencia del personal; el acceso se determina por sus roles. | Qué puestos requieren usuario y qué roles puede combinar cada uno. |
| Usuario asociado/socio | Su relación con el tenant | Accede a las funciones autorizadas para socios. | Verificación de identidad, cuentas representadas y gestiones permitidas. |

**Distinción funcional:** usuario es la identidad con la que se ingresa; asociado y empleado son relaciones con una cooperativa; rol es el conjunto de permisos asignado. El sistema no debe confundir estas categorías. La posible combinación de condiciones o roles se definirá sin presuponer permisos adicionales.

### 42.7. Caso de uso de ejemplo — CU-MT-01

**Actor:** administrador de plataforma y administrador de cooperativa, con los permisos de alta que se acuerden.

**Situación inicial:** se incorpora una cooperativa a la solución. El siguiente flujo es ilustrativo; los mecanismos de aprobación e invitación siguen pendientes.

1. El administrador de plataforma registra TEN-001 — Cooperativa Ejemplo A.
2. Se habilita al administrador de esa cooperativa según el circuito de alta definido.
3. El administrador de la cooperativa incorpora usuarios financieros y contables y vincula a su personal, dentro de sus facultades.
4. La cooperativa registra a sus propios asociados y habilita el acceso de un socio mediante el mecanismo que se defina.
5. Cada usuario opera dentro de TEN-001 con los permisos de su rol y las relaciones autorizadas.
6. Se registra TEN-002 — Cooperativa Ejemplo B para comprobar que los usuarios de TEN-001 no pueden acceder a sus datos sin una autorización independiente expresamente definida.

**Resultado esperado:** dos cooperativas pueden utilizar la plataforma manteniendo independientes sus asociados, empleados y autorizaciones. El rol de una cooperativa no otorga privilegios en la otra.

**Excepción o control:** cambiar un identificador de cooperativa o una referencia de documento en una solicitud no debe permitir acceder a datos de otro tenant.

### 42.8. Datos ilustrativos de precarga

| Tenant | Usuario o registro ficticio | Perfil o condición | Ámbito |
|---|---|---|---|
| Global | USR-PLAT-001 | Administrador de plataforma | Administración global; detalle de permisos pendiente |
| TEN-001 — Cooperativa Ejemplo A | USR-ADM-A | Administrador de cooperativa | TEN-001 |
| TEN-001 — Cooperativa Ejemplo A | USR-FIN-A | Financiero | TEN-001 |
| TEN-001 — Cooperativa Ejemplo A | USR-CON-A | Contable | TEN-001 |
| TEN-001 — Cooperativa Ejemplo A | EMP-A-001 | Empleado de la cooperativa | TEN-001; rol de acceso por asignar |
| TEN-001 — Cooperativa Ejemplo A | ASO-001 — Ana Pérez | Asociada; usuario de portal vinculado | Sus cuentas autorizadas en TEN-001 |
| TEN-002 — Cooperativa Ejemplo B | USR-ADM-B | Administrador de cooperativa | TEN-002 |
| TEN-002 — Cooperativa Ejemplo B | ASO-001 — Bruno Ejemplo | Asociado; personaje ficticio | Sus cuentas autorizadas en TEN-002 |

El código ASO-001 se repite deliberadamente entre tenants para ilustrar que una referencia interna debe resolverse dentro de su cooperativa. Esto no fija todavía la estrategia de identificación técnica. Para el circuito de demostración de la sección 40, Ana, INM-001, SUM-AG-001 y sus documentos pertenecen a TEN-001.

### 42.9. Definiciones pendientes para próximas aportaciones

- [ ] Detallar los permisos del administrador de plataforma y su eventual acceso de soporte a un tenant.
- [ ] Definir quién crea, habilita o deshabilita cooperativas y usuarios.
- [ ] Confirmar si los roles internos serán predefinidos, configurables o una combinación.
- [ ] Definir si un usuario puede tener varios roles dentro de una misma cooperativa.
- [ ] Definir si una misma credencial puede pertenecer a varias cooperativas y cómo seleccionaría el ámbito.
- [ ] Confirmar el circuito de registro, validación e invitación de empleados y asociados.
- [ ] Detallar los permisos específicos de los perfiles financiero y contable.
- [ ] Definir el tratamiento de una persona que sea empleada y asociada de la misma cooperativa.

Estas cuestiones quedan registradas para completar el documento a medida que se reciba información; no bloquean la incorporación de los requisitos ya informados.

## 43. Marca y landing configurable por cooperativa — requisitos informados

### 43.1. Origen y requisitos recibidos

Información aportada por el solicitante el 3 de noviembre de 2026 para el producto propio. Esta sección incorpora un módulo adicional a los 29 descritos inicialmente. Los requisitos indicados como informados provienen de la conversación; los valores de ejemplo y el detalle de implementación son propuestas para validar.

| Identificador | Requisito informado | Efecto esperado |
|---|---|---|
| MAR-001 | El alta de una cooperativa como tenant habilita su aplicación de administración. | La cooperativa dispone de un ámbito propio para gestionar su operación y configuración. |
| MAR-002 | El tenant puede gestionar su marca, colores y logos desde su administración. | La personalización se mantiene por cooperativa. |
| MAR-003 | Deben contemplarse splash y logo de aplicación móvil. | La identidad de inicio y de la app puede configurarse para el tenant. |
| MAR-004 | Debe contemplarse logo para desktop. | El canal desktop presenta la identidad correspondiente a la cooperativa. |
| MAR-005 | Debe contemplarse logo de aplicación de empleados. | El canal de empleados tiene un recurso de marca identificable. |
| MAR-006 | Debe contemplarse logo de aplicación de socios. | El canal de socios tiene un recurso de marca identificable. |
| MAR-007 | El tenant debe disponer de una landing configurable propia. | La cooperativa puede ofrecer un punto de entrada con su identidad y contenido configurable. |
| MAR-008 | Desde la landing el socio puede consultar e ingresar a la aplicación. | La navegación vincula la presentación de la cooperativa con el acceso de sus socios. |
| MAR-009 | El recorrido del socio debe permitir consultar, activar y desactivar servicios. | Deben definirse esas acciones y sus condiciones en la landing y/o aplicación vinculada. |

### 43.2. Objetivo

Permitir que cada cooperativa disponga de administración y presencia digital con su identidad visual, y que sus socios encuentren los servicios y accedan a la aplicación para consultarlos y gestionar su activación o desactivación.

### 43.3. Límite y relación con otros módulos

Este módulo administra marca, recursos visuales y configuración de la landing de un tenant. La identidad de usuarios, sus permisos, la contratación, las órdenes técnicas, la facturación y los cobros siguen siendo responsabilidad de los módulos correspondientes.

La marca distingue visualmente al tenant y el diccionario de términos adapta su lenguaje de interfaz; el aislamiento y la autorización deben aplicarse además en los procesos del sistema. Una imagen o nombre mostrado en pantalla no otorga acceso.

La existencia de logos para móvil, desktop, empleados y socios no determina todavía si habrá aplicaciones nativas separadas, una aplicación configurable, PWA, sitios web u otra distribución. Tampoco se definió la publicación en tiendas ni el uso de dominios propios.

**Activación y desactivación:** se incorpora la capacidad solicitada. La landing debe contemplar el acceso público a baja sin registro previo cuando sea exigible para el servicio, según sección 52, además de la autogestión en sesión. Queda pendiente definir si cada acción produce un cambio inmediato, una solicitud comercial o una orden técnica, así como sus fechas efectivas, cargos, devoluciones y aprobaciones. Hasta que se definan esas reglas, no se debe representar una solicitud recibida como un servicio ya activado o desactivado.

### 43.4. Alcance funcional

- Disponer de la administración del tenant al completar su alta por el circuito que se acuerde.
- Configurar el nombre de marca y los colores de la cooperativa.
- Configurar un diccionario de términos y etiquetas de interfaz propios del tenant, conforme a la sección 65, desde el inicio del desarrollo.
- Administrar los logos y recursos de splash que correspondan a los canales solicitados.
- Diferenciar recursos para móvil, desktop, empleados y socios, aunque la cooperativa decida utilizar una misma imagen en varios canales.
- Vincular cada recurso visual exclusivamente con el tenant propietario.
- Disponer de una landing configurable para cada cooperativa.
- Permitir configurar su presentación, la información de servicios y los accesos que se definan.
- Ofrecer ingreso a la aplicación de socios manteniendo el contexto de cooperativa.
- Permitir consultar servicios disponibles y, con la autorización correspondiente, servicios contratados.
- Ofrecer el recorrido de activación y desactivación según las reglas particulares de cada prestación.
- Mostrar el estado real del trámite y su resultado: solicitado, pendiente, activo o desactivado, según corresponda.
- Conservar el aislamiento de configuraciones de marca y contenido entre tenants.

La previsualización, los campos concretos del editor de landing y el circuito de publicación se proponen para el diseño posterior; no se consideran todavía decisiones aprobadas.

### 43.5. Recursos de identidad por canal

| Canal o superficie | Recurso solicitado | Uso ilustrativo | Detalle pendiente |
|---|---|---|---|
| Administración de la cooperativa | Marca, colores y logo | Identidad de encabezado y navegación | Elementos de interfaz personalizables |
| Desktop | Logo de desktop | Presentación del tenant en el acceso de escritorio | Si desktop es web o aplicación instalada |
| Aplicación móvil | Logo y splash | Identidad de app y pantalla de inicio | Si logo significa icono de lanzamiento, logo interno o ambos |
| Aplicación de empleados | Logo de empleados | Identidad del espacio de trabajo del personal | Relación con administración y apps de campo |
| Aplicación de socios | Logo de socios | Identidad del canal de autoservicio | Relación con portal web y aplicación móvil |
| Landing | Marca y recursos que se definan | Presentación pública y acceso a la aplicación | Bloques editables, imágenes y publicación |

**Splash:** pantalla de presentación o carga inicial de una aplicación. El contenido y la posibilidad de personalizarlo se requieren; tamaños, formatos, duración y comportamiento se definirán según la tecnología elegida.

### 43.6. Caso de uso de ejemplo — CU-MAR-01

**Actor:** administrador de plataforma para el alta y administrador o usuario autorizado de la cooperativa para su marca y landing.

**Situación inicial:** se incorpora TEN-001 — Cooperativa Ejemplo A. Los nombres, colores, archivos y condiciones siguientes son ficticios.

1. El administrador de plataforma completa el alta del tenant por el circuito definido.
2. La cooperativa dispone de su espacio de administración y de la configuración de su landing.
3. El usuario autorizado carga nombre de marca, colores y logos para desktop, móvil, empleados y socios, junto con el recurso de splash.
4. Configura la presentación de la landing, la información de servicios y el acceso a la aplicación de socios, dentro de las opciones que se definan para el editor.
5. Revisa los recursos y deja disponible la landing mediante el mecanismo de publicación que se acuerde.
6. Un socio accede, consulta el servicio Internet e ingresa a la aplicación de su cooperativa.
7. Dentro de su sesión autorizada consulta sus servicios y solicita o ejecuta la activación de Internet según las reglas vigentes.
8. Si solicita desactivar un servicio contratado, el sistema aplica el circuito y muestra su estado real.

**Resultado esperado:** la cooperativa tiene administración y landing con su marca; el socio accede a su tenant y gestiona servicios sin confundir solicitud con ejecución efectiva.

**Excepciones y controles:** no permitir modificar la marca de otra cooperativa; no divulgar cuentas privadas desde la landing pública; no admitir gestiones sobre contratos ajenos; informar requisitos pendientes y distinguir la recepción de una solicitud de su aprobación o ejecución.

### 43.7. Datos y valores ilustrativos de precarga

| Configuración | Ejemplo propuesto | Estado |
|---|---|---|
| Tenant | TEN-001 | Identificador ficticio |
| Marca | Cooperativa Ejemplo A | Nombre ficticio |
| Color principal | #145DA0 | Valor de demostración |
| Color secundario | #2E8B57 | Valor de demostración |
| Logo desktop | logo-desktop-demo.svg | Nombre de recurso ilustrativo; archivo no creado |
| Logo móvil | logo-movil-demo.png | Nombre de recurso ilustrativo; archivo no creado |
| Splash móvil | splash-demo.png | Nombre de recurso ilustrativo; archivo no creado |
| Logo de empleados | logo-empleados-demo.svg | Nombre de recurso ilustrativo; archivo no creado |
| Logo de socios | logo-socios-demo.svg | Nombre de recurso ilustrativo; archivo no creado |
| Título de landing | Servicios de tu cooperativa, en un solo lugar | Texto editable propuesto |
| Texto de presentación | Consultá nuestros servicios e ingresá para gestionar los tuyos. | Texto editable propuesto |
| Acceso principal | Ingresar a la app de socios | Etiqueta ilustrativa |
| Servicios destacados | Agua, Internet y Servicios sociales | Selección ficticia; no obliga al tenant a ofrecerlos |
| Acciones sobre servicios | Consultar; Activar; Desactivar | Visibilidad y ejecución sujetas a reglas pendientes |

Estos nombres no representan logos o una landing ya construidos; documentan los datos que deberían poder configurarse.

### 43.8. Ejemplos del recorrido de servicios

| Situación | Acción del socio | Comportamiento a definir y validar | Resultado que debe explicarse |
|---|---|---|---|
| Visitante sin sesión | Consultar Internet | Presentar información pública y requisitos | Consulta de catálogo, sin exponer contratos privados |
| Socio identificado sin Internet contratado | Activar Internet | Evaluar requisitos y determinar si activa directamente o crea una solicitud | Servicio activo o solicitud pendiente, expresados de forma distinta |
| Socio con agua contratada | Consultar Agua | Mostrar su contrato y estado según permisos | Información de su cuenta autorizada |
| Socio con Internet contratado | Desactivar Internet | Aplicar el circuito que se defina, con fecha efectiva y efectos comerciales | Baja efectiva o solicitud de baja pendiente |
| Socio sin relación con un contrato | Intentar gestionarlo | Denegar la operación | No se modifica un servicio de terceros |

### 43.9. Definiciones pendientes

- [ ] Confirmar campos editables de marca y alcance de la personalización visual.
- [ ] Precisar si los logos solicitados son internos, iconos de aplicación o ambos.
- [ ] Definir recursos de splash por cada aplicación y canal.
- [ ] Definir formatos, dimensiones y validación de imágenes.
- [ ] Determinar si existen varias apps o canales de una aplicación compartida.
- [ ] Definir URL de landing, subdominio o dominio propio y su relación con el ingreso a la app.
- [ ] Determinar qué se habilita de forma automática al crear un tenant y qué requiere configuración o publicación posterior.
- [ ] Definir bloques, textos, imágenes, contactos y servicios editables de la landing.
- [ ] Confirmar quién puede configurar y publicar la landing dentro del tenant.
- [ ] Definir qué consultas son públicas y cuáles requieren sesión.
- [ ] Acordar requisitos y circuitos de activación/desactivación por servicio.
- [ ] Acordar fecha efectiva y consecuencias técnicas y económicas de cada activación o baja.

Estas definiciones se completarán con las próximas aportaciones del solicitante.

## 44. Facturación separada por servicio y cuenta corriente configurable — requisitos informados

### 44.1. Origen y requisitos recibidos

Información aportada por el solicitante el 3 de noviembre de 2026. Se refiere al sistema propio y no constituye una afirmación sobre el comportamiento de ProCoop.

| Identificador | Requisito informado | Consecuencia funcional |
|---|---|---|
| FAC-001 | Cada cooperativa/tenant brinda servicios a sus socios. | Servicios, contratos y obligaciones se gestionan en el ámbito de la cooperativa. |
| FAC-002 | Cada servicio se factura por separado a cada socio. | La factura debe identificar el servicio; servicios distintos conservan documentos independientes. |
| FAC-003 | El tenant define si se agrupan las obligaciones en una cuenta corriente. | La agrupación es configurable por cooperativa y no debe imponerse globalmente. |
| FAC-004 | La cuenta corriente agrupada se asocia con un resumen de cuenta. | El socio puede consultar el conjunto de sus obligaciones conservando el detalle de facturas y servicios. |

**Precisión 0.17:** FAC-002 pasa a ser la modalidad separada. El solicitante validó también la factura multiservicio por grupos de facturación, práctica de ProCoop, GSP y Scapin. Los requisitos FAC-005 a FAC-012 de la sección 103 la definen y prevalecen sobre las frases de esta sección que la excluían.

### 44.2. Objetivo

Permitir facturación independiente por servicio y, cuando lo determine la cooperativa, ofrecer una visión agrupada de la cuenta del socio mediante un resumen que preserve la trazabilidad de cada documento.

### 44.3. Límite y relación con otros módulos

**Precisión de la versión 0.8:** se mantiene la facturación separada por servicio como requisito del producto. La afirmación de una obligación legal universal se debe validar por prestación y jurisdicción; no se toma la antigua Resolución INAES 3442/2018 como vigente, ya que fue dejada sin efecto. La configuración de mora de una cuenta unificada se amplía en la sección 68: la agrupación no habilita por sí sola la interrupción de todos los servicios.

Facturación emite los documentos separados. Cuenta corriente administra obligaciones, saldos e imputaciones y aplica la agrupación definida. El resumen presenta esa información; no reemplaza las facturas ni duplica la deuda. Cajas y pagos externos registran los cobros, que se imputan a documentos específicos según reglas que se definan.

La agrupación es dentro del tenant y para el socio correspondiente. No autoriza agrupar cuentas de distintas cooperativas ni de personas diferentes. El caso de un socio con varios inmuebles o suministros del mismo servicio debe precisarse.

### 44.4. Alcance funcional

- Registrar los servicios brindados por cada cooperativa y su contratación por los socios.
- Liquidar y emitir por separado cada servicio para cada socio.
- Identificar el tenant, socio, servicio y referencias de contratación en cada factura.
- Mantener el estado y saldo independiente de cada factura.
- Configurar en el tenant si la cuenta se mantiene separada por servicio o agrupada para el socio.
- Permitir consulta del detalle por servicio aun cuando exista una cuenta corriente agrupada.
- Mostrar en el resumen las facturas incluidas, sus importes pendientes y el total resultante.
- Actualizar saldos de documentos y total agrupado al confirmar e imputar pagos o ajustes.
- Evitar contabilizar el resumen como una obligación adicional.

Los nombres de las modalidades, formato del resumen, frecuencia de emisión y reglas de pago son detalles pendientes de validar.

### 44.5. Ejemplo con valores de demostración

Ana es socia de TEN-001 y tiene agua e internet. Los siguientes valores son ficticios, sin tributos ni otros conceptos, y muestran un escenario adicional al circuito de la sección 40.

| Factura interna de ejemplo | Servicio | Socia | Cálculo ilustrativo | Total | Saldo inicial |
|---|---|---|---|---|---|
| FAC-AG-DEMO-002 | Agua | Ana | ARS 3.000 + 20 m³ × ARS 500 | ARS 13.000 | ARS 13.000 |
| FAC-INT-DEMO-002 | Internet | Ana | Abono mensual | ARS 25.000 | ARS 25.000 |

**Modalidad sin agrupación:** la consulta mantiene separados los movimientos y saldos de agua e internet. Ana ve las dos facturas de sus servicios. El formato de las vistas o resúmenes individuales deberá acordarse.

**Modalidad agrupada:** las mismas dos facturas se presentan en la cuenta corriente de Ana y en su resumen de cuenta. El resumen muestra ARS 13.000 por agua, ARS 25.000 por internet y ARS 38.000 pendientes en total. No se genera una tercera deuda de ARS 38.000.

Si se confirma un pago de ARS 13.000 expresamente imputado a agua, esa factura queda cancelada; internet continúa con ARS 25.000 pendientes y el total agrupado pasa a ARS 25.000. Esta imputación se indica expresamente para el ejemplo: no establece una política automática de prioridades entre servicios.

### 44.6. Caso de uso de ejemplo — CU-FAC-01

**Actor:** administrador autorizado de la cooperativa para la configuración y responsable de facturación para la emisión.

**Situación inicial:** Ana tiene dos servicios activos en TEN-001; la cooperativa elige utilizar cuenta corriente agrupada.

1. Configurar la modalidad de agrupación para el tenant, según el permiso y circuito que se definan.
2. Liquidar agua y emitir FAC-AG-DEMO-002 por ARS 13.000.
3. Liquidar internet y emitir FAC-INT-DEMO-002 por ARS 25.000.
4. Registrar ambas obligaciones conservando el servicio de origen y sus saldos independientes.
5. Presentar el resumen de la cuenta de Ana con los dos documentos y ARS 38.000 pendientes.
6. Confirmar un cobro de ARS 13.000 e imputarlo explícitamente a la factura de agua.
7. Actualizar el detalle y el resumen: agua ARS 0, internet ARS 25.000, total pendiente ARS 25.000.

**Resultado esperado:** facturación por separado, consulta agrupada cuando el tenant la habilita y cancelaciones trazables por documento.

**Excepción o control:** si el tenant cambia su configuración, no se deben reemitir ni fusionar automáticamente las facturas históricas. El efecto sobre vistas, saldos y resúmenes previos requiere una regla de transición definida.

### 44.7. Datos y configuración ilustrativa de precarga

| Dato o parámetro | Valor de ejemplo | Observación |
|---|---|---|
| Tenant | TEN-001 | Cooperativa Ejemplo A |
| Socia | ASO-001 — Ana Pérez | Propia de TEN-001 |
| Servicios contratados | Agua e Internet | Dos servicios distintos |
| Regla de facturación | Separada por servicio | Requisito recibido |
| Agrupación de cuenta corriente | Habilitada | Elección ficticia del tenant para este caso |
| Resumen | RES-DEMO-001 | Referencia ilustrativa; no es factura adicional |
| Total pendiente inicial | ARS 38.000 | ARS 13.000 + ARS 25.000 |
| Regla de imputación del ejemplo | Selección explícita de factura | Política general pendiente |

### 44.8. Definiciones pendientes

- [ ] Confirmar si la opción de agrupación es única para todo el tenant o admite excepciones por socio.
- [ ] Definir cómo se factura cuando el socio tiene varios suministros o inmuebles del mismo servicio.
- [ ] Definir si habrá más de una cuenta agrupada por socio y con qué criterio.
- [ ] Acordar frecuencia, fecha de corte, contenido y distribución del resumen.
- [ ] Definir si los servicios pueden tener vencimientos y ciclos distintos y cómo se presentan juntos.
- [ ] Definir pago total de resumen, selección de facturas, pagos parciales y prioridades de imputación.
- [ ] Acordar el tratamiento de créditos a favor y si pueden aplicarse entre servicios.
- [ ] Acordar el efecto de cambios de configuración sobre cuentas y resúmenes históricos.
- [ ] Definir los permisos para configurar agrupación y realizar imputaciones excepcionales.

La facturación separada y la posibilidad de agrupación por decisión del tenant quedan incorporadas. Los puntos anteriores se completarán con las próximas aportaciones.

## 45. Usuarios, roles funcionales y perfiles de pantallas — requisito informado

### Objetivo

Determinar con claridad quién ingresa, qué funciones puede realizar y a qué pantallas puede acceder, siempre dentro del ámbito autorizado de plataforma o cooperativa.

### Límite y relación con otros módulos

Usuario, rol y perfil son conceptos diferenciados. Un perfil de pantallas no concede automáticamente permisos sobre todas las acciones de esas pantallas. Los módulos deben comprobar la autorización funcional y el tenant, además de presentar la navegación permitida.

La relación exacta entre usuarios, roles y perfiles —asignación directa, plantillas, combinación y prioridades— queda pendiente. No se supone que un perfil equivalga a un puesto de trabajo o que un usuario deba tener exactamente uno.

### Alcance y requisitos informados

| ID | Requisito | Aplicación |
|---|---|---|
| ACC-001 | Identificar usuarios de la solución. | Accesos atribuibles a personas y ámbitos autorizados. |
| ACC-002 | Disponer de roles para permisos de funciones. | Determinar acciones como consultar, crear, aprobar, derivar, cobrar o cerrar. |
| ACC-003 | Disponer de perfiles para acceso a pantallas. | Determinar pantallas visibles y navegables. |
| ACC-004 | Distinguir funciones autorizadas de pantallas habilitadas. | Evitar que mostrar una pantalla habilite acciones adicionales. |

El alcance incluye administrar usuarios, roles, perfiles y asignaciones; presentar navegación según perfil; verificar funciones según rol y contexto; y registrar cambios relevantes de autorización. Estos mecanismos se integran con el módulo 29.

### Caso de uso — CU-ACC-01

**Actor:** administrador autorizado de la cooperativa.

**Situación inicial:** un empleado de TEN-001 debe recibir reclamos y derivarlos, pero no modificar tarifas ni cobrar.

1. Vincular al usuario USR-SUP-A con TEN-001.
2. Asignar un perfil de demostración Supervisión CRM con acceso a Bandeja de supervisión, Detalle de caso y Conversación.
3. Asignar un rol funcional de demostración Supervisor de casos con permisos para consultar y derivar casos.
4. Verificar que puede abrir el caso y derivarlo, y que las acciones no autorizadas se deniegan incluso si intenta invocarlas por otro medio.

**Resultado:** acceso a pantallas y acciones coherente con su responsabilidad. **Excepción:** un enlace directo a una pantalla no habilitada o una acción sin permiso no debe eludir la autorización.

### Ejemplos de configuración propuestos

| Usuario ficticio | Perfil: pantallas | Rol: funciones | Ejemplo de límite |
|---|---|---|---|
| USR-SUP-A | Supervisión CRM; detalle; conversación | Consultar y derivar casos | Sin cobros ni edición de tarifas |
| USR-TEC-A | Mis casos; detalle; órdenes asignadas | Atender casos asignados y registrar intervención | Sin acceso a toda la cartera por defecto |
| USR-SOC-A | Mis servicios; mis tickets; noticias de socios | Consultar sus cuentas y solicitar gestiones | Sin bandeja interna de supervisión |
| USR-NOT-A | Editor de noticias; publicaciones | Crear y publicar noticias, si se le autoriza | Sin gestión financiera |

La tabla es ilustrativa. Los nombres y permisos definitivos requieren acuerdo. Quedan pendientes combinaciones de roles/perfiles, reglas de conflicto y separación de autorizaciones para publicar, aprobar y ejecutar.

## 46. Noticias en landing y muro de apps — requisito informado

### Objetivo

Permitir a cada cooperativa comunicar noticias mediante su landing y mediante un muro en las aplicaciones de socios y empleados, tomando Connectyx como referencia funcional.

### Límite y relación con otros módulos

Es comunicación editorial del tenant. Las noticias no sustituyen tickets, notificaciones de un caso ni gestiones de alta/baja. Una noticia pública no debe contener datos privados de socios o expedientes. La referencia a Connectyx orienta el tipo de experiencia; sus interacciones específicas se relevarán por separado.

### Alcance y requisitos informados

| ID | Requisito | Canal |
|---|---|---|
| NOT-001 | Mostrar noticias de la cooperativa en su landing. | Público, según contenido publicado |
| NOT-002 | Mostrar noticias en un muro de la app del socio. | Socios autorizados |
| NOT-003 | Mostrar noticias en un muro de la app del empleado. | Personal autorizado |

Se propone un editor de noticias con título, cuerpo, imagen, autor, canales destinatarios y estado; publicación por canal y consulta de las publicaciones correspondientes. La selección de canales debe evitar publicar contenido interno en la landing pública. Programación, vencimiento, comentarios, reacciones, confirmación de lectura y avisos push son opciones pendientes, no requisitos ya confirmados.

### Caso de uso — CU-NOT-01

**Actor:** empleado con perfil y rol de publicación autorizados.

1. Crear la noticia ficticia Mantenimiento programado de agua con fecha, zona y descripción.
2. Elegir landing y muro de socios como canales de publicación y revisar el contenido.
3. Publicarla mediante el circuito autorizado y verificar su presentación con la marca de TEN-001.
4. Crear otra noticia ficticia Capacitación interna y publicarla únicamente para empleados.

**Resultado:** la primera noticia aparece en los canales elegidos; la segunda queda restringida al personal. **Excepción:** un usuario sin permiso de publicación puede tener acceso de lectura, pero no publicar ni cambiar el público.

### Datos ilustrativos

| Campo | Noticia pública/de socios | Noticia interna |
|---|---|---|
| Tenant | TEN-001 | TEN-001 |
| Título | Mantenimiento programado de agua | Capacitación interna |
| Canales | Landing y app de socios | App de empleados |
| Imagen | foto-mantenimiento-demo.jpg, referencia sin archivo creado | imagen-capacitacion-demo.jpg, referencia sin archivo creado |
| Estado de ejemplo | Publicada | Borrador, hasta aprobación |

**Pendientes:** campos editables, públicos segmentados, quién aprueba, formatos de adjuntos e interacciones del muro.

## 47. CRM integral de pedidos, reclamos y atención — requisito informado

### Objetivo

Centralizar las gestiones de socios relacionadas con sus servicios mediante casos identificables, conversaciones y evidencia, para que supervisores las deriven y empleados de la cooperativa las resuelvan con seguimiento.

### Límite y relación con otros módulos

El CRM reúne el expediente, la comunicación, el seguimiento y la coordinación del caso. Una orden técnica, modificación contractual, ajuste de factura o cobro se ejecuta en el módulo responsable y queda vinculado al expediente. Resolver un chat no equivale automáticamente a resolver un problema técnico.

El solicitante pide un CRM completo; se registra como alcance confirmado el circuito de atención descrito aquí. Funciones comerciales adicionales de CRM, como oportunidades, campañas o embudos de ventas, se mantienen pendientes de relevamiento y no se consideran exigidas por esa expresión sin más detalle.

### Alcance y requisitos informados

| ID | Requisito recibido | Resultado requerido |
|---|---|---|
| CRM-001 | Los socios pueden registrar pedidos y reclamos de sus servicios. | Caso trazable dentro de su cooperativa. |
| CRM-002 | Contar con chat y bot. | Canal conversacional para recibir y acompañar la gestión. |
| CRM-003 | Entregar un ticket de seguimiento. | Referencia que el socio puede consultar y el personal puede atender. |
| CRM-004 | Identificar claramente servicio, cuenta y reclamo. | Contexto suficiente para atender sin confundir contratos o servicios. |
| CRM-005 | Incorporar ayuda de IA. | Asistencia para expresar, entender y organizar la gestión; detalle sujeto a definición. |
| CRM-006 | Permitir aportar fotografías. | Evidencia vinculada al expediente. |
| CRM-007 | Los casos ingresan a una bandeja de supervisores. | Recepción y revisión centralizadas por tenant. |
| CRM-008 | Supervisores derivan a las áreas correspondientes. | Asignación clara del área responsable. |
| CRM-009 | Empleados de la cooperativa resuelven los casos. | Atención interna con responsabilidad y seguimiento. |
| CRM-010 | Admitir pedidos, reclamos y otros tipos de gestión. | Clasificación ampliable, con catálogo pendiente de acuerdo. |

El circuito desarrolla los módulos 15, 16 y 17 con un expediente común:

1. **Ingreso:** el socio se identifica, selecciona servicio y cuenta cuando corresponda y describe la gestión por formulario o conversación con chat/bot.
2. **Evidencia:** adjunta fotos y aporta datos adicionales; el caso conserva mensajes y archivos relacionados.
3. **Asistencia:** la IA puede proponer una descripción clara, resumen y clasificación. Son funciones propuestas para concretar la ayuda solicitada; no se presupone un proveedor o automatización ya elegidos.
4. **Registro:** se crea un ticket y se informa su referencia al socio. Si faltan datos, el caso queda identificado y pendiente de completarlos.
5. **Supervisión:** el caso entra a la bandeja del tenant para revisar servicio, cuenta, motivo, evidencia y propuesta de clasificación.
6. **Derivación:** un supervisor asigna el caso al área correspondiente y, según las reglas que se acuerden, a un responsable.
7. **Atención:** los empleados autorizados trabajan en su bandeja, conversan con el socio, registran intervenciones y vinculan órdenes u otras gestiones.
8. **Resolución:** se registra la solución y el resultado real de las acciones; se informa al socio y se cierra según el circuito que se defina.

### Información del caso y bandejas

| Grupo | Datos propuestos |
|---|---|
| Identificación | Tenant, número de ticket, socio, usuario solicitante y canal de origen |
| Contexto | Servicio, cuenta, contrato/suministro y factura si corresponde |
| Solicitud | Tipo de gestión, asunto, descripción, fecha y adjuntos/fotos |
| Conversación | Mensajes, participantes, bot/intervención humana y fechas |
| Asistencia IA | Resumen y clasificación sugeridos, correcciones y confirmación humana |
| Gestión interna | Estado, prioridad, área, supervisor, empleado responsable y derivaciones |
| Resultado | Acciones, órdenes vinculadas, solución, comunicación al socio y cierre |

Una solicitud de un servicio aún no contratado puede no tener cuenta o suministro existente: se registra el servicio solicitado y se vincula el contrato cuando corresponda, sin inventar un identificador.

**Bandeja de supervisión propuesta:** filtros por servicio, tipo, estado, área, antigüedad y responsable; vista de casos sin clasificar o sin derivación. **Bandeja del área/empleado:** casos asignados y su contexto completo según permisos. Prioridades, tiempos comprometidos, escalamiento y reasignaciones requieren definición.

Los mensajes visibles al socio deben distinguirse de las notas internas. El bot y la IA solo acceden a información autorizada del tenant y del socio; una sugerencia no confirma una baja, una devolución ni la resolución de una falla. La derivación inicial corresponde a supervisión según el requisito recibido; no se asume derivación autónoma por IA.

### Caso de uso — CU-CRM-01

**Actor:** socia Ana, bot/chat, supervisor y empleado del área Agua de TEN-001.

**Situación inicial:** Ana tiene SUM-AG-001 y quiere reclamar por una pérdida visible en su conexión.

1. Ana abre una gestión, selecciona Agua y su cuenta autorizada y escribe Hay una pérdida junto al medidor.
2. El chat/bot solicita los datos faltantes y permite adjuntar una fotografía.
3. La IA propone un resumen y motivo; Ana puede revisar su descripción y el supervisor puede corregir la clasificación.
4. Se registra TCK-DEMO-001 y se comunica la referencia a Ana; el caso entra a la bandeja de supervisión.
5. El supervisor verifica servicio, cuenta y foto y deriva al área Agua.
6. El empleado asignado revisa la conversación y, si procede, genera una orden técnica vinculada y coordina la intervención.
7. Registra el resultado real y responde por el canal del caso. El expediente se cierra mediante el circuito acordado, conservando evidencia e historial.

**Resultado:** el socio puede seguir un mismo ticket y el personal atiende con contexto, responsable y evidencia. **Excepciones:** si la cuenta elegida no pertenece al socio, se deniega el acceso; si no sabe identificarla, se solicita aclaración; si cambia de área, se conserva el mismo expediente y su historial. Una sugerencia de IA incorrecta puede corregirse sin perder el texto original.

### Datos ilustrativos de precarga

| Campo | Valor propuesto |
|---|---|
| Ticket | TCK-DEMO-001 |
| Tenant y socia | TEN-001; ASO-001 — Ana Pérez |
| Servicio y cuenta | Agua; cuenta vinculada a SUM-AG-001, identificador definitivo pendiente |
| Tipo y motivo | Reclamo; pérdida de agua |
| Foto | perdida-demo.jpg, referencia ilustrativa sin archivo creado |
| Clasificación IA | Posible pérdida en conexión; sugerencia pendiente de revisión |
| Estado inicial | Recibido en supervisión |
| Área | Agua, tras derivación del supervisor |
| Responsable | USR-TEC-A, asignación de ejemplo |

### Pendientes de especificación

- [ ] Definir catálogo de gestiones, motivos, estados y prioridades.
- [ ] Definir canales concretos de chat: internos, web, móvil y posibles integraciones externas.
- [ ] Definir disponibilidad del bot, traspaso a atención humana y gestión fuera de horario.
- [ ] Precisar tareas de IA y quién confirma o corrige sus propuestas.
- [ ] Acordar relación exacta entre cuenta, servicio, suministro y contrato en el CRM.
- [ ] Definir áreas, responsables y reglas de derivación, rechazo y devolución a supervisión.
- [ ] Definir tiempos comprometidos, alertas, escalamiento y casos urgentes.
- [ ] Definir formatos y límites de fotos/adjuntos y acceso a notas internas.
- [ ] Definir resolución, conformidad del socio, cierre, reapertura y encuesta, si corresponde.
- [ ] Relevar otras funciones que deban integrar el CRM completo.

## 48. Solicitudes de alta y baja de cualquier servicio — requisito informado

### Objetivo

Permitir que un socio solicite incorporar o dar de baja cualquiera de los servicios que brinde su cooperativa, con seguimiento y vinculación al CRM.

### Límite y relación con otros módulos

**Solicitar no equivale a ejecutar.** La capacidad confirmada incluye registrar y seguir solicitudes de alta y baja y conducir el ciclo completo de prestación, con suspensión y reactivación según las secciones 50 y 53. La activación o desactivación efectiva se realiza por el circuito comercial y técnico que corresponda, con su fecha y consecuencias. Esta precisión desarrolla las referencias a activar/desactivar de las secciones 25 y 43; allí donde se menciona ejecución inmediata sigue siendo una alternativa pendiente de definición, no el comportamiento base confirmado.

El catálogo limita qué servicios ofrece el tenant. El portal verifica la relación del socio con el contrato. Para los servicios alcanzados por el botón de baja, debe existir además un canal público que reciba la solicitud sin exigir registro previo ni trámites obstructivos, conforme a la sección 52; recibirla no habilita a divulgar datos privados. Una solicitud de alta puede no tener todavía cuenta o contrato del servicio solicitado. El vínculo institucional de asociado no se da de baja automáticamente al solicitar la baja de un servicio.

### Alcance y requisitos informados

| ID | Requisito | Efecto |
|---|---|---|
| SOL-001 | Solicitar alta de cualquiera de los servicios brindados por el tenant. | No limitar la capacidad a una prestación particular. |
| SOL-002 | Solicitar baja de cualquiera de sus servicios contratados. | Identificar el servicio y contrato objeto de la solicitud. |

- Consultar servicios disponibles y contratados.
- Registrar tipo de solicitud, servicio y datos necesarios.
- Permitir documentación y conversación vinculada cuando corresponda.
- Generar un caso/ticket e ingresarlo al circuito de supervisión y derivación.
- Pedir requisitos adicionales según la prestación.
- Consultar el avance y recibir el resultado.
- Vincular la decisión y ejecución con contratos, órdenes y facturación.
- Conservar fecha solicitada y fecha efectiva cuando se determine, sin presumir que coinciden.

### Caso de uso — CU-SOL-01

**Actor:** socia y empleados autorizados de TEN-001.

1. Ana consulta Internet y solicita su alta; el sistema registra el servicio deseado sin inventar un contrato activo.
2. Recibe el ticket TCK-ALTA-001; supervisión deriva a las áreas que correspondan para evaluación y ejecución.
3. La aprobación e instalación, si proceden, generan o habilitan el contrato con fecha efectiva y sus efectos de facturación.
4. En otro momento Ana selecciona su servicio de TV contratado y solicita la baja mediante TCK-BAJA-001.
5. El caso se revisa y ejecuta conforme al circuito; se informa el estado y fecha efectiva de baja, conservando facturas e historia anteriores.

**Resultado:** alta y baja solicitables y trazables por prestación, sin marcar como ejecutado lo que sigue en trámite. **Excepción:** si faltan requisitos, el caso queda pendiente con explicación; si se rechaza, se conserva el motivo y se comunica el resultado.

### Ejemplos de opciones seleccionables

| Servicio ofertado de ejemplo | Solicitud de alta | Solicitud de baja | Posible revisión, pendiente de validar |
|---|---|---|---|
| Agua | Disponible para solicitar | Sobre contrato autorizado | Factibilidad, conexión y estado final de medición |
| Electricidad | Disponible para solicitar | Sobre contrato autorizado | Inspección y trabajos técnicos |
| Gas | Disponible para solicitar | Sobre contrato autorizado | Requisitos técnicos específicos |
| Internet | Disponible para solicitar | Sobre contrato autorizado | Cobertura, equipos y activación/desactivación |
| Telefonía | Disponible para solicitar | Sobre contrato autorizado | Línea y reglas operativas |
| TV | Disponible para solicitar | Sobre contrato autorizado | Cobertura, equipos y señal |
| Servicios sociales | Disponible para solicitar | Sobre cobertura autorizada | Grupo, beneficiarios y vigencia |

La tabla utiliza el catálogo ficticio previo y no obliga a cada cooperativa a brindar todos los servicios. Debe admitir otras prestaciones que el tenant ofrezca.

**Pendientes:** requisitos, documentación, cargos, aprobación, fecha efectiva, desistimiento, cancelación, bajas parciales y efectos sobre cuenta corriente, coberturas y equipamiento. La deuda anterior y la facturación final requieren reglas explícitas y no desaparecen por registrar una solicitud.

## 49. Consolidación de las últimas aportaciones

- Se reafirma la sección 44: cada servicio se factura por separado y el tenant elige la agrupación de cuenta corriente y resumen. No se crea otra modalidad de facturación conjunta. *(Sustituido en la versión 0.17: la sección 103 agrega la factura multiservicio por grupos de facturación.)*
- Las secciones 45 a 48 incorporan requisitos informados del producto propio; sus ejemplos, nombres de pantallas, estados, códigos e implementación siguen siendo ilustrativos.
- Las secciones 15, 16, 25, 26, 29, 33 y 34 se actualizan para reflejar las nuevas definiciones sin eliminar el alcance previo.
- El documento continúa abierto a nuevas aportaciones. La matriz definitiva de roles/perfiles, el comportamiento exacto del muro y los circuitos de CRM y servicios requieren el detalle que se vaya recibiendo.

## 50. Autogestión integral del tenant y del socio — requisito informado

### Objetivo

Ofrecer una solución self service en la que la cooperativa gestione su operación con el sistema y el socio complete el ciclo de una prestación desde su app: solicitar, concertar visita, recibir la visita y el servicio, consultar consumos y factura, pagar, reclamar y dar de baja.

### Límite y relación con otros módulos

Autogestión significa que cada actor puede iniciar, consultar y completar las actuaciones de su responsabilidad con información y seguimiento. No convierte la recepción de una solicitud en una instalación realizada ni elimina las intervenciones físicas o aprobaciones que correspondan. La cooperativa trabaja en su ERP, bandejas y agenda; el socio en su canal autorizado y en los accesos públicos exigibles.

### Alcance recibido y desarrollo funcional

| ID | Requisito | Comportamiento esperado |
|---|---|---|
| AUT-001 | Autogestión de la cooperativa | Operar y configurar sus funciones autorizadas dentro del tenant. |
| AUT-002 | Autogestión del socio durante todo el ciclo | Iniciar y seguir sus gestiones sin perder el historial entre módulos. |
| AUT-003 | Concertar visitas por la app | Consultar disponibilidad y confirmar un turno ligado al caso/servicio. |
| AUT-004 | Recibir visita y prestación | Conservar resultado de visita, tareas realizadas y fecha efectiva de servicio. |
| AUT-005 | Consultar consumos, factura y pagar | Vincular medición, documento, saldo y pago confirmado. |
| AUT-006 | Reclamar y terminar el servicio | Acceder al CRM y a bajas, con estado y constancia. |

El tenant administra sus usuarios, roles, perfiles, marca, landing, servicios, planes, tarifas, noticias, atención y procesos del ERP según permisos. El alcance exacto de qué configuraciones requieren intervención de plataforma se acordará; no se presume que deba depender del equipo del producto para toda tarea cotidiana.

### Agenda y visitas: alcance propuesto para materializar el requisito

- Registrar zonas, tipos de visita, duración/franjas, recursos, disponibilidad y capacidad.
- Ofrecer turnos compatibles con servicio, domicilio y requisitos del caso.
- Reservar sin duplicar recursos y confirmar fecha/franja al socio.
- Permitir reprogramación y cancelación con reglas y trazabilidad.
- Gestionar asignación de cuadrilla/empleado, recordatorios y novedades de agenda.
- Registrar realizada, visita fallida, sin acceso, reprogramada u otro resultado definido.
- Conservar trabajo, evidencia y conformidad cuando corresponda; generar otra visita si no se terminó.
- Mostrar al socio el estado real y vincular con orden técnica y activación.

Los campos y reglas anteriores son propuestas de diseño. Canales de aviso, plazos, cobertura, cancelaciones y eventual costo de una visita se definirán por prestación y marco aplicable.

### Caso de uso — CU-AUT-01

Ana, de TEN-001, consulta Internet Fibra 100 desde la landing e inicia la contratación en la app. El sistema crea el caso y solicita los datos requeridos. Tras la validación correspondiente, Ana elige una franja disponible y recibe confirmación. La cooperativa asigna el trabajo, registra la visita y la instalación y deja activo el contrato desde la fecha efectiva.

Ana consulta estado y consumos que se midan para ese servicio, accede a su factura separada de internet, paga y ve la confirmación. Si hay una falla, abre un ticket con foto por chat. Puede solicitar suspensión, reactivación o baja; cada gestión conserva su resultado, fechas y relación con facturación.

**Ejemplos precargados:** tenant TEN-001; socia ASO-001; servicio INT; plan INT-100; turno VIS-DEMO-001, 10/11/2026 de 09:00 a 11:00; orden OT-INT-DEMO-001. Son datos ficticios sin disponibilidad real reservada.

**Control:** una visita marcada fallida no activa el contrato; el consumo de internet solo se presenta si existe una fuente de medición definida. Un abono no medido no debe inventar consumos ni cargos por tráfico.

## 51. Motor de facturación P × Q y reglas de excepción — requisito informado

### Objetivo

Liquidar cada servicio por precio y cantidad cuando corresponda, junto con sus componentes fijos, y aplicar reglas configurables por tenant, grupo, plan y situación del beneficiario: subsidios, bonificaciones, descuentos, cargos adicionales y tributos del mercado argentino.

### Límite

La configurabilidad permite representar reglas aprobadas; no autoriza crear impuestos ni determinar por cuenta propia el derecho a un subsidio estatal. El beneficio público debe basarse en evidencia o padrón autorizado. La factura mantiene separación por servicio, o apertura por servicio si es multiservicio (sección 103), y la agrupación del resumen no cambia la naturaleza de los conceptos. La sección 52 documenta los límites normativos investigados.

### Requisitos informados

| ID | Requisito | Alcance |
|---|---|---|
| TAR-001 | Facturar P × Q | Precio unitario y cantidad, con unidades y fuente identificables. |
| TAR-002 | Reglas de excepción por grupos | Condiciones que seleccionan conjuntos de socios/contratos con evidencia y vigencia. |
| TAR-003 | Reglas por planes | Tarifas y condiciones asociadas al plan comercial del servicio. |
| TAR-004 | Personas subsidiadas y bonificadas | Beneficios públicos o comerciales identificados y diferenciados. |
| TAR-005 | Descuentos y cargos extra | Conceptos habilitados con base, condiciones y justificación. |
| TAR-006 | Tributos y condiciones argentinas | Tratamiento parametrizable por servicio, jurisdicción y situación fiscal. |

### Estructura propuesta de una regla

| Elemento | Datos a registrar |
|---|---|
| Identidad | Código, nombre, tenant, versión, autor y aprobación |
| Ámbito | Servicio, plan, grupo, contrato/suministro y beneficiario cuando corresponda |
| Jurisdicción y respaldo | País, provincia/localidad, autoridad, norma/resolución o condición comercial |
| Vigencia | Desde/hasta y criterio de fecha utilizado: prestación, período u otro definido |
| Condiciones | Categoría, tipo de usuario, situación fiscal, beneficio acreditado, zona y otras condiciones autorizadas |
| Base | Cargo fijo, cantidad, componente energético, subtotal seleccionado u otra base explícita |
| Operación | Importe fijo, porcentaje, escala, bloque, mínimo, máximo, umbral o fórmula autorizada |
| Compatibilidad | Prioridad, acumulación, exclusión, topes y resolución de conflictos |
| Efectos | Factura, percepción/retención si corresponde, asiento contable y visibilidad al socio |
| Evidencia | Origen del padrón/beneficio, fecha de actualización y documentación |

No todos estos campos serán obligatorios para toda regla. La definición de un motor de fórmulas no debe permitir ejecutar código arbitrario; la elección técnica se realizará posteriormente.

### Reglas y funciones propuestas

- Expresar precio unitario, cantidad, cargo fijo y escalas de manera separada.
- Permitir beneficios sobre una parte de la cantidad o del precio, sin extenderlos automáticamente al total.
- Diferenciar beneficio por suministro/ubicación de una condición general de la persona.
- Administrar grupos explícitos o por criterios aprobados, con historial de altas y bajas.
- Incorporar padrones por mecanismos autorizados sin presuponer acceso a una API estatal.
- Distinguir descuento comercial financiado por la cooperativa, subsidio público y compensación a recuperar.
- Definir descuentos acumulables o excluyentes y mostrar el orden exacto aplicado.
- Configurar tributos por tipo de operación y contribuyente, con base imponible y exenciones válidas.
- Distinguir impuesto a facturar, percepción, retención recibida y gasto propio de la cooperativa; no trasladar todos como recargos al socio.
- Tratar prorrateos, cambios de plan, suspensiones, reactivaciones y cambios de regla dentro de un período.
- Aplicar reglas por producto/subservicio y plan, incluyendo promociones por una cantidad definida de meses o ciclos.
- Diferenciar facturación anticipada y vencida y determinar el primer período desde la activación efectiva, según secciones 72 y 73.
- Detallar la versión y los datos utilizados para reproducir cualquier cálculo histórico.
- Simular con un conjunto de contratos antes de publicar, comparar totales e impacto por grupo y servicio.
- Corregir documentos definitivos mediante el circuito de ajustes, sin reescribir sus cálculos originales.

### Caso de uso — CU-TAR-02

**Actor:** responsable de tarifas y aprobador del tenant.

Se propone una tarifa ficticia de agua para probar una bonificación comercial por grupo. No representa subsidio estatal ni cuadro real de una jurisdicción argentina.

| Concepto | Cálculo ficticio | Importe ARS |
|---|---|---|
| Cargo fijo | Importe mensual | 3.000 |
| Variable | 20 m³ × 500 | 10.000 |
| Bonificación comercial del grupo | 30 % sobre el variable, no sobre el fijo | -3.000 |
| Neto antes de tributos | 3.000 + 10.000 − 3.000 | 10.000 |

1. Crear grupo GR-BON-DEMO, vincular contratos de ejemplo y registrar la vigencia.
2. Crear regla BON-VAR-30 con base variable, porcentaje 30 % y condiciones explícitas.
3. Simular al socio incluido y a otro no incluido: netos ARS 10.000 y ARS 13.000 respectivamente, sin tributos.
4. Comprobar compatibilidad con otras reglas y aprobar la versión.
5. Emitir por el procedimiento habitual y conservar el desglose y la evidencia de inclusión.

**Control:** si dos reglas incompatibles pueden aplicar, se resuelve mediante prioridad explícita o revisión; no se elige silenciosamente la que produzca cualquier resultado. Los ejemplos anteriores del documento que omiten tributos siguen siendo didácticos y no deben usarse como factura productiva.

### Ejemplo adicional de subsidio por bloque, puramente didáctico

Para ilustrar la capacidad del motor se usan valores inventados: 250 unidades consumidas, precio del componente subsidiable ARS 100/unidad, bloque elegible de 150 unidades y bonificación del 40 % solo sobre ese componente. El componente bruto es ARS 25.000 y la reducción es 150 × 100 × 40 % = ARS 6.000; su neto es ARS 19.000. No se bonifican automáticamente otras partes de la factura. Ninguno de esos porcentajes, precios o bloques representa una tarifa vigente.

## 52. Investigación para el mercado argentino y consecuencias funcionales

### Fecha, alcance y criterio

Revisión de fuentes oficiales realizada el 3 de noviembre de 2026, a pedido del solicitante. Se distingue el hecho normativo resumido de su traducción funcional propuesta. Es una base de requisitos para parametrizar y relevar cada cooperativa, no una certificación de cumplimiento para todas las jurisdicciones y servicios.

### 52.1. Subsidios y cambios de vigencia

El régimen SEF creado por el Decreto 943/2025 contempla bonificaciones sobre componentes energéticos y consumos base, con facultades de modificación de bloques y porcentajes. La comunicación oficial del 2/1/2026 describe la sustitución del esquema nacional N1/N2/N3 por categorías con y sin subsidio y el reemplazo de RASE por ReSEF [AR1, AR2].

Una comunicación oficial del 30/10/2026 informa prórrogas para noviembre que modifican el cronograma inicial de bonificaciones. También distingue la regulación tarifaria eléctrica de EDENOR/EDESUR de las jurisdicciones locales del resto del país [AR3].

**Consecuencia de diseño:** no fijar en el código categorías históricas, porcentajes o bloques permanentes. Versionar regímenes y vigencias; registrar a qué componente se aplica el beneficio y de dónde proviene su acreditación. Un cuadro de una distribuidora no se toma como tarifa universal para toda cooperativa. Deben relevarse además los regímenes provinciales/locales concretos: esta investigación no incorpora un cuadro vigente de ERSeP ni de una cooperativa específica.

### 52.2. Impuestos, transparencia y comprobantes

La Ley 27.743 y la RG ARCA 5614/2024 contemplan discriminación de IVA y otros impuestos nacionales indirectos en los comprobantes, con las particularidades normativas aplicables. ARCA también publica condiciones especiales para ciertos prestadores de servicios públicos [AR4, AR5]. Su guía de emisión distingue, entre otras operaciones, los servicios públicos y telecomunicaciones, vinculando su emisión y entrega al primer vencimiento [AR6].

**Consecuencia de diseño:** la configuración debe identificar condición fiscal, tipo de operación, base, alícuota, vigencia y forma de exhibición, sin suponer una tasa única para todos los servicios. Las reglas de emisión no se reducen a una fecha mensual universal. El documento debe separar el precio del servicio, los ajustes y los tributos aplicables, con tratamiento fiscal validado para cada caso.

La Resolución 267/2024 de la Secretaría de Industria y Comercio establece que los conceptos de un comprobante deben corresponder al bien o servicio contratado y no contener sumas ajenas. Su relación con cada tributo y jurisdicción debe validarse en la parametrización [AR7].

**Consecuencia de diseño:** un campo configurable de cargo extra no habilita cualquier tasa o concepto. Debe existir un catálogo aprobado con fundamento, servicio, jurisdicción y documento permitido. Un resumen de cuenta no se utiliza para disimular cargos improcedentes. No trasladar automáticamente al socio tributos propios de la cooperativa ni incorporar productos ajenos en una factura de servicio por la sola capacidad técnica del sistema.

### 52.3. Bajas y costos

El artículo 10 quáter de la Ley 24.240 prohíbe cobros de preaviso, mes adelantado u otros conceptos por la solicitud de baja. El artículo 10 ter contempla rescisión por el mismo medio cuando la contratación fue telefónica, electrónica o similar y una constancia dentro de 72 horas [AR8].

Para los servicios comprendidos en la Resolución 316/2018 actualizada, entre ellos acceso a internet, el botón de baja debe ser visible y no exigir registración previa ni otro trámite; debe informarse el código identificador dentro de 24 horas por el mismo medio [AR9].

**Consecuencia de diseño:** la baja no tendrá un cargo por solicitarla. Implementar recepción pública y constancias cuando corresponda, además del portal autenticado. Permitir recibir sin registro previo no significa exponer información privada. No supeditar el ingreso de la solicitud a completar un registro, pagar una deuda o aceptar un cargo de baja. La facturación de prestaciones efectivamente devengadas y otros conceptos legítimos se trata separadamente, sin convertirlos en penalidad por baja.

La investigación anterior no acredita un arancel universal para suspensión o reconexión: los conceptos, gratuidades y condiciones deben verificarse para cada servicio y ámbito antes de habilitarlos. Tampoco se supone que todo servicio admita la misma suspensión temporal.

### 52.4. Datos a relevar por cooperativa antes de habilitar facturación

| Tema | Evidencia o decisión necesaria |
|---|---|
| Ámbito | CUIT y condición fiscal del prestador; provincia, localidad, concesión y autoridad aplicable |
| Prestaciones | Servicios efectivamente brindados y modalidades de contratación/medición |
| Tarifas | Cuadros, planes comerciales, componentes, categorías y versiones vigentes |
| Beneficios | Padrones o constancias, reglas de elegibilidad, alcance, vencimiento y validación |
| Tributos | Impuesto/régimen, fundamento, base, alícuota, excepciones y tratamiento documental |
| Cargos | Instalación, visita, suspensión o reconexión: habilitación específica y condiciones |
| Bajas | Acceso público exigible, identificación, constancias y plazos aplicables |
| Documentos | Modalidad de emisión, formatos, numeración, integración fiscal y vencimientos |
| Responsables | Quién configura, quién revisa y quién aprueba cambios para producción |

El resultado de este relevamiento debe quedar versionado y auditado. El tenant puede configurar sus condiciones autorizadas, pero no desactivar restricciones normativas por ser administrador.

## 53. Baja, suspensión y reactivación — requisito informado

### Objetivo

Permitir al usuario gestionar la finalización o interrupción temporal de su servicio y solicitar o ejecutar su reactivación por el circuito correspondiente, con condiciones y costos transparentes donde estén habilitados.

### Límite

Se distingue baja contractual, suspensión temporal solicitada por el socio, suspensión por otro motivo y reactivación. Una suspensión temporal no equivale a extinguir el contrato. Reactivar un contrato cerrado puede requerir una nueva alta; debe definirse por servicio.

El requisito recibido menciona operaciones con y sin costo. Su interpretación funcional se ajusta a la investigación de la sección 52: la solicitud de baja no genera cargo; para suspensión y reactivación se admiten modalidades gratuitas o aranceladas únicamente cuando sean procedentes y estén respaldadas para ese servicio y jurisdicción. Un costo no se habilita simplemente por cargar un importe.

### Alcance recibido y desarrollo

| ID | Requisito | Efecto |
|---|---|---|
| CIC-001 | Baja desde el canal del usuario | Registro, constancia, seguimiento y ejecución sin cargo por solicitarla. |
| CIC-002 | Suspensión del servicio | Solicitud o ejecución autorizada con duración, motivo y fecha efectiva. |
| CIC-003 | Reactivación | Retorno a prestación activa mediante condiciones y actuaciones correspondientes. |
| CIC-004 | Modalidades con y sin costo | Política configurable y validada; gratuidad de baja y costos admisibles diferenciados. |

- Presentar las opciones disponibles según servicio y situación sin bloquear la recepción de bajas exigibles.
- Informar fecha solicitada, plazo de respuesta, efecto esperado y eventual costo habilitado.
- Conservar aceptación de condiciones para operaciones aranceladas admisibles.
- Ingresar la gestión al CRM, con orden técnica si se requiere.
- Registrar el momento real de suspensión o reactivación y su comunicación al socio.
- Determinar cargos recurrentes, pausas, mínimos y prorrateo a partir de reglas aprobadas; no presumir que todo abono se detiene automáticamente.
- Evitar cobros o ejecuciones duplicadas por reintentos.
- Conservar deuda previa y documentos históricos sin transformarlos en impedimento genérico para solicitar baja.

### Caso de uso — CU-CIC-01

Ana solicita suspender temporalmente Internet desde una fecha. La app muestra las condiciones habilitadas para su contrato. El tenant tramita el caso y confirma la ejecución. Al solicitar reactivación, el sistema verifica estado, reglas y necesidad de intervención y muestra si la actuación es gratuita o tiene un cargo válido. La prestación vuelve a activa solo cuando se confirma su ejecución.

**Precargas propuestas:** BAJA-DEMO, costo por solicitud ARS 0; SUS-DEMO-GRATIS, costo ARS 0; REACT-DEMO-GRATIS, costo ARS 0. Puede existir una regla REACT-DEMO-ARANCEL con un importe de prueba de ARS 5.000, **deshabilitada para producción hasta validar su procedencia**. Son ejemplos de configuración, no aranceles reales ni afirmación de que se pueda cobrar ese importe.

**Control:** una falta de confirmación técnica deja el caso en trámite; la app no debe anunciar reactivado solo porque se confirmó el pago de un cargo admisible.

## 54. Dashboards de plataforma y tenant, alertas y auditoría de cada cambio

### Objetivo

Dar a cada nivel de administración una visión útil de su ámbito, advertir situaciones que requieren atención y permitir reconstruir cada cambio persistente realizado en el sistema.

### Límite y permisos

El tablero global no habilita acceso irrestricto a datos personales ni a la contabilidad de todos los tenants. El tablero de cooperativa se limita a su organización. Los roles controlan acciones y los perfiles controlan pantallas. La auditoría registra cambios y no constituye una pantalla para editar historia.

### Requisitos recibidos y desarrollo propuesto

| ID | Requisito informado | Alcance |
|---|---|---|
| GOB-001 | Dashboard de administrador de plataforma | Visión global autorizada de la solución y sus tenants. |
| GOB-002 | Dashboard de administrador de tenant | Visión de la operación de su cooperativa. |
| GOB-003 | Alertas | Identificar condiciones relevantes y dirigirlas a responsables. |
| GOB-004 | Auditar cada cambio | Trazabilidad de altas, modificaciones, bajas lógicas y cambios de estado/configuración. |

| Vista propuesta | Ejemplos de indicadores y alertas a validar |
|---|---|
| Plataforma | Tenants y estados; errores de procesos e integraciones; trabajos pendientes; disponibilidad operativa; configuraciones incompletas, según autorización |
| Tenant | Servicios activos; altas y bajas; agenda; tickets; consumos observados; facturación; cobros; mora; posición financiera y resultados |
| Responsables de área | Casos sin asignar; turnos fallidos; tareas vencidas; conciliaciones pendientes; reglas sin aprobar |

Cada indicador define universo, corte, frecuencia de actualización y permiso de detalle. Las alertas proponen condición, severidad, destinatarios, deduplicación, estado, reconocimiento, resolución y vínculo al objeto de origen. Umbrales, canales y escalamiento quedan por acordar.

### Registro de auditoría

La cobertura requerida es **cada cambio persistente de negocio o configuración**, incluso si lo realiza un proceso automático, integración o bot. Se propone registrar:

- Identificador de evento; tenant o ámbito global; objeto y operación.
- Actor humano o técnico y, cuando corresponda, usuario que inició la acción.
- Fecha y hora, origen/canal e identificador de ejecución o correlación.
- Valores previos y posteriores o diferencias recuperables, con referencias para archivos.
- Motivo y autorización cuando correspondan; versión y resultado de la operación.
- Relación con documento, ticket, regla, rol o configuración afectada.

También debe registrarse el intento fallido cuando sea relevante, distinguiéndolo de un cambio efectivamente confirmado. La solución debe diseñarse para no confirmar cambios sin su evidencia auditable: transacción o mecanismo durable equivalente, cuya implementación se definirá.

No se guardan contraseñas, tokens o secretos como valores anteriores/posteriores. El acceso a contenido sensible de auditoría se restringe. Los registros deben protegerse contra modificación o borrado ordinario; retención, archivo, integridad y exportación se definirán expresamente. Revertir un cambio produce una operación nueva auditada, no elimina el evento original. La auditoría de lecturas/consultas puede agregarse según necesidad; es distinta de la cobertura de cambios exigida.

### Caso de uso — CU-GOB-01

Un usuario autorizado modifica en TEN-001 la regla comercial BON-VAR-30 del 30 % al 20 % para una vigencia futura. Quedan registrados la versión anterior, la propuesta nueva, el actor y la fecha. Si el circuito requiere aprobación, el cambio no entra en vigor hasta obtenerla y esa aprobación genera su propio evento. El tablero del tenant muestra la configuración pendiente y permite consultar la evidencia a un usuario autorizado.

**Precarga:** ALT-DEMO-001, regla pendiente de aprobación; AUD-DEMO-001, cambio de porcentaje con valores 30 y 20; ámbito TEN-001. Un dashboard de TEN-002 no puede consultar esos eventos.

## 55. ERP integral y múltiples planes de cuentas por cooperativa

### Objetivo

Ofrecer una gestión ERP integrada de cada cooperativa y permitir varios planes de cuentas para analizar y simular diferentes estructuras contables sin alterar los registros oficiales ni duplicar operaciones.

### Límite y conceptos

El **plan comercial** define una prestación contratada; el **plan de cuentas** define la estructura de clasificación contable; el **presupuesto** proyecta importes; el **escenario** reúne hipótesis, datos de origen y resultados. No son entidades intercambiables.

La capacidad de múltiples planes no implica múltiples registros oficiales contradictorios. El diseño debe identificar el plan y las reglas aplicables al registro operativo y distinguir las representaciones analíticas y simuladas. La coexistencia de planes por ejercicios o finalidades, las obligaciones contables y cualquier contabilidad paralela formal requieren definición del responsable contable; aquí se confirma especialmente el uso para simulaciones.

### Requisitos recibidos

| ID | Requisito | Alcance |
|---|---|---|
| ERP-001 | Solución ERP completa | Integración de gestión comercial, operación y administración económica de la cooperativa. |
| ERP-002 | Varios planes de cuentas por tenant | Estructuras independientes, identificadas y versionadas por cooperativa. |
| ERP-003 | Simulaciones con esos planes | Comparar resultados sin contaminar los registros operativos. |

El alcance ERP integra personas y contratos; servicios y tarifas; consumos y facturación; cuentas y cobranzas; CRM y operación técnica; compras y proveedores; inventario; tesorería; contabilidad; activos y análisis. El alcance detallado de activos fijos, amortizaciones, presupuesto, nómina y módulos adicionales sigue pendiente; denominarlos ERP no confirma automáticamente toda función posible. La gestión laboral previamente descrita conserva su estado de alcance a definir.

**Ampliación confirmada:** centros de costos, cuentas contables reales y de simulación y seguimiento integrado de facturación, cobros y cuentas corrientes forman parte del alcance ERP. La sección 75 precisa su relación y un ejemplo conciliado.

### Planes, equivalencias y simulaciones: desarrollo funcional

- Crear, copiar, versionar y administrar varios planes de cuentas dentro del tenant.
- Definir jerarquía, códigos, nombres, cuentas imputables y agrupadoras y vigencia.
- Distinguir borrador, aprobado, operativo, alternativo y archivado según el circuito que se acuerde.
- Configurar reglas de contabilización y equivalencias de cuentas entre planes.
- Asociar operaciones al período y a las reglas utilizadas, conservando el documento de origen.
- Crear escenarios con plan elegido, período, universo de operaciones, supuestos y fecha de corte.
- Copiar una base de simulación para comparar hipótesis identificables y repetibles.
- Detectar cuentas sin equivalencia, asignaciones ambiguas y asientos desequilibrados antes de aceptar resultados.
- Comparar ingresos, costos, resultados y saldos con el mismo universo de origen, identificando diferencias de clasificación frente a cambios de valores.
- Impedir que ejecutar una simulación emita facturas, genere deuda, mueva fondos, envíe órdenes a terceros o contabilice oficialmente.
- Exportar resultados según permisos, identificados como simulación.
- Promover una configuración aprobada mediante una acción explícita, nueva vigencia y auditoría; no convertir automáticamente resultados simulados en asientos reales.

### Caso de uso — CU-ERP-01

El contador de TEN-001 quiere comparar una estructura agrupada de ingresos con otra que los distingue por servicio. Se utiliza un universo ficticio de dos ingresos netos, sin tributos, por ARS 13.000 de agua y ARS 25.000 de internet.

| Plan de cuentas de demostración | Tratamiento | Resultado de clasificación |
|---|---|---|
| PC-OPER-01 — Operativo | Cuenta Ingresos por servicios | ARS 38.000 |
| PC-ALT-01 — Alternativo | Cuentas Ingresos Agua e Ingresos Internet | ARS 13.000 y ARS 25.000; total ARS 38.000 |

1. Copiar la estructura a PC-ALT-01 y definir sus cuentas y equivalencias.
2. Crear SIM-ERP-001 con el universo de operaciones de ejemplo y fecha de corte identificada.
3. Ejecutar la representación alternativa y comprobar integridad, equivalencias y equilibrio de asientos completos.
4. Comparar la clasificación y conservar el mismo total de origen, sin generar nuevas ventas ni facturas.
5. Si se decide adoptar el plan alternativo, tramitar su aprobación y definir vigencia y migración. La simulación por sí sola no cambia la contabilidad oficial.

La tabla muestra solo la clasificación de ingresos, no un asiento completo. En pruebas contables se incluyen sus contrapartidas. Una hipótesis de tarifa +10 % sería una simulación económica distinta: produciría ingresos hipotéticos de ARS 41.800 sobre esa base, separados del cambio de estructura contable y sin cargo real al socio.

**Controles:** sin mapeo completo no aceptar el escenario como comparable; no duplicar importes si una equivalencia reparte una cuenta; mantener balanceada cualquier distribución. Los escenarios y datos permanecen aislados por tenant.

## 56. Fuentes oficiales de la investigación argentina

Consultadas el 3 de noviembre de 2026. Los porcentajes, cuadros y disposiciones deben verificarse nuevamente para la vigencia y jurisdicción de cada implementación. Las fuentes respaldan los hechos sintetizados en la sección 52; las decisiones de diseño se identifican como consecuencias propuestas.

- **[AR1] Decreto 943/2025, régimen SEF:** https://www.boletinoficial.gob.ar/detalleAviso/primera/337035/20260102?anexos=1
- **[AR2] Secretaría de Energía, anuncio del régimen SEF del 2/1/2026:** https://www.argentina.gob.ar/noticias/el-gobierno-oficializa-el-nuevo-esquema-de-subsidios-energeticos-tras-la-consulta-publica
- **[AR3] Secretaría de Energía, prórroga de bonificaciones para noviembre, comunicación del 30/10/2026:** https://www.argentina.gob.ar/node/519661
- **[AR4] ARCA, RG 5614/2024, transparencia fiscal:** https://biblioteca.arca.gob.ar/search/query/norma.aspx?p=t:RAG%7Cn:5614%7Co:9%7Ca:2024%7Cf:12/12/2024
- **[AR5] ARCA, situaciones especiales de comprobantes:** https://www.arca.gob.ar/facturacion/comprobantes/situaciones-especiales.asp
- **[AR6] ARCA, oportunidad de emisión y entrega:** https://www.arca.gob.ar/facturacion/comprobantes/emision.asp
- **[AR7] Secretaría de Industria y Comercio, Resolución 267/2024:** https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-267-2024-403950/texto
- **[AR8] Ley 24.240, texto actualizado, artículos 10 ter y 10 quáter:** https://www.argentina.gob.ar/normativa/nacional/ley-24240-638/actualizacion
- **[AR9] Resolución 316/2018, texto actualizado, botón y registro de baja:** https://www.argentina.gob.ar/normativa/nacional/norma-310734/actualizacion

## 57. Definiciones pendientes de esta ampliación

- [ ] Cooperativa piloto, jurisdicciones y servicios efectivos para relevar tarifas y normas concretas.
- [ ] Planes, grupos, condiciones fiscales y padrones de beneficios autorizados.
- [ ] Bases, topes, compatibilidad, prorrateo y reglas de redondeo.
- [ ] Quién revisa y aprueba la configuración tarifaria y fiscal del tenant.
- [ ] Disponibilidad, recursos, zonas, reprogramaciones y reglas de visitas.
- [ ] Condiciones particulares de suspensión/reactivación, cargos admisibles y efectos de facturación.
- [ ] Recepción pública de bajas, identificación posterior sin barreras y constancias aplicables.
- [ ] Indicadores y permisos del dashboard global y del tenant; umbrales y canales de alertas.
- [ ] Cobertura técnica, integridad, retención y accesos de auditoría.
- [ ] Planes de cuentas, finalidad de cada uno, reglas de contabilización y equivalencias.
- [ ] Qué simulaciones son contables, económicas o presupuestarias y qué datos comparten.
- [ ] Alcance adicional de módulos ERP: activos fijos, amortizaciones, presupuesto y personal.

Los cinco puntos recibidos quedan incorporados como requisitos del sistema propio. Los ejemplos monetarios y estructuras de demostración no son configuraciones fiscales ni aranceles aprobados para producción.

## 58. Revisión expresa de arquitectura: gestión de cooperativas, ERP y CRM

### Requisito informado — ARQ-001

**Debe revisarse especialmente, al definir la arquitectura, que la solución es una plataforma integral de gestión de cooperativas con un ERP, un CRM y otros sistemas o componentes relacionados. Es una definición estructural del producto y debe quedar como punto explícito de revisión y decisión.**

### Objetivo y límite

Definir responsabilidades y relaciones entre capacidades antes de decidir su implementación. Este requisito obliga a revisar y documentar decisiones; no aprueba una separación técnica en servicios ni una tecnología determinada.

### Temas obligatorios para la revisión

| Tema | Pregunta que debe resolverse |
|---|---|
| Límites de ERP y CRM | Qué información y procesos administra cada uno y cómo se vinculan sin duplicarlos. |
| Datos comunes | Quién es responsable de personas, usuarios, asociados, servicios, contratos, cuentas y documentos. |
| Lenguaje del tenant desde el inicio | Cómo se resuelven términos y etiquetas configurables en todos los canales conservando claves y significados comunes. |
| Reutilización de Connectyx | Qué componentes de comunidad, experiencia y código pueden reutilizarse tras revisar el proyecto indicado, sin trasladar datos ni configuraciones privadas. |
| Copia de servicios | Cómo se versiona, adapta y valida la configuración copiada entre tenants sin acoplar sus operaciones. |
| Multitenancy | Cómo se identifica y aísla cada cooperativa en datos, procesos, archivos e integraciones. |
| Coordinación | Cómo se comunica un ticket con una orden, un contrato y una factura y cómo se recupera de fallos. |
| APIs de cooperativas | Cómo se habilita consulta externa sin exponer datos de otros tenants ni sobrecargar procesos críticos. |
| Identidad y seguridad | Autenticación local/federada, MFA, recuperación, roles, perfiles y cuentas de servicio. |
| Organismos gubernamentales | Qué se calcula internamente y qué se presenta o valida fuera, por organismo y régimen. |
| Datos analíticos | Cómo se separan reportes/BI de operación y simulaciones sin perder consistencia. |
| Auditoría | Cómo se registra cada cambio, incluso entre componentes y procesos automáticos. |
| Operación | Versionado, despliegues, observabilidad, capacidad y recuperación. |

**Entregable pendiente:** decisiones de arquitectura documentadas, responsables de datos y procesos, interfaces, riesgos, alternativas y criterios de elección. La elección de microservicios no se considera una consecuencia automática de incluir un ERP y un CRM.

**Ejemplo de revisión — CU-ARQ-01:** el CRM registra un pedido de internet; operación técnica gestiona la visita; contratos determina el alta efectiva y ERP liquida el servicio. Debe definirse quién confirma cada hito y cómo se evita que un reintento genere dos contratos o dos facturas.

## 59. APIs tokenizadas para datos de la cooperativa — requisito informado

### Objetivo

Permitir que cada cooperativa obtenga su información y la de sus asociados dentro de su ámbito autorizado para utilizarla en dashboards propios, BI y otras herramientas. Se incorpora como principio del producto que el tenant debe disponer de sus datos y no quedar limitado a los reportes internos de la plataforma. Las claves del contrato de API se mantienen estables aunque la cooperativa personalice los nombres visibles; pueden ofrecerse metadatos de etiquetas sin renombrar silenciosamente campos técnicos.

### Límite

La disponibilidad de información del tenant no elimina las restricciones sobre datos personales, permisos ni secretos del sistema. No habilita acceso a otra cooperativa ni entrega contraseñas, tokens, claves fiscales o secretos de autenticación. El requisito confirmado es obtener información; las APIs de modificación o ejecución de operaciones se especificarán aparte.

La mención del solicitante a que los asociados y su información son de la cooperativa se registra como necesidad de acceso y disponibilidad de datos de su relación con ellos; no se interpreta como eliminación de los derechos de las personas sobre sus datos.

### Requisitos recibidos

| ID | Requisito | Efecto |
|---|---|---|
| API-001 | Una o varias APIs tokenizadas | Acceso autenticado y atribuible a un cliente autorizado. |
| API-002 | Obtener información propia | Consultas sobre el tenant y sus relaciones autorizadas. |
| API-003 | Uso en dashboards, BI y otras herramientas | Datos reutilizables fuera de la interfaz de la plataforma. |

### Alcance funcional propuesto

- Registrar aplicaciones/clientes autorizados por tenant, con responsable, finalidad, estado y permisos.
- Emitir o autorizar credenciales y tokens con alcances específicos; no usar un token global compartido por cooperativas.
- Diferenciar integración servidor a servidor y acceso delegado por un usuario.
- Restringir por tenant, objeto, campo y acción, según el catálogo de acceso que se defina.
- Gestionar expiración, rotación y revocación y registrar el uso sin guardar el token completo en logs.
- Documentar versiones, esquemas, filtros, paginación, fechas, zonas horarias, estados y significado de importes.
- Ofrecer extracción incremental y, si el volumen lo requiere, exportaciones autorizadas con estado y vencimiento.
- Definir límites de consumo, respuesta a errores y continuidad para no afectar facturación ni atención.
- Registrar fuente y fecha de corte para que BI pueda interpretar datos operativos, consolidados o simulados.
- Publicar un inventario claro de datos disponibles y restricciones; no prometer acceso ilimitado a cualquier tabla interna.

Los mecanismos concretos se definirán en arquitectura. OAuth 2.0 con alcances y flujos apropiados es una opción a evaluar; RFC 9700 proporciona prácticas de seguridad actuales para ese ecosistema [SEG3]. Tokenizar no obliga a utilizar JWT ni justifica poner tokens duraderos en aplicaciones públicas.

### Datos candidatos a exponer, pendientes de permiso y contrato de API

| Dominio | Ejemplos |
|---|---|
| Asociados y contratos | Identificadores, relaciones, estados y servicios, con minimización de datos personales. |
| Consumos y facturación | Períodos, cantidades, conceptos, comprobantes y saldos. |
| Cobranzas | Pagos confirmados, imputaciones y conciliaciones autorizadas. |
| CRM y operación | Tickets, áreas, tiempos, órdenes y visitas, sin exponer notas o archivos fuera del alcance. |
| ERP | Catálogos, movimientos y agregados financieros/contables según autorización. |

### Caso de uso — CU-API-01

El administrador autorizado de TEN-001 habilita BI Cooperativa A con alcance de consulta de facturación y cobranza. La herramienta obtiene un token por el mecanismo acordado y consulta datos paginados con fecha de corte. No puede consultar TEN-002 ni modificar facturas. Al revocar la credencial, su uso deja de autorizar nuevas consultas según el plazo de revocación definido.

**Precarga ilustrativa:** cliente CLI-BI-A; tenant TEN-001; alcances de ejemplo facturacion:leer y cobranza:leer; estado Activo; responsable ficticio USR-ADM-A. No se incluye un token real en el documento. Los nombres de alcances y rutas de API son propuestas pendientes.

## 60. Seguridad actual, 2FA, Google y recuperación de acceso

### Objetivo

Reducir el riesgo de robo de información y accesos indebidos con controles verificables, mantenidos en el tiempo y aplicados a plataforma, cooperativas, socios, empleados e integraciones.

### Requisitos informados

| ID | Requisito | Alcance |
|---|---|---|
| SEG-001 | Estándares actuales de seguridad informática | Referencias versionadas, controles y verificación continuada. |
| SEG-002 | Doble factor de autenticación | Disponibilidad de MFA y política de exigencia según cuentas/acciones. |
| SEG-003 | Autenticación con Google | Acceso federado sin eludir permisos ni pertenencia al tenant. |
| SEG-004 | Cambio de contraseña | Procedimiento autenticado, confirmado y auditado. |
| SEG-005 | Recuperación de contraseña con 2FA | Restablecimiento sin convertir la recuperación en un acceso más débil. |

### Referencias verificadas al 3/11/2026

OWASP publica ASVS 5.0.0 como versión estable para requisitos verificables de seguridad de aplicaciones [SEG1]. NIST SP 800-63B-4 trata autenticación, factores y recuperación; distingue OTP de mecanismos resistentes al phishing y contempla códigos y otras vías de recuperación [SEG2]. RFC 9700, publicado en enero de 2025, actualiza las prácticas de seguridad de OAuth 2.0 [SEG3]. La documentación de Google OpenID Connect describe validación del token y del identificador estable del usuario [SEG4].

Se propone registrar versiones y seleccionar requisitos y rigor según riesgo; esto no constituye una certificación de cumplimiento. La referencia a los últimos estándares implica revisión periódica de cambios, vulnerabilidades y dependencias, no una lista congelada en la fecha del documento.

### Doble factor y sesión

- Admitir un segundo factor de posesión, por ejemplo aplicación autenticadora, y evaluar passkeys/WebAuthn como opción resistente al phishing según la política acordada.
- Establecer exigencia de MFA para administradores de plataforma y tenant y funciones sensibles; precisar por separado la política de socios y otros empleados.
- Requerir verificación reforzada para cambiar factores, recuperar acceso o realizar acciones de alto impacto según riesgo.
- Administrar alta, verificación, sustitución y revocación de factores con auditoría y avisos.
- Proteger sesiones, limitar intentos y automatización abusiva y permitir cierre/revocación de sesiones.
- No considerar dos contraseñas o preguntas de seguridad como dos factores independientes.

Métodos concretos, tiempos, dispositivos confiables y eventuales alternativas deben definirse. La autenticación de máquinas para BI utiliza credenciales técnicas y permisos limitados, no un OTP humano en cada consulta.

### Acceso con Google

Se debe validar el flujo y token del proveedor, incluyendo firma, emisor, destinatario y vigencia, e identificar la cuenta mediante el identificador estable correspondiente [SEG4]. Tener una sesión de Google no concede automáticamente roles ni acceso a un tenant; la vinculación debe ser explícita y segura. No se fusionan cuentas solo por coincidencia de correo.

No se presume que cualquier acceso con Google satisfaga la política de MFA de la plataforma: debe comprobarse la garantía disponible o solicitar una verificación adicional. La contraseña de Google se cambia o recupera con Google; la plataforma administra sus factores y sesión propios y los permisos del tenant.

### Cambio y recuperación de contraseña local

**Cambio autenticado:** verificar la sesión y los factores requeridos, comprobar la contraseña o autenticador vigente según el flujo, registrar la nueva credencial de forma segura, notificar y aplicar la política de revocación de sesiones.

**Olvido con segundo factor disponible:** iniciar un proceso con respuesta que no revele si una cuenta existe, validar un medio de recuperación y el segundo factor registrado, usar pruebas de un solo uso con vigencia limitada y permitir establecer una nueva contraseña sin desactivar MFA.

**Pérdida del segundo factor:** recurrir a códigos de recuperación previamente emitidos u otro procedimiento documentado de verificación de identidad, con notificación y controles acordes al riesgo. Un correo por sí solo o una solicitud al soporte no debe permitir eliminar MFA sin el procedimiento reforzado. La recuperación debe diseñarse para no requerir precisamente el factor perdido como única salida.

NIST desaconseja la rotación periódica indiscriminada y las reglas arbitrarias de composición; la política propuesta debe contemplar longitud, bloqueo de contraseñas comprometidas y almacenamiento resistente a ataques, adaptados al modelo de autenticación [SEG5]. Los parámetros técnicos se acordarán al diseñar identidad.

### Protección transversal propuesta

- Autorización en servidor con aislamiento de tenant y control por objeto/acción/campo.
- Protección del transporte, almacenamiento sensible, archivos y copias de seguridad, con gestión de claves.
- Tratamiento seguro de credenciales y secretos, separados por entorno y ámbito.
- Validación de entradas, protección frente a inyección y ataques a sesiones, y control de archivos adjuntos.
- Pruebas de seguridad de API y aislamiento entre tenants, análisis de dependencias y corrección de vulnerabilidades.
- Monitoreo de eventos y respuesta a incidentes vinculada a auditoría y alertas.
- Protección equivalente en recuperación, administración, procesos automáticos, bot e interfaces fiscales.

### Caso de uso — CU-SEG-01

El administrador de TEN-001 registra un factor, accede mediante el flujo permitido y realiza un cambio sensible tras verificación reforzada. Si olvida su contraseña local y conserva el factor, recupera acceso sin eliminarlo. Si pierde el factor, usa el procedimiento de recuperación previsto; se notifican los cambios y se invalidan las sesiones que corresponda. Su rol sigue limitado a TEN-001.

**Datos de demostración:** usuario USR-ADM-A; MFA Requerido; factor TOTP o passkey, sujeto a diseño; eventos Alta de factor y Recuperación iniciada/completada. No se precargan contraseñas, semillas, claves ni códigos de recuperación reales.

## 61. Módulo de organismos gubernamentales y actuación como agente de retención

### Objetivo

Permitir que cada cooperativa gestione su relación con organismos gubernamentales en materia de retenciones impositivas, desde las operaciones que las originan hasta certificados, declaraciones, ingreso de fondos, respuestas y conciliación.

### Requisito informado y límite

**FIS-001:** contar con un módulo para interactuar con entes gubernamentales por la actuación de las cooperativas como agentes de retención. Se registra como componente con responsabilidad propia a revisar en arquitectura junto con ERP y CRM.

No todas las obligaciones o mecanismos son iguales entre cooperativas, impuestos o jurisdicciones. Debe identificarse cada régimen que efectivamente corresponda. Las percepciones y retenciones sufridas se contemplan como conceptos relacionados para relevar; el requisito explícito recibido es la actuación como agente de retención.

### Verificación de fuentes oficiales

ARCA incluye a las cooperativas, con una excepción específica, entre los agentes de la RG 830 de Ganancias [FIS-F1]. Sus páginas describen SIRE para determinados regímenes y mantienen documentación de SICORE; no debe asumirse que uno reemplaza universalmente al otro [FIS-F2, FIS-F3]. La Comisión Arbitral describe SIRCAR para agentes de retención y/o percepción de Ingresos Brutos [FIS-F4].

**Consecuencia de diseño:** catálogo por organismo, impuesto, régimen, jurisdicción, carácter del tenant y vigencia. No se fija un porcentaje, mínimo, vencimiento ni un único sistema de presentación para todas las obligaciones. La integración específica y el mecanismo habilitado se verifican al relevar cada caso.

### Alcance funcional propuesto

- Registrar organismos, regímenes, condición de agente y vigencias de la cooperativa, con respaldo y responsables.
- Mantener datos fiscales, padrones, exclusiones, certificados de no retención y vencimientos según normativa aplicable.
- Configurar base, alícuotas/escalas, mínimos, acumulación, momento de retención, redondeo y excepciones por régimen.
- Calcular y revisar las retenciones originadas en pagos u operaciones, sin confundirlas con impuestos agregados a la factura de servicios del socio.
- Registrar importes practicados, tercero afectado, operación origen, certificado y obligación de ingreso.
- Generar documentos internos y emitir u obtener certificados oficiales mediante el sistema autorizado cuando corresponda; distinguir ambos estados.
- Preparar lotes y declaraciones, validarlos y generar archivos en formatos y versiones aceptados.
- Utilizar APIs/web services oficiales solo cuando existan y estén habilitados; admitir exportación y presentación humana cuando sea el mecanismo válido.
- Registrar presentación, recepción, aceptación/rechazo y acuses; la creación de un archivo no implica presentación aceptada.
- Gestionar vencimientos, pagos a organismos y comprobantes, integrados con tesorería.
- Conciliar operaciones, certificados, declaraciones, pagos y cuentas contables.
- Gestionar anulaciones, devoluciones y rectificaciones conservando sus vínculos e historia.
- Auditar configuración, cálculos, autorizaciones, envíos, respuestas y cambios de estado por tenant.

### Organización e interfaces

| Componente | Responsabilidad |
|---|---|
| Compras/proveedores y pagos | Operación que puede originar retención y datos del tercero. |
| Módulo fiscal | Régimen, determinación, certificados, preparación y seguimiento de obligaciones. |
| Conector por organismo/sistema | Archivo, API o mecanismo oficial habilitado y respuestas. |
| Tesorería | Pago neto al tercero e ingreso de fondos al organismo, como movimientos distintos. |
| Contabilidad | Obligación por retenciones y su cancelación, con reglas validadas. |
| Auditoría y alertas | Evidencia, vencimientos, rechazos y diferencias. |

Las credenciales fiscales y delegaciones de cada cooperativa son distintas de los tokens que se entregan a su BI. No deben compartirse entre tenants ni exponerse en APIs de datos. No se presupone automatizar pantallas autenticadas ni omitir controles oficiales.

### Caso de uso — CU-FIS-01

Una cooperativa paga a un proveedor y se verifica que corresponde una retención según un régimen habilitado. Para demostrar el circuito se inventan una base de ARS 100.000 y una retención de ARS 2.000; no representan una alícuota real ni contemplan mínimos u otros tributos.

1. ERP registra la obligación y prepara el pago por ARS 100.000.
2. El módulo fiscal aplica la configuración validada y determina ARS 2.000 de retención.
3. Se registra pago neto de ARS 98.000 al proveedor y obligación fiscal por ARS 2.000, sin eliminar deuda sin justificación.
4. Se genera o tramita el certificado por el mecanismo correspondiente y se conserva la referencia oficial cuando se obtiene.
5. La retención integra la declaración y período correctos; se registra el envío y su respuesta.
6. Tesorería ingresa los ARS 2.000 al organismo y contabilidad concilia la cancelación de la obligación.

**Control:** no marcar Presentado por exportar un archivo ni Pagado por emitir una instrucción de pago. Un reintento no genera otra retención. Un rechazo conserva su evidencia y permite corrección o rectificación por el procedimiento aplicable.

**Precarga ficticia:** tenant TEN-001; proveedor PROV-DEMO-001; retención RET-DEMO-001; régimen REG-DEMO pendiente de configuración real; lote DDJJ-DEMO-001; base ARS 100.000; retención ARS 2.000; neto ARS 98.000. No se inventa un número de certificado oficial ni una CUIT real.

## 62. Fuentes de seguridad, identidad y regímenes fiscales

Consultadas el 3 de noviembre de 2026. Las fuentes respaldan los hechos resumidos; los controles propuestos y los flujos de integración deben diseñarse y validarse en su contexto.

- **[SEG1] OWASP ASVS, versión estable publicada:** https://asvs.owasp.org/
- **[SEG2] NIST SP 800-63B-4, autenticación y recuperación:** https://pages.nist.gov/800-63-4/sp800-63b.html
- **[SEG3] IETF RFC 9700, OAuth 2.0 Security Best Current Practice:** https://www.rfc-editor.org/info/rfc9700/
- **[SEG4] Google, OpenID Connect:** https://developers.google.com/identity/openid-connect/openid-connect
- **[SEG5] NIST, preguntas frecuentes sobre Digital Identity Guidelines:** https://pages.nist.gov/800-63-4-Implementation-Resources/faqs/
- **[FIS-F1] ARCA, agentes de retención de la RG 830:** https://www.arca.gob.ar/gananciasYBienes/ganancias/retenciones/rg830/agentes.asp
- **[FIS-F2] ARCA, SIRE, determinación e ingreso:** https://www.arca.gob.ar/sire/percepciones-retenciones/
- **[FIS-F3] ARCA, SICORE:** https://www.arca.gob.ar/aplicativos/oProgramasImpositivos/sistControlRetenciones.asp
- **[FIS-F4] Comisión Arbitral, SIRCAR:** https://www.ca.gob.ar/sistemas/sircar

## 63. Decisiones pendientes de esta ampliación

- [ ] Realizar y documentar la revisión de arquitectura integral ERP/CRM y componentes relacionados.
- [ ] Definir responsables de datos, límites e interfaces entre componentes.
- [ ] Definir catálogo de APIs, datos, campos, alcances y políticas de exportación por tenant.
- [ ] Definir protocolos de tokens, clientes, expiración, rotación, revocación y límites de uso.
- [ ] Seleccionar proveedor/mecanismo de identidad, flujo con Google y vinculación de cuentas.
- [ ] Definir dónde se exige MFA, métodos permitidos y recuperación cuando se pierde un factor.
- [ ] Adoptar una matriz verificable de seguridad con versión y nivel de rigor acordados.
- [ ] Identificar organismos, impuestos y regímenes concretos de cada cooperativa.
- [ ] Confirmar condición de agente, certificados, reglas, formatos, vencimientos y sistemas oficiales.
- [ ] Verificar APIs disponibles, permisos, delegaciones y alternativas de exportación/presentación.
- [ ] Definir responsables de aprobar, presentar, rectificar, pagar y conciliar obligaciones fiscales.

Los cuatro puntos informados se incorporan como requisitos del producto propio. El módulo de organismos gubernamentales deberá profundizarse con los regímenes y operaciones concretos que indique la cooperativa.

## 64. Posicionamiento competitivo y solución SaaS en la nube

### 64.1. Contexto y diagnóstico aportado

ProCoop se toma como un competidor de referencia por su trayectoria, amplitud funcional y presencia en el mercado de cooperativas. Según la valoración y experiencias transmitidas por el solicitante, es una solución consolidada que presenta oportunidades de mejora en tecnología de despliegue, integración, experiencia digital del socio, personalización, seguridad y soporte.

Este diagnóstico es información comercial recibida para orientar el producto. No constituye una auditoría técnica de ProCoop ni una medición de su participación de mercado. No se dispone de evidencia para cuantificar su adopción como “medio Argentina”, generalizar problemas a todas sus instalaciones o afirmar que ninguna versión ofrece una capacidad determinada.

### 64.2. Redacción de la oportunidad del producto

**El objetivo es desarrollar una plataforma integral de gestión de cooperativas que combine la profundidad funcional necesaria para competir con soluciones consolidadas como ProCoop y una experiencia moderna de servicio: SaaS multitenant en la nube, autogestión de la cooperativa y sus socios, aplicaciones con identidad de cada organización, APIs para disponer de sus datos, seguridad verificable y soporte trazable.**

**La cooperativa no deberá instalar el sistema de gestión ni disponer de servidores propios para alojarlo.** Accederá al servicio administrado en la nube, con su tenant, configuración, usuarios, roles, perfiles, marca, datos y procesos. El socio dispondrá de un canal digital identificado con su cooperativa para recorrer el ciclo de sus servicios. La plataforma deberá sostener esa operación con mantenimiento, actualizaciones, monitoreo, recuperación y atención de soporte definidos como parte del servicio.

La ventaja buscada debe abarcar la operación cotidiana y la continuidad del servicio, además de la interfaz: resolver solicitudes, cobrar correctamente, integrar información, proteger datos y dar respuesta a incidencias con seguimiento. La facilidad de uso no reemplaza la profundidad de ERP, CRM y reglas del sector.

### 64.3. Referencias recibidas y respuesta requerida

| Aspecto | Debilidad señalada por el solicitante sobre ProCoop | Objetivo del sistema propio | Estado de la comparación |
|---|---|---|---|
| Despliegue | Instalación local en máquinas de la cooperativa. | Aplicación administrada en la nube, sin instalación del núcleo de gestión en equipos del tenant. | Experiencia reportada; versiones y modalidades del competidor pendientes de verificar. |
| Infraestructura | Necesidad de disponer y administrar servidores propios. | SaaS multitenant; el tenant utiliza el servicio sin operar servidores para alojarlo. | Diagnóstico recibido; requisito propio confirmado. |
| Integración | Ausencia o insuficiencia de APIs disponibles para la cooperativa. | APIs tokenizadas, documentadas y autorizadas para datos propios y herramientas externas. | No se confirmó públicamente la ausencia total de API del competidor. |
| Canal del socio | Aplicación inexistente en ciertas experiencias o limitada en funcionalidad/usabilidad. | Autogestión integral de contratación, visitas, consumo, facturas, pagos, atención y ciclo del servicio. | ProCoop publica CoopOnline; su alcance y calidad deben compararse con casos reales. |
| Identidad visual | Personalización insuficiente con la marca de la cooperativa. | Marca, colores, logos y recursos por canal, junto con landing configurable por tenant. | Limitación reportada; grado de personalización del competidor pendiente de relevar. |
| Seguridad | Fallas percibidas o incidentes mencionados en las referencias recibidas. | Controles verificables, MFA, identidad federada, recuperación segura, aislamiento y auditoría. | No hay auditoría ni incidentes documentados que permitan afirmar vulnerabilidades concretas del competidor. |
| Soporte | Ineficiencias y dificultades de atención o resolución. | Gestión de soporte con tickets, responsables, estado, comunicación, evidencias y seguimiento. | Valoración recibida; no se dispone de métricas comparables. |

El relevamiento público inicial identifica CoopOnline y P-Móvil [F2, F3]. Por eso la comparación del canal del socio debe centrarse en profundidad, experiencia y personalización verificadas, en lugar de sostener que no existe ninguna app. Las APIs, despliegues y controles del competidor se validarán por versión e instalación.

### 64.4. Requisitos propios que se incorporan

| ID | Requisito | Criterio funcional |
|---|---|---|
| SaaS-001 | Servicio SaaS en la nube | La cooperativa usa una plataforma operada como servicio. |
| SaaS-002 | Multitenancy | Cada cooperativa mantiene su ámbito independiente, conforme al resto del documento. |
| SaaS-003 | Sin servidores propios para alojar la gestión | El uso no depende de infraestructura de servidor administrada por el tenant. |
| SaaS-004 | Canales con identidad de la cooperativa | Landing, administración y apps con los recursos de marca definidos. |
| SaaS-005 | Operación y soporte del servicio | Incidencias, mantenimiento y atención con seguimiento y responsabilidad. |

“SaaS” no define todavía precio, licencias, facturación de la plataforma, regiones de alojamiento ni proveedor de infraestructura. La lectura de equipos físicos o conexiones con dispositivos se analizará aparte y no cambia el objetivo de alojar el núcleo de gestión en la nube.

### 64.5. Operación y soporte de la plataforma — desarrollo propuesto

Debe distinguirse el **soporte que la plataforma presta a la cooperativa** del **CRM con el que la cooperativa atiende a sus socios**. Pueden compartir capacidades técnicas si se decide, pero sus expedientes, permisos y responsables son distintos.

- Permitir al tenant registrar una incidencia de plataforma y recibir una referencia de seguimiento.
- Identificar módulo, impacto, contexto autorizado y evidencias sin solicitar contraseñas ni secretos.
- Asignar responsable, prioridad y estado; mantener conversación e historial de actuaciones.
- Comunicar avances, solución y eventual vinculación con un incidente general de plataforma.
- Permitir soporte sobre información del tenant solo con el alcance autorizado y evidencia de acceso o cambios.
- Definir mantenimiento, monitoreo, copias y pruebas de recuperación, gestión de actualizaciones y respuesta a incidentes.
- Definir objetivos de disponibilidad, atención y recuperación medibles; no prometer cifras sin acuerdo y validación.

### 64.6. Caso de uso — CU-SaaS-01

Una cooperativa se incorpora a la plataforma. Se habilita su tenant y accede a su administración sin adquirir o preparar un servidor para alojar el sistema. Configura marca y servicios y dispone de su landing. Sus empleados y socios utilizan los canales correspondientes.

Si el responsable detecta un error al emitir un reporte, registra SUP-DEMO-001 en el soporte de plataforma. El equipo de soporte recibe el caso, solicita el contexto necesario, comunica el avance y registra la solución. El caso no se mezcla con un reclamo de agua de un socio de esa cooperativa.

**Datos ilustrativos:** tenant TEN-001; canal Administración; incidencia SUP-DEMO-001; módulo Reportes; estado Recibida. No se fija todavía un plazo contractual de respuesta.

### 64.7. Validación competitiva y decisiones pendientes

- [ ] Contrastar versiones, instalaciones y modalidades efectivamente utilizadas de ProCoop.
- [ ] Comparar circuitos completos con socios y empleados de una cooperativa real.
- [ ] Medir capacidades, personalización y experiencia del canal del socio, sin negar las apps documentadas.
- [ ] Verificar disponibilidad, alcance y condiciones de APIs e integraciones del competidor.
- [ ] Relevar problemas de soporte con casos y tiempos, evitando generalizaciones sin evidencia.
- [ ] Definir la operación SaaS, responsabilidades de plataforma y tenant y niveles de servicio.
- [ ] Incorporar migración y adopción al plan de implementación: la cooperativa debe mantener la continuidad de su operación.

Las limitaciones reportadas orientan la diferenciación. Los compromisos del producto propio deben expresarse en capacidades y criterios verificables, no en una promesa genérica de ausencia total de fallas.

## 65. Diccionario de términos y etiquetas de interfaz por tenant

### 65.1. Prioridad y requisito informado

**IMPORTANTE DESDE EL PRINCIPIO DEL DESARROLLO:** cada cooperativa utiliza un lenguaje propio. La solución debe permitir configurar por tenant un diccionario de términos y las etiquetas de su interfaz, además de la personalización visual de marca, paleta y logos. Esta capacidad debe formar parte del diseño inicial y aplicarse al construir cada módulo y canal.

| ID | Requisito informado | Consecuencia |
|---|---|---|
| DIC-001 | Diccionario de términos por cooperativa | Cada tenant puede definir las denominaciones que utiliza su organización. |
| DIC-002 | Etiquetas de UI configurables por tenant | La interfaz presenta el vocabulario correspondiente a la cooperativa. |
| DIC-003 | Incorporación desde el inicio | La primera versión debe contar con el mecanismo y sus reglas de uso; no es una adaptación posterior. |
| DIC-004 | Personalización visual y de lenguaje | La identidad del tenant comprende cómo se ve y cómo nombra sus conceptos. |

### 65.2. Objetivo

Permitir que socios y empleados encuentren términos familiares y consistentes en los canales de su cooperativa, manteniendo un modelo de negocio común y una plataforma mantenible.

### 65.3. Límite y relación con otros módulos

El diccionario cambia la denominación visible de un concepto, no su significado, comportamiento, permisos ni identidad de datos. Un tenant puede presentar Socio donde otro presenta Asociado; ello no crea dos entidades técnicas diferentes. Tampoco puede volver equivalentes conceptos distintos solo por usar palabras parecidas: baja definitiva y suspensión temporal deben seguir diferenciadas.

La terminología es una capacidad transversal relacionada con configuración del tenant y marca, pero no debe quedar limitada al editor de landing. También debe considerarse en administración, aplicaciones y nuevas pantallas. Traducir a otros idiomas es una capacidad relacionada, pero no fue solicitada expresamente aquí y no sustituye la personalización entre cooperativas que usan el mismo idioma.

Las leyendas normativas, denominaciones fiscales u otros textos cuyo contenido debe preservarse se identificarán por separado: no se habilita su modificación indiscriminada. Las claves de API, códigos de permisos, identificadores y estados internos no cambian al editar un label.

### 65.4. Alcance funcional propuesto

- Disponer de un catálogo base de conceptos y textos de interfaz identificados de forma estable.
- Asociar a cada término una descripción funcional y contexto para evitar confundir palabras de distinto significado.
- Configurar por tenant la denominación preferida y las variantes necesarias: singular, plural, título o etiqueta contextual.
- Administrar títulos, menús, nombres de campos, botones y mensajes dentro del catálogo habilitado para personalización.
- Aplicar el vocabulario propio a landing, administración, desktop, app de socios y app de empleados según los textos y canales habilitados.
- Distinguir un término de negocio reutilizado de un texto específico de una pantalla.
- Utilizar valores base cuando la cooperativa no personaliza un texto; evitar pantallas sin etiqueta o claves técnicas expuestas.
- Permitir que una cooperativa comience con el diccionario base y personalice progresivamente.
- Previsualizar el resultado en contexto y detectar textos demasiado largos o ambiguos antes de aplicarlos.
- Autorizar la administración del diccionario mediante rol funcional y perfil de pantalla; no habilitarla a cualquier usuario.
- Registrar versiones y auditoría de cada cambio; definir mecanismo de publicación y reversión.
- Mantener el mismo significado en UI, ayuda, atención y datos, incluso cuando cambie la denominación visible.

El inventario concreto de textos editables se definirá al diseñar cada módulo. Las capacidades de copiar plantillas, importar/exportar diccionarios o variar términos por canal son opciones de diseño pendientes; no se presupone un lenguaje distinto por cada usuario.

### 65.5. Ejemplos de términos por cooperativa

Valores ficticios para mostrar el comportamiento; no son preferencias confirmadas de organizaciones reales.

| Concepto interno | Descripción de referencia | TEN-001: Cooperativa A | TEN-002: Cooperativa B |
|---|---|---|---|
| Persona asociada | Relación institucional con la cooperativa | Socio / Socios | Asociado / Asociados |
| Solicitud de atención | Caso presentado para atención | Gestión / Gestiones | Solicitud / Solicitudes |
| Referencia de caso CRM | Identificador para seguir una gestión | Ticket | Número de gestión |
| Unidad responsable | Área interna que atiende casos | Área | Sector |
| Trabajo técnico | Actuación técnica asignada | Orden de trabajo | Orden de servicio |
| Resumen de cuenta | Presentación de obligaciones existentes | Resumen de cuenta | Estado de cuenta |

Los términos Cuenta, Contrato y Suministro requieren definiciones propias y no se intercambian automáticamente. Un mismo término en dos contextos puede requerir claves distintas. Los ejemplos de órdenes tampoco fijan que toda denominación pueda aplicarse a cualquier proceso sin validación de significado.

### 65.6. Ejemplos de etiquetas de interfaz

Las siguientes claves son ilustrativas, no un contrato técnico definitivo:

| Clave estable de ejemplo | Texto base | TEN-001 | TEN-002 |
|---|---|---|---|
| asociado.menu.plural | Asociados | Socios | Asociados |
| asociado.accion.crear | Crear asociado | Dar de alta socio | Registrar asociado |
| crm.caso.crear | Nueva gestión | Crear ticket | Iniciar gestión |
| crm.area.campo | Área responsable | Área responsable | Sector responsable |
| socio.cuenta.resumen | Resumen de cuenta | Mi resumen | Mi estado de cuenta |

Para frases completas se propone utilizar textos con variables identificadas en lugar de concatenar palabras que puedan quedar mal redactadas. Por ejemplo, el título de un caso puede utilizar la variable de servicio sin alterar su identidad. Los textos se tratan como contenido, no como código ejecutable o instrucciones.

### 65.7. Caso de uso — CU-DIC-01

**Actor:** administrador de cooperativa u otro usuario con permiso de configuración de lenguaje.

**Situación inicial:** TEN-001 utiliza Socios y TEN-002 utiliza Asociados. Ambos operan sobre el mismo concepto funcional de relación institucional.

1. El administrador de TEN-001 abre el diccionario de su cooperativa.
2. Selecciona el concepto Persona asociada y configura Socio como singular y Socios como plural.
3. Revisa las etiquetas relacionadas en el menú, el formulario de alta y el canal del socio; ajusta los textos contextuales habilitados.
4. Aplica la configuración mediante el circuito que se defina y el sistema registra autor, fecha, versión y valores anteriores y posteriores.
5. Las pantallas de TEN-001 muestran el vocabulario configurado; TEN-002 conserva Asociados.
6. Una consulta de API conserva sus nombres de campos y permisos aunque haya cambiado el texto del menú.

**Resultado:** vocabulario propio por tenant y coherencia funcional. **Excepciones:** si falta un texto personalizado se usa el base; si se intenta renombrar una suspensión como baja definitiva, debe revisarse la ambigüedad sin modificar la operación real.

### 65.8. Consideraciones obligatorias para arquitectura y desarrollo

- Diseñar desde el inicio cómo se identifican, resuelven y distribuyen los textos del catálogo por tenant.
- Separar claves y conceptos internos de su presentación visible.
- Aplicar correctamente el contexto de tenant, incluso en cachés, renderizado, tareas y comunicaciones.
- Conservar un mecanismo de respaldo de textos base y detectar claves faltantes en nuevas funciones.
- Garantizar que actualizar o agregar pantallas no borre las personalizaciones existentes.
- Evitar reemplazos globales de cadenas sobre contenido libre: personalizar un label no debe reescribir mensajes, documentos o noticias históricas.
- Definir qué documentos, reportes, exportaciones y plantillas de comunicación utilizan el diccionario y qué versión conservarán.
- Mantener compatibilidad de APIs y formatos de BI: los nombres visibles pueden viajar como metadatos separados.
- Permitir a soporte y auditoría identificar el concepto mediante su clave estable aunque la etiqueta visible sea diferente.
- Si el bot o la IA utiliza el diccionario del tenant, conservar la relación con conceptos canónicos y no interpretar la terminología como instrucciones que alteren permisos o reglas.

### 65.9. Decisiones pendientes

- [ ] Inventario inicial de conceptos y etiquetas editables, con descripción de significado.
- [ ] Alcance por canal y tratamiento de nombres de servicios/planes frente a etiquetas de UI.
- [ ] Permisos de edición, aprobación, publicación y reversión.
- [ ] Reglas de singular/plural, variables, contexto, límites de longitud y accesibilidad.
- [ ] Textos protegidos y leyendas no editables por el tenant.
- [ ] Aplicación del diccionario a reportes, comunicaciones y documentos, preservando historia.
- [ ] Comportamiento al actualizar el producto o incorporar nuevas etiquetas.
- [ ] Posibles plantillas, copia e importación/exportación de diccionarios.

Este requisito se considera de base para el desarrollo y la arquitectura, no una mejora opcional posterior a la construcción de la interfaz.

## 66. Catálogo de servicios propios y habilitación por cooperativa

### Objetivo y requisito informado

La plataforma debe disponer de servicios/capacidades propias para ofrecer a cooperativas y permitir encender o apagar su disponibilidad por tenant. Cada cooperativa tiene su propio conjunto de prestaciones habilitadas para su comunidad de usuarios.

| ID | Requisito | Efecto |
|---|---|---|
| CAT-001 | Servicios/capacidades habilitables por tenant | Cada cooperativa puede disponer de un conjunto diferente. |
| CAT-002 | Configurar disponibilidad para su comunidad | Landing y aplicaciones presentan la oferta correspondiente. |
| CAT-003 | Incluir Cementerio parque | Se incorpora al catálogo como servicio a desarrollar/relevar. |

### Límite y distinciones

Se diferencian tres niveles: **capacidad de plataforma** para gestionar un servicio; **servicio habilitado/ofertado por el tenant**; **contrato de ese servicio para una persona**. Encender Agua para una cooperativa no contrata agua a todos sus usuarios. Deshabilitar una oferta no equivale a dar de baja todos los contratos del tenant.

El requisito no decide si cada capacidad será un microservicio, módulo interno o producto separado; esa decisión corresponde a la revisión de arquitectura. Tampoco implica que apagar una oferta borre historia o elimine obligaciones pendientes.

### Alcance funcional propuesto

- Mantener catálogo global con código, descripción, estado y capacidades asociadas.
- Registrar qué servicios se habilitan en cada tenant, con fechas y configuración propia e independiente.
- Copiar la configuración de un servicio entre tenants autorizados como base para el destino, sin copiar datos operativos ni crear una vinculación de cambios automática; ver sección 81.
- Determinar quién autoriza la habilitación en plataforma y quién administra la oferta dentro del tenant.
- Configurar planes, precios/reglas, requisitos, cobertura y canales por prestación.
- Reflejar la selección en landing, contratación, apps y pantallas de administración según perfiles.
- Definir por separado disponibilidad para nuevas contrataciones y operación de contratos existentes.
- Al retirar una oferta, gestionar el efecto expresamente: no borrar contratos, documentos, deuda o casos.
- Auditar toda habilitación, deshabilitación y modificación de alcance.

### Datos y caso de uso — CU-CAT-01

| Servicio | TEN-001 — Cooperativa A | TEN-002 — Cooperativa B |
|---|---|---|
| Agua | Habilitado | No habilitado |
| Electricidad | Habilitado | Habilitado |
| Gas | No habilitado | Habilitado |
| Cementerio parque | Habilitado | No habilitado |

Un usuario de la comunidad de A consulta esas tres prestaciones y puede iniciar sus solicitudes. Un usuario de B encuentra Electricidad y Gas. Si se retira Agua de nuevas contrataciones en A, el administrador debe especificar ese alcance; los contratos activos no desaparecen.

**Cementerio parque:** se registra como prestación distinta de los servicios sociales. Modalidades de contratación, unidades, titularidad, beneficiarios/derechos, plazos, disponibilidad y reglas de cobro/baja se relevarán; no se inventa una equivalencia con consumo medido o cobertura de sepelio.

## 67. Registro sencillo y contratación por cualquier persona

### Objetivo

Permitir que cualquier persona se registre como usuario de forma sencilla, conozca los servicios que ofrece una cooperativa y pueda iniciar su contratación, sin exigir que ya exista como socio o tenga contratos previos.

### Requisito y límite

**REG-001:** alta pública sencilla de usuario y contratación de servicios disponibles. El registro crea una identidad de acceso; no aprueba automáticamente asociación, representación de terceros, factibilidad técnica, condición fiscal ni activación del servicio. Los requisitos se completan en la etapa correspondiente.

### Alcance propuesto

- Ofrecer registro desde el contexto de una cooperativa o un punto de entrada que permita elegirla.
- Recabar datos mínimos de acceso y verificar el medio/identidad según el flujo seguro elegido.
- Admitir los mecanismos de identidad definidos, incluido Google cuando corresponda.
- Mostrar únicamente la oferta de la cooperativa seleccionada.
- Permitir iniciar contratación, completar información y aportar requisitos del servicio.
- Vincular de forma verificada una relación de socio preexistente, sin crear duplicados ni conceder acceso por coincidencia de nombre.
- Aplicar el circuito comercial, de asociación si corresponde, visitas, instalación y alta efectiva.
- Mantener seguimiento en el CRM y distinguir registrada, solicitada, aprobada e instalada.

La elección de identidad global con vínculos a varios tenants o cuentas separadas sigue pendiente. El registro abierto no habilita crear administradores ni ver información de otros usuarios. Pedir CUIT para una emisión que lo requiera no implica exigirlo a toda persona antes de que pueda registrarse.

### Caso de uso — CU-REG-01

Una persona nueva entra a la landing de B, se registra por el mecanismo habilitado y elige Gas. Completa la solicitud y los requisitos correspondientes. Si necesita asociarse, el circuito lo informa y registra; la sesión de usuario ya existe. Puede seguir su solicitud antes de contar con un suministro activo.

**Precarga ficticia:** USR-NUEVO-B; correo nuevo-b@example.com; tenant TEN-002; servicio GAS; estado Usuario registrado y Solicitud en trámite. La cuenta de gas se asigna cuando corresponda; no se inventa durante el registro.

## 68. Cuentas separadas o unificadas, mínimo de pago y mora configurable

### Objetivo y requisito recibido

Mantener la facturación separada por servicio y permitir que cada tenant elija cuentas corrientes separadas o una cuenta unificada del socio. La configuración debe cubrir reglas de pago mínimo, mora y posibles efectos en servicios, junto con reactivación con o sin costo cuando corresponda.

| ID | Requisito informado | Alcance |
|---|---|---|
| CTA-001 | Cuentas separadas por servicio o unificadas | Política elegida por el tenant, conservando documentos por servicio. |
| CTA-002 | Mínimo/política de pago configurable | Determinar obligaciones y umbrales sin fijar un valor universal. |
| CTA-003 | Efectos de incumplimiento en una cuenta unificada | Evaluar suspensión de los servicios afectados según política y habilitación normativa. |
| CTA-004 | Reactivación configurable con o sin costo | Reglas por servicio, causa y condiciones permitidas. |

### Límite normativo y precisión de la solicitud

El solicitante describe una política deseada en la que incumplir el mínimo de una cuenta unificada puede afectar todos los servicios. Se registra esa necesidad como **capacidad de política a evaluar**, no como autorización general de cortar todos los servicios por cualquier deuda.

La cuenta unificada es una agrupación comercial/contable; cada prestación conserva sus obligaciones y protecciones. Antes de afectar un servicio debe existir fundamento válido para ese servicio, jurisdicción, motivo e instancia de aviso. La sección 70 documenta la revisión de fuentes. La hiperconfigurabilidad se implementa dentro de esas restricciones, no mediante una opción que las omita.

“Se bajan” debe precisarse: una suspensión por mora no extingue necesariamente contratos ni la relación de socio. El estado se cambia solo tras el procedimiento y ejecución real. No se habilita una baja definitiva masiva por el solo saldo agregado.

### Parámetros propuestos

| Grupo | Configuración a definir |
|---|---|
| Cuenta | Separada/unificada; socio y contratos incluidos; vigencia de la modalidad. |
| Pago mínimo | Importe, porcentaje, obligaciones exigibles o fórmula; concepto y finalidad explícitos. |
| Saldo elegible | Capital vencido, cargos autorizados, exclusiones, convenios y créditos. |
| Plazos | Vencimientos, gracia, intimación y fecha de evaluación. |
| Imputación | Selección explícita/prioridades; tratamiento por servicio y deuda. |
| Afectación | Servicios elegibles, requisitos y restricciones por prestación; exclusiones/protecciones. |
| Ejecución | Evaluación, aviso, aprobación si corresponde, orden e intervención. |
| Reactivación | Pago o condición necesaria, estado real y costo habilitado o gratuidad. |
| Excepciones | Reclamos, pagos a verificar, situaciones protegidas, acuerdos y autorizaciones. |

No se definió qué significa exactamente mínimo ni si su cumplimiento evita la mora, solo la suspensión o integra un acuerdo. El sistema no debe inferir que pagar un importe mínimo cancela el resto de la deuda.

### Caso de uso — CU-CTA-01

En un escenario ficticio de A, Ana tiene facturas pendientes por agua ARS 13.000, electricidad ARS 20.000 y cementerio parque ARS 7.000. El resumen reúne ARS 40.000. Para simular se propone un umbral interno de ARS 10.000, que no es una norma ni una política comercial aprobada.

1. El sistema evalúa obligaciones, vencimientos y pagos confirmados; si se pagaron ARS 8.000, registra que no se alcanzó el umbral simulado, manteniendo la imputación exacta por factura.
2. Genera una evaluación de mora, no un corte automático de todas las prestaciones.
3. Por cada servicio, verifica fundamento, avisos, restricciones y excepciones. La acción queda permitida, pendiente de revisión o bloqueada, con motivo.
4. Solo para los servicios cuya afectación resulte habilitada se tramitan las acciones y se registra su ejecución efectiva.
5. Un pago posterior se imputa y dispara la evaluación de reactivación correspondiente, con costo habilitado o gratuidad; no duplica cargos ni reactiva físicamente por presunción.

**Resultado:** cuenta unificada con política configurable, detalle de obligaciones y efectos explícitos por servicio. La política solicitada de afectar todos solo puede aplicarse si todos resultan elegibles y sus condiciones han sido validadas; queda deshabilitada como regla universal por defecto.

**Control:** la deuda de cementerio parque no se toma por sí sola como prueba suficiente para interrumpir electricidad o agua. Los casos jurídicos concretos se validarán antes de habilitar una afectación cruzada.

## 69. Ciclos de corte, universos de clientes y facturación batch

### Objetivo

Permitir uno o más ciclos y fechas de corte por servicio y tenant, asociados a universos de clientes, para generar facturas por lotes y dejar identificados los casos con problemas para su corrección y posterior procesamiento.

### Requisitos recibidos

| ID | Requisito | Resultado |
|---|---|---|
| LOT-001 | Una o más fechas de corte por servicio | Varios ciclos para distintos universos de clientes. |
| LOT-002 | Facturación batch | Emisión masiva controlada con resultado individual. |
| LOT-003 | Casos problemáticos claramente marcados | Bandeja de excepciones con motivo y acción requerida. |
| LOT-004 | Validación de datos fiscales, por ejemplo A sin CUIT | Detectar incompatibilidades antes de emitir o según respuesta fiscal. |

### Límite y definiciones

Aquí **corte** significa cierre de medición/período o selección para facturación, no suspensión física por impago. Deben distinguirse fecha de corte del consumo, fin de período facturado, fecha de ejecución del lote, emisión y vencimientos. Se requiere definir cuáles de esas fechas varían por universo.

El universo puede definirse por zona, ruta, grupo, plan u otros criterios acordados. Un lote es una ejecución operativa; no es una única factura que combina todos los clientes ni implica una única transacción fiscal indivisible.

### Configuración y ejemplo

| Tenant | Servicio | Ciclo ficticio | Universo | Corte ilustrativo |
|---|---|---|---|---|
| TEN-001 | Agua | AG-C1 | Grupo Centro | Día 5 de cada mes |
| TEN-001 | Agua | AG-C2 | Grupo Norte | Día 20 de cada mes |
| TEN-001 | Electricidad | ELE-C1 | Universo definido para ese ciclo | Día 10 de cada mes |
| TEN-002 | Gas | GAS-C1 | Grupo residencial | Día 15 de cada mes |

Estas fechas no son condiciones reales. Calendarios, feriados, meses cortos, cambios de grupo y cortes parciales requieren reglas expresas. Los servicios del ejemplo pertenecen al catálogo de cada tenant.

### Alcance funcional propuesto

- Crear ciclos por servicio, tenant y universo, con vigencias y fechas diferenciadas.
- Controlar pertenencia y solapamientos y evitar facturar dos veces una misma obligación/período.
- Preparar una foto identificable de la selección, cantidades y versiones de reglas de la ejecución.
- Prevalidar contrato, período, consumo si aplica, tarifa, situación fiscal y datos requeridos.
- Simular resultados, mostrar alertas y permitir aprobar la emisión según roles.
- Ejecutar procesos de fondo con progreso, métricas, tiempos y recuperación de fallos.
- Aislar errores individuales y continuar con los válidos cuando el fallo no sea sistémico.
- Pausar el proceso si existe un problema global, como credencial fiscal inválida o caída de integración, en lugar de marcar a todos como clientes erróneos.
- Mantener estado y respuesta fiscal por comprobante, incluidos los emitidos con observaciones.
- Registrar número definitivo, autorización y resultado antes de reintentar una emisión incierta.
- Ofrecer bandeja de excepciones con cliente, servicio, período, dato faltante, código/motivo, responsable y acción.
- Permitir subsanar y reprocesar solo los casos pendientes, verificando emisión previa.
- Conservar relación entre el caso original, su corrección, la ejecución nueva y los documentos emitidos.
- Notificar resultados y mantener auditoría del lote y de cada caso.

### Validación fiscal de la factura A

El tipo de comprobante se determina por la condición del emisor y receptor y la normativa aplicable; no por la simple preferencia del usuario. ARCA publica las clases de comprobantes y sus condiciones [LOT-F1] y remite a los datos requeridos por RG 1415 [LOT-F2].

En el ejemplo del solicitante, un caso configurado para factura A sin CUIT se identifica como **No apto para emisión: falta CUIT del receptor** y se deriva a corrección. Una CUIT cargada tampoco basta si la condición fiscal o autorización del emisor es incompatible. No se inventa el dato ni se cambia a B sin validación y trazabilidad.

ARCA también contempla autorizaciones con observaciones y rechazos [LOT-F3]. Por eso la interfaz debe distinguir una prevalidación bloqueada, un rechazo, una emisión autorizada con observaciones y una respuesta incierta: una observación no permite reemitir como si no existiera documento.

### Caso de uso — CU-LOT-01

**Actor:** responsable de facturación del tenant y usuarios que corrigen datos.

Un lote ficticio LOTE-AG-DEMO-001 contiene 100 obligaciones de agua del ciclo AG-C1. En prevalidación, 98 resultan aptas; una solicita A sin CUIT y otra requiere una lectura válida.

1. Mostrar el universo y las dos excepciones, identificadas por cliente y motivo.
2. Emitir las 98 aptas si se aprueba y la integración funciona correctamente.
3. Mantener 2 pendientes, sin marcarlas como facturadas ni perderlas del control.
4. Solicitar la corrección del dato fiscal y de la lectura a sus responsables.
5. Revalidar y emitir las dos pendientes en un procesamiento vinculado, sin volver a emitir las otras 98.

**Resumen esperado del ejemplo:** 100 seleccionadas; 98 emitidas; 2 pendientes de corrección; después de corregir, 100 obligaciones emitidas en total y 0 duplicadas. Si alguna respuesta fiscal llega con observación, el resumen la discrimina dentro de las emitidas.

### Campos ilustrativos de la bandeja de excepciones

| Caso | Problema | Estado | Responsable de ejemplo | Siguiente acción |
|---|---|---|---|---|
| ITEM-099 | Factura A sin CUIT | Bloqueado en prevalidación | Datos de clientes | Completar y validar situación fiscal |
| ITEM-100 | Lectura pendiente de validación | Pendiente técnico | Supervisor de consumos | Aprobar o corregir cantidad |

Los nombres de estados y responsabilidades son propuestas. Deben distinguirse emitidos, emitidos con observación, pendientes, rechazados, inciertos y excluidos con motivo; no ocultar problemas bajo un total de lote completado.

## 70. Precisiones normativas y fuentes de esta ampliación

Investigación oficial consultada el 3 de noviembre de 2026 para no convertir una política deseada en una regla legal general.

- **Facturación separada:** se conserva como requisito funcional. La antigua Resolución INAES 3442/2018 fue dejada sin efecto por la Resolución 582/2020 [CTA-F1]; no debe citarse como fundamento vigente. La Resolución SIyC 267/2024 limita conceptos ajenos al servicio [AR7], pero la validación completa se realiza por prestación y jurisdicción.
- **Suspensión:** la guía oficial de ENRE describe supuestos de suspensión por falta de pago de una factura del servicio y comunicación previa [CTA-F2]. Ese régimen no se extrapola automáticamente a toda cooperativa ni autoriza por sí solo suspender todos los servicios por un saldo unificado. Las condiciones regulatorias locales y protecciones aplicables quedan por relevar.
- **Tipo y estado fiscal:** la información de ARCA sobre clases, datos y autorización de comprobantes respalda que el lote controle condiciones reales y conserve observaciones y resultados individuales [LOT-F1, LOT-F2, LOT-F3].

Fuentes:

- **[CTA-F1] INAES, Resolución 582/2020:** https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-582-2020-341729/texto
- **[CTA-F2] ENRE, supuestos de suspensión del suministro:** https://www.argentina.gob.ar/enre/preguntas-frecuentes/en-que-casos-la-distribuidora-puede-suspender-suministro-electrico
- **[LOT-F1] ARCA, clases de comprobantes:** https://www.arca.gob.ar/facturacion/regimen-general/comprobantes.asp
- **[LOT-F2] ARCA, datos de los comprobantes:** https://www.arca.gob.ar/fe/emision-autorizacion/datos-comprobantes.asp
- **[LOT-F3] ARCA, consideraciones para autorización electrónica:** https://www.arca.gob.ar/fe/emision-autorizacion/consideraciones.asp

## 71. Pendientes específicos de catálogo, cuentas y lotes

- [ ] Definir quién habilita capacidades de plataforma y quién publica servicios del tenant.
- [ ] Precisar el efecto de apagar una capacidad/oferta con contratos vigentes.
- [ ] Relevar el modelo funcional de Cementerio parque.
- [ ] Definir datos mínimos y verificación del registro público y relación con la asociación.
- [ ] Definir el significado de mínimo de pago y su efecto exacto sobre mora y suspensión.
- [ ] Validar por prestación y jurisdicción cualquier afectación cruzada y sus excepciones.
- [ ] Definir costos de reactivación habilitados y condiciones de gratuidad.
- [ ] Precisar fechas de corte de consumo, período, emisión y vencimiento por universo.
- [ ] Definir pertenencia a universos, cambios, solapamientos y calendarios.
- [ ] Acordar responsables, estados y tiempos de corrección de excepciones batch.
- [ ] Definir contingencia por caída fiscal y tratamiento de respuestas inciertas u observadas.

Los requisitos se incorporan con sus ejemplos y límites. Los valores de mínimo, fechas y costos siguen siendo configuraciones a definir y validar, no reglas productivas aprobadas.

## 72. Productos, subservicios y composición económica de cada servicio

### Objetivo y requisito informado

Cada servicio debe manejar productos, planes y conceptos económicos que permitan representar su oferta y facturación completa. En Internet, por ejemplo, no basta un precio mensual: deben contemplarse instalación, abono, bonificaciones por una cantidad de meses, intereses de financiación, subsidios y reglas aplicables.

| ID | Requisito recibido | Efecto |
|---|---|---|
| PRO-001 | Productos y planes dentro de cada servicio | Ofertas distintas de una prestación con componentes propios. |
| PRO-002 | Elementos facturables o subservicios | Instalación, abono y otros cargos o ajustes individualizables. |
| PRO-003 | Bonificación por X meses | Beneficio temporal con inicio, base, duración y finalización. |
| PRO-004 | Financiación, intereses, subsidios y reglas | Condiciones económicas configurables y trazables, dentro de las restricciones aplicables. |

### Límite y modelo conceptual

El término costo puede referirse al importe a cobrar al socio o al costo interno de prestar el servicio. Deben distinguirse para no facturar automáticamente al cliente todo costo operativo. Esta sección confirma la composición comercial facturable solicitada; el detalle de costeo interno se definirá con ERP.

Se propone la relación **servicio → producto/subservicio → plan/oferta → conceptos y reglas → condiciones del contrato**. La jerarquía técnica exacta se decidirá en arquitectura; lo importante es poder identificar qué se ofrece, qué se cobra y por qué. No se crea necesariamente otro servicio de facturación independiente para cada concepto: instalación y abono de Internet conservan su vínculo con Internet. Su documentación concreta se define según operación y tratamiento fiscal, sin mezclarlos con cargos ajenos.

### Alcance funcional propuesto

- Definir productos y subservicios disponibles dentro del servicio de cada tenant.
- Administrar planes, componentes incluidos, opciones y condiciones por versión.
- Distinguir conceptos de una sola vez, recurrentes, por cantidad, por evento, cuotas y ajustes.
- Establecer disparador de cada cargo: aprobación, instalación efectiva, inicio de período u otro hito definido.
- Configurar importes, bases, cantidades, vigencia y tratamiento fiscal/contable por concepto.
- Asociar promociones al contrato con duración y regla de inicio: meses calendario, ciclos facturados u otra definición explícita.
- Determinar compatibilidad y orden de promociones, subsidios y otras excepciones.
- Conservar condiciones contratadas e historia de cambios, sin aplicar silenciosamente una oferta nueva a contratos previos.
- Definir principal financiado, anticipo, cuotas, método y costo financiero; diferenciar capital, intereses y tributos que correspondan.
- Evitar duplicar una instalación cobrada al contado y financiada o sus cuotas en dos módulos.
- Mostrar al socio el detalle de su precio y la finalización de beneficios temporales.
- Simular primer cobro, cobros intermedios y cobro tras el vencimiento de la promoción.

### Ejemplo de composición de Internet — datos ficticios

| Elemento | Configuración de demostración | Disparador y límite |
|---|---|---|
| Servicio | INT — Internet | Habilitado por el tenant |
| Producto | Fibra hogar | Disponibilidad y factibilidad a validar |
| Plan | INT-100 — 100 Mbps | Condiciones del contrato |
| Instalación | ARS 20.000, una sola vez | Se devenga según el hito autorizado; no se repite mensualmente |
| Abono | ARS 30.000 mensuales | Desde la activación efectiva, con reglas de período |
| Promoción | 50 % sobre abono durante 3 ciclos | No descuenta instalación ni equipo salvo regla explícita |
| Financiación alternativa de instalación | 2 cuotas de ARS 11.000 | ARS 10.000 de principal y ARS 1.000 de interés por cuota, solo para ilustrar desglose |
| Subsidio | Sin aplicación por defecto | Exige régimen o beneficio real autorizado; no se inventa por usar Internet |
| Equipo | Módem identificado por serie | Propiedad y modalidad de entrega pendientes de definir |

Todos los importes y condiciones son inventados, sin tributos. El ejemplo de financiación totaliza ARS 20.000 de principal y ARS 2.000 de intereses; no representa una tasa, costo financiero ni oferta válida de mercado. La información y habilitación de una financiación real deberán definirse antes de ofrecerla.

### Caso de uso — CU-PRO-01

El responsable comercial configura Fibra hogar 100 con instalación única, abono y promoción. Al contratar, se guardan sus condiciones y el criterio de duración de la promoción. Si el cliente elige financiar la instalación, se genera un solo cronograma y se anula la alternativa de cobrarla también íntegramente al contado.

El motor simula los ciclos con bonificación y el primer ciclo sin ella. Al cumplirse la duración, el abono vuelve al importe contractual vigente por la regla definida y se puede explicar el cambio. Los ciclos parciales y cambios de plan deben tener un criterio explícito para consumir o no una unidad de promoción.

**Control:** no se trata una bonificación comercial como subsidio estatal ni se cobra al socio un costo de instalación interna sin concepto habilitado. Las condiciones temporales quedan vinculadas con su versión y contrato.

## 73. Instalación integral, equipo, conformidad, encuesta y activación

### Objetivo

Coordinar el recorrido completo de instalación desde la cita hasta la prestación activa, con información al socio, equipo asignado al instalador, constancia de lo realizado, firma/conformidad, movimiento de stock y medición de satisfacción. El inicio efectivo determina la primera liquidación según reglas configurables.

### Requisitos recibidos

| ID | Requisito | Resultado esperado |
|---|---|---|
| INS-001 | Concertar cita | Visita y franja confirmadas con asignación operativa. |
| INS-002 | Mostrar que el instalador está yendo | Estado En camino visible para el socio en la app. |
| INS-003 | Instalar y hacer firmar la instalación | Registro de trabajo y evidencia de conformidad. |
| INS-004 | Descontar módem previamente asignado al instalador | Trazabilidad del equipo y aplicación única de su movimiento de stock. |
| INS-005 | Entregar encuesta y recibir/procesar respuestas | Satisfacción vinculada a la instalación y seguimiento posterior. |
| INS-006 | Lanzar el servicio desde ese día | Fecha efectiva identificada, sin activación por mera agenda. |
| INS-007 | Prorrateo opcional y modalidad adelantada o no | Reglas explícitas para el primer período y siguientes. |

### Límite y responsabilidades

Agenda reserva la visita; la orden técnica coordina ejecución; inventario controla equipo/custodia; contratos registra activación; facturación aplica reglas; CRM conserva atención y seguimiento; encuestas recibe y procesa respuestas. El requisito no obliga a desarrollar una app diferente para cada función.

En camino es un estado de avance, no una exigencia de geolocalización en vivo. La firma capturada acredita la conformidad según el procedimiento que se defina; no se presupone una firma digital certificada ni se confunden ambas. Responder una encuesta es posterior e independiente: no debe bloquear la activación por ausencia de respuesta salvo que se acuerde una condición válida y expresa distinta.

### Flujo operativo propuesto

1. Registrar solicitud y validar requisitos del servicio.
2. Concertar fecha/franja con el socio y asignar instalador o cuadrilla.
3. Reservar y entregar un módem identificado al instalador, registrando su custodia.
4. El instalador informa En camino; la app del socio muestra esa novedad y la cita correspondiente.
5. Registrar llegada e inicio; verificar orden, domicilio y equipo.
6. Instalar, realizar pruebas y registrar resultado, materiales y serie efectiva del equipo.
7. Mostrar el detalle de instalación y capturar firma/conformidad del receptor, con identificación y fecha, o registrar disconformidad/ausencia de firma y seguir el procedimiento definido.
8. Registrar salida o aplicación del equipo desde la custodia del instalador y vincularlo al suministro/contrato.
9. Confirmar el hito de activación y su fecha efectiva mediante el mecanismo técnico/comercial autorizado.
10. Generar el cargo de instalación y el primer abono según reglas de devengamiento, promoción, prorrateo y modalidad.
11. Enviar o disponibilizar la encuesta al asociado, registrar respuesta y procesar resultados.
12. Derivar una insatisfacción que requiera atención al CRM según reglas acordadas, sin eliminar la evidencia de la encuesta.

El orden exacto de firma, revisión supervisora y activación se definirá por servicio. La ausencia de firma, falla de prueba o incidencia debe tener un estado y decisión propios; no se permite marcar todo como realizado para cerrar la agenda.

### Stock y equipo: evitar doble descuento

| Momento | Operación propuesta | Efecto |
|---|---|---|
| Reserva | Asignar equipo a la orden | Reduce disponibilidad, no implica consumo físico |
| Entrega al instalador | Transferir custodia de depósito al instalador | Sale de depósito y queda a cargo del instalador |
| Instalación | Aplicar el equipo a la prestación | Sale de la custodia del instalador y queda vinculado al cliente/contrato |
| Visita fallida | Mantener equipo o devolverlo | No se registra instalado ni se vuelve a descontar |
| Retiro posterior | Registrar devolución/retiro según modalidad | Conserva historia y condición del equipo |

Descontar stock no significa perder la trazabilidad del activo. Si el módem se entrega en comodato/préstamo puede seguir siendo propiedad de la cooperativa; si se vende, el tratamiento es distinto. La modalidad debe definirse y el sistema debe conservarla. No se descuenta nuevamente del depósito central un equipo que ya se transfirió al instalador.

### Firma y conformidad: datos propuestos

Orden y versión del detalle presentado; fecha/hora; instalador; receptor identificado y relación autorizada cuando corresponda; equipo y trabajos; conformidad/disconformidad; imagen o evidencia de firma según mecanismo elegido; observaciones y adjuntos. Una modificación posterior sustantiva no debe sustituir silenciosamente el documento aceptado. El funcionamiento sin conectividad y su sincronización requieren un circuito específico a definir.

### Encuesta de satisfacción: alcance propuesto

- Plantilla por tenant/servicio y evento de instalación, con preguntas y escala configurables.
- Invitación o disponibilidad en la app y otros canales que se acuerden.
- Relación de cada respuesta con visita, orden y servicio autorizado.
- Estados de invitación/entrega, respuesta pendiente y respuesta recibida.
- Procesamiento de puntuaciones y comentarios e indicadores por servicio/área/período.
- Reglas de seguimiento por insatisfacción y vinculación con ticket, si se decide.
- Permisos y tratamiento de respuestas parciales, repetidas o corregidas.

**Ejemplo de precarga:** Pregunta ¿Cómo evaluás la instalación?, escala de 1 a 5 y comentario libre opcional. Un umbral de 1 o 2 para revisión es una propuesta, no una decisión aprobada. El análisis asistido por IA de comentarios puede evaluarse; no se incorpora como requisito confirmado de esta encuesta.

### Activación y facturación: parámetros a definir

| Parámetro | Alternativas o reglas |
|---|---|
| Hito de inicio | Instalación probada y confirmada; no la fecha de reserva |
| Fecha efectiva | Día/hora y zona horaria que se usarán en contrato y cálculo |
| Prorrateo | Con o sin prorrateo, según condiciones habilitadas |
| Base de días | Días reales, criterio comercial autorizado u otro método explícito |
| Inclusión de días | Si se incluye el día de activación y cómo se trata el cierre |
| Modalidad | Anticipada o vencida, con período al que corresponde cada cargo |
| Instalación | Hito, pago contado o cuotas y relación con primera factura |
| Promoción | Aplicación sobre importe prorrateado o base definida; duración y primer ciclo parcial |
| Emisión fiscal | Conforme a reglas de documentación y vencimientos del servicio, no solo a la preferencia comercial |

Anticipada/vencida describe el período comercial que se cobra; no sustituye la regla fiscal de emisión y entrega investigada en la sección 52. Elegir sin prorrateo tampoco significa que pueda cobrarse cualquier período sin condiciones y validación aplicables.

### Caso de uso integrado — CU-INS-01

Ana contrata Internet INT-100 de TEN-001. Tiene cita VIS-DEMO-002 para el 10/11/2026. El módem MOD-DEMO-001 está asignado al instalador EMP-INS-001. Este informa En camino, realiza la visita, instala y prueba el servicio, registra la serie y captura la conformidad de Ana.

La operación confirmada vincula el equipo al contrato, actualiza su custodia y deja el servicio activo el 10/11/2026. Se genera la encuesta ENC-DEMO-001; Ana responde 4/5 y el sistema incorpora el resultado al tablero de satisfacción. Ese resultado no modifica el precio ni la fecha de inicio por sí mismo.

Para explicar el primer cobro se utilizan reglas ficticias: mes calendario, noviembre de 30 días, día de activación incluido, abono ARS 30.000, instalación ARS 20.000 al contado y sin tributos.

| Concepto | Con prorrateo | Sin prorrateo, solo como hipótesis a validar |
|---|---|---|
| Período inicial | Del 10 al 30/11 inclusive: 21 días | Importe del ciclo según condición contractual definida |
| Abono base | 30.000 × 21/30 = ARS 21.000 | ARS 30.000 en esta hipótesis |
| Bonificación opcional 50 % sobre ese abono | −ARS 10.500 | −ARS 15.000 |
| Abono neto con promoción | ARS 10.500 | ARS 15.000 |
| Instalación única | ARS 20.000 | ARS 20.000 |
| Total ilustrativo sin tributos | ARS 30.500 | ARS 35.000 |

Sin promoción, los totales del ejemplo serían ARS 41.000 y ARS 50.000 respectivamente. La instalación no recibe el descuento del abono salvo una regla adicional expresa.

En modalidad anticipada se cobra el período comercial por adelantado según el circuito aplicable; en vencida, una vez transcurrido. Si el ciclo requiere anticipo antes de conocer el día real de instalación, se debe definir el tratamiento y ajuste posterior. No se fija aquí una fecha fiscal universal.

**Controles:** una visita fallida no descuenta definitivamente un equipo como instalado ni inicia el abono. Una sincronización repetida no genera otro cargo, otra instalación ni otra encuesta. Si el equipo efectivo difiere del reservado, se registra y valida la sustitución, sin adjudicar dos equipos por error.

## 74. Pendientes sobre composición comercial e instalación

- [ ] Jerarquía definitiva entre servicio, producto, subservicio y plan.
- [ ] Diferencia entre costo interno y precio al socio; conceptos de cada prestación.
- [ ] Reglas de promociones por meses/ciclos y tratamiento del primer período parcial.
- [ ] Condiciones y desglose de financiación, intereses y tratamiento fiscal aplicables.
- [ ] Asignación, propiedad, custodia, devolución y valorización de equipos.
- [ ] Estados de visita, permisos del instalador y comunicación al socio.
- [ ] Mecanismo de firma/conformidad, contingencias y sincronización sin conexión.
- [ ] Hito exacto que confirma la activación y relación con revisión supervisora.
- [ ] Reglas de prorrateo, base de días, anticipación, vencimientos y ajustes.
- [ ] Plantillas de encuesta, canales, seguimiento y métricas de procesamiento.

La composición económica y el recorrido completo se incorporan como requisitos. Los importes, tiempos, estados, preguntas y reglas de demostración deben validarse antes de convertirse en condiciones de un tenant.

## 75. ERP contable, centros de costos y cuentas corrientes por servicio

### Objetivo y requisito informado

Gestionar integralmente la contabilidad de la cooperativa, incluyendo centros de costos, cuentas contables reales y de simulación, y dar continuidad al circuito de facturación, cobranza y seguimiento de cuentas corrientes de los asociados en todos sus servicios contratados.

Esta sección precisa los módulos existentes de contabilidad, costos, facturación, cobranzas y cuentas corrientes. No propone un segundo registro contable desconectado del ERP ni sustituye la definición de planes y escenarios de la sección 55.

| ID | Requisito informado | Efecto |
|---|---|---|
| CON-001 | Centros de costos | Análisis de costos y resultados por las unidades definidas en cada cooperativa. |
| CON-002 | Cuentas contables reales y de simulación | Separación expresa entre registros de operación y escenarios. |
| CON-003 | Gestión contable integral | Relación de hechos económicos, cuentas, períodos, imputaciones y reportes. |
| CON-004 | Facturar y cobrar servicios | Documentos y pagos integrados con la contabilidad. |
| CON-005 | Seguimiento de cuentas de asociados por servicios | Deuda, cancelaciones y gestiones explicables por persona y prestación, aun con cuenta unificada. |

### Límite y conceptos

**Cuenta contable:** clasificación dentro de un plan, como créditos por servicios, ingresos, bancos o gastos. **Cuenta corriente del asociado:** detalle de obligaciones, pagos e imputaciones comerciales de una persona en la cooperativa. **Centro de costos:** unidad interna de análisis. Un mismo nombre visible no debe confundir estas entidades.

El servicio puede ser una dimensión o coincidir con un centro, pero no se impone esa equivalencia: una cooperativa puede tener centros Agua, Internet y Administración y distribuir costos comunes entre prestaciones. La pertenencia al tenant es obligatoria en todas las dimensiones.

Las cuentas reales pertenecen al plan y ejercicio aplicables a la operación. Las alternativas y movimientos simulados identifican su escenario y no afectan libros, deudas, cobros o resultados reales. Una cuenta alternativa puede reutilizar un código visible; su identidad incluye el plan/versión y ámbito para evitar mezclas.

### Alcance funcional propuesto

**Estructura y períodos:** administrar planes y cuentas jerárquicas, cuentas imputables y agrupadoras, centros de costos y dimensiones; ejercicios, períodos, apertura, bloqueo y cierre con autorizaciones; versiones y vigencias.

**Registración:** generar asientos desde operaciones de los módulos, admitir asientos manuales autorizados y ajustes, conservar soportes y comprobar equilibrio. Configurar reglas por servicio y concepto, y mantener referencia entre operación, documento y asiento. No contabilizar de nuevo un documento porque se reenvía una integración.

**Costos:** registrar imputaciones directas y distribuir costos compartidos con criterios explícitos, como porcentajes, cantidades u otra base aprobada. Conservar importe, base, fecha, regla y destinos. El total distribuido debe igualar al importe asignado, contemplando redondeo; los importes sin asignación deben quedar identificados, no ocultos.

**Reportes:** consultas de asientos, mayores, saldos, balances de comprobación, resultados y análisis por servicio/centro, con corte y universo definidos; informes y cierres conforme al formato y marco que valide el área contable.

**Simulación:** copiar estructuras o seleccionar alternativas; recalcular clasificaciones, distribuciones o hipótesis en escenarios aislados; comparar con el universo real de referencia sin mutarlo. Una simulación no paga, factura ni registra deuda real y sus resultados se identifican como tales.

**Integración comercial:** asociar cada factura al tenant, asociado, servicio y contrato/suministro; registrar la obligación y su tratamiento contable; vincular cada cobro con medio, confirmación e imputación; reflejar pagos parciales, ajustes, créditos y convenios. La agrupación del resumen no añade otra obligación ni otro ingreso.

**Seguimiento:** consultar por asociado y servicio el saldo, composición, vencimientos, antigüedad, pagos, acuerdos, reclamos y acciones de cobranza; admitir vista unificada y detalle. Los permisos financieros/contables y las políticas de mora conservan los límites definidos en las secciones anteriores.

### Conciliaciones y controles

- Explicar el saldo del auxiliar de asociados mediante documentos, créditos y pagos aplicados.
- Conciliar ese auxiliar con las cuentas contables de control y explicar diferencias de corte, estado o clasificación.
- Conciliar caja y banco con fondos recibidos, distinguiendo comisiones y retenciones cuando correspondan.
- Poder recorrer desde un informe hasta asiento, documento y operación de origen, y en sentido inverso.
- Corregir con movimientos trazables y autorizados; no eliminar historia ni modificar un período cerrado sin el circuito definido.
- Distinguir ingreso devengado, costo/gasto y cobro efectivo: un pago parcial no reduce por sí mismo el ingreso registrado por la prestación.

### Caso de uso conciliado — CU-CON-01

Ejercicio ficticio, sin tributos, que muestra dos servicios de TEN-001 contratados por Ana. Las cuentas y la oportunidad de registración reales deberán validarse con el área contable.

| Hecho | Importe ARS | Cuenta corriente de Ana | Efecto contable simplificado |
|---|---|---|---|
| Factura de Agua | 13.000 | Obligación Agua 13.000 | Débito Créditos por servicios; crédito Ingresos Agua |
| Factura de Internet | 25.000 | Obligación Internet 25.000 | Débito Créditos por servicios; crédito Ingresos Internet |
| Cobro confirmado, imputado a Agua | 5.000 | Reduce Agua a 8.000 | Débito Banco/Caja; crédito Créditos por servicios |

**Saldo del asociado:** Agua ARS 8.000 + Internet ARS 25.000 = ARS 33.000. La cuenta contable de control por estas operaciones debe explicar ese importe. Los ingresos del ejemplo suman ARS 38.000 y el cobro ARS 5.000: son magnitudes distintas. La vista unificada muestra ARS 33.000 pendientes, conservando las facturas y sus servicios.

Para mostrar centros de costos se agregan, en un universo ficticio separado y expresamente incluido para este análisis, costos directos de Agua por ARS 6.000, de Internet por ARS 12.000 y costos comunes por ARS 4.000.

| Centro de resultado ilustrativo | Ingresos | Costos directos | Comunes distribuidos | Resultado ARS |
|---|---:|---:|---:|---:|
| Agua | 13.000 | 6.000 | 1.000 | 6.000 |
| Internet | 25.000 | 12.000 | 3.000 | 10.000 |
| Total | 38.000 | 18.000 | 4.000 | 16.000 |

La regla real del ejemplo distribuye comunes 25 % a Agua y 75 % a Internet. El gasto común se registra una vez; la distribución analítica no vuelve a sumarlo como otro gasto. La tabla muestra un resultado parcial sobre el universo definido, no un estado contable completo de la cooperativa.

En **SIM-CON-001** se prueba reparto 50/50: Agua recibe ARS 2.000 de comunes y muestra ARS 5.000 de resultado; Internet recibe ARS 2.000 y muestra ARS 11.000. El total continúa en ARS 16.000, cambia su atribución y no se altera el saldo comercial de Ana, los cobros ni el registro real.

### Ejemplos de precarga

| Entidad | Valor ficticio |
|---|---|
| Tenant | TEN-001 |
| Plan operativo | PC-OPER-01 |
| Cuentas | Créditos por servicios; Ingresos Agua; Ingresos Internet; Banco/Caja; Costos operativos |
| Centros | CC-AG — Agua; CC-INT — Internet; CC-ADM — Administración |
| Regla de distribución | DIST-DEMO-25-75 |
| Escenario alternativo | SIM-CON-001, reparto 50/50 |
| Asociada | ASO-001 — Ana Pérez |
| Saldo del ejemplo | Agua 8.000; Internet 25.000; total ARS 33.000 |

## 76. Definiciones pendientes de contabilidad y costos

- [ ] Estructura real de planes y cuentas, responsables y reglas de contabilización por operación.
- [ ] Centros, jerarquías y dimensiones de cada cooperativa, sin imponer que todos equivalgan a servicios.
- [ ] Qué costos se imputan directamente, cuáles se distribuyen y con qué base y vigencia.
- [ ] Tratamiento de redondeo, importes no asignados y cambios de criterio.
- [ ] Conciliación y cuentas de control de asociados, caja, bancos y obligaciones fiscales.
- [ ] Ejercicios, cierres, aperturas, reaperturas y documentos de soporte.
- [ ] Formatos de libros e informes y marco profesional aplicable a la cooperativa.
- [ ] Datos y reglas que se copian o referencian en simulaciones y controles de separación.
- [ ] Vistas de seguimiento por asociado/servicio, antigüedad y responsabilidades de cobranza.

Esta ampliación confirma que la capacidad contable y analítica forma parte del núcleo ERP requerido, integrada con facturación, cobranzas y cuentas corrientes.

## 77. Catálogo nacional de calles y ubicación del servicio en Google Maps

### Objetivo y requisitos informados

Disponer de un listado de calles con alcance de todo el país y registrar la dirección donde se presta cada servicio con geolocalización y visualización en Google Maps.

| ID | Requisito | Efecto |
|---|---|---|
| GEO-001 | Listado de calles de Argentina | Búsqueda y selección por contexto territorial. |
| GEO-002 | Dirección de prestación georreferenciada | Asociar el domicilio efectivo con una ubicación identificable. |
| GEO-003 | Mapa Google Maps | Mostrar el punto donde se brinda el servicio. |

### Fuentes verificadas y cobertura

Georef publica referencias oficiales de unidades territoriales y calles y recursos de normalización y georreferenciación de direcciones [GEO-F1, GEO-F2]. Su documentación advierte que las coordenadas pueden ser aproximadas o no estar disponibles y que la efectividad varía por región [GEO-F3].

**Consecuencia de diseño:** el alcance nacional es requisito del producto, pero no se presume que una fuente contenga de forma completa y actualizada cada calle o altura. Debe evaluarse cobertura, actualizar catálogos y admitir excepciones, en particular áreas rurales, calles nuevas y domicilios sin numeración. Una dirección no encontrada no es por sí sola una prueba de domicilio inexistente.

Google documenta servicios para convertir direcciones a coordenadas y mostrarlas en mapas. La integración tiene condiciones de uso y facturación propias [GEO-F4]. Georef indica atribución, licencia y límites de uso [GEO-F5]. La elección e integración final debe verificar esos términos, cuotas y costos sin fijar aquí un precio ni presuponer consultas ilimitadas.

### Límite y relación con otros módulos

El domicilio de prestación es distinto del domicilio personal, fiscal o de correspondencia del asociado. Una persona puede tener varios servicios en una ubicación y prestaciones en ubicaciones diferentes.

Geocodificar una dirección no certifica cobertura técnica, existencia del inmueble, titularidad o disponibilidad del servicio. La posición actual del dispositivo tampoco es automáticamente el domicilio contratado. La ubicación del instalador en vivo sigue fuera del requisito confirmado; se mantiene el estado En camino definido previamente.

### Alcance funcional propuesto

- Seleccionar provincia, departamento/municipio y localidad según el catálogo y la estructura aplicable.
- Buscar calles por nombre y contexto; distinguir homónimos y conservar identificación de fuente.
- Registrar altura, piso/unidad, entrecalles, barrio, referencias de acceso y datos rurales pertinentes.
- Conservar texto original y versión normalizada con su procedencia.
- Obtener candidatos de ubicación y mostrar el punto en Google Maps.
- Permitir confirmar o corregir el punto de prestación por un usuario autorizado; registrar fuente, momento y motivo.
- Distinguir punto confirmado, aproximado y pendiente de revisión; no presentar precisión no disponible.
- Mantener historia de cambios y relación con inmueble, contrato, ticket y orden técnica.
- Admitir ubicación por coordenadas o referencias cuando no exista una coincidencia de calle/altura, con revisión correspondiente.
- Manejar caídas o límites de las fuentes sin perder el formulario y dejar pendiente el enriquecimiento geográfico.
- Separar catálogo geográfico compartido de domicilios y datos privados del tenant.
- Controlar acceso al mapa y a exportaciones/API de domicilios por tenant y relación autorizada.

Si se utiliza ubicación del dispositivo para ayudar a marcar el punto, debe pedirse el permiso correspondiente y permitir otra alternativa. La documentación de Google distingue ese acceso a geolocalización del dispositivo y su autorización [GEO-F6].

La persistencia, actualización y reutilización de datos de cada proveedor deben respetar sus condiciones. No se utilizará Google como una descarga indiscriminada de todas las calles del país ni se decidirá guardar cualquier resultado sin revisar la política aplicable.

### Caso de uso — CU-GEO-01

Ana solicita un servicio para un nuevo domicilio. Selecciona Córdoba y su localidad, busca la calle y completa la altura y unidad. El sistema muestra la dirección normalizada y un punto candidato en Google Maps. Ana o un operador autorizado confirma el acceso correcto al inmueble. El contrato y la visita utilizan esa dirección, mientras el domicilio fiscal permanece separado.

Si no aparece la calle de un loteo nuevo, se conserva el texto y las referencias y se permite indicar el punto para revisión. El caso no se completa con otra calle homónima ni con coordenadas inventadas.

**Datos de ejemplo:** DIR-DEMO-001; INM-001; provincia Córdoba; Calle Ejemplo 100, domicilio ficticio; estado Pendiente de georreferenciación. No se proporcionan coordenadas reales para un domicilio inventado.

## 78. Compras y stock por servicio e integración financiera del ERP

### Objetivo y requisitos reafirmados

Las órdenes de compra y el stock deben poder asociarse con los servicios de cada cooperativa. Cuenta corriente, facturas, cobranza y tesorería son componentes integrados del ERP requerido, con trazabilidad comercial, física, financiera y contable.

| ID | Requisito | Módulos relacionados |
|---|---|---|
| OPE-001 | Órdenes de compra vinculadas a servicios | Compras, proveedores, operación y centros de costos. |
| OPE-002 | Stock asociado a servicios | Depósitos, equipos, reservas, consumos y devoluciones. |
| OPE-003 | Cuenta corriente y facturas | Obligaciones por asociado y servicio; agrupación opcional. |
| OPE-004 | Cobranza y tesorería | Recepción, imputación, rendición, fondos y conciliación. |

### Compras y stock: alcance y límite

- Un requerimiento puede originarse en una necesidad de servicio, reposición o intervención concreta.
- La orden de compra debe permitir identificar servicio y destino por línea o distribución, además de proveedor, artículos, cantidades y condiciones.
- Si una compra abastece varios servicios, conservar una única operación y asignaciones explícitas; no duplicar el total para cada servicio.
- Un artículo puede utilizarse en más de un servicio. Su asociación comercial/operativa no duplica su existencia física.
- Distinguir stock disponible, reservado, entregado a instalador, aplicado/consumido y devuelto.
- Vincular recepción y factura de proveedor con la compra; las entregas parciales no completan automáticamente el pedido.
- Relacionar consumo con servicio, contrato u orden técnica y centro de costos cuando corresponda.
- Conciliar cantidades, series, valor, destino e imputación contable.

Servicio no equivale necesariamente a depósito o centro de costos. La compra autoriza un pedido; recepción confirma una entrega; factura registra la obligación; tesorería paga. Son hitos distintos.

### Circuito financiero integrado

| Etapa | Responsabilidad | Evidencia de continuidad |
|---|---|---|
| Facturación | Emitir cada servicio según sus reglas | Documento, contrato, asociado y servicio |
| Cuenta corriente | Registrar obligación, saldo y vencimiento | Documento y movimientos del auxiliar |
| Cobranza | Registrar y confirmar el pago | Recibo/transacción y medio |
| Imputación | Aplicar pago a obligaciones | Importe cancelado por factura/servicio |
| Tesorería | Controlar caja, banco y valores | Movimiento de fondos, rendición/acreditación |
| Contabilidad | Registrar efecto económico y conciliar | Asiento y cuentas de control |

Cuenta corriente unificada no fusiona las facturas ni convierte el resumen en otra deuda. Cobro confirmado y acreditación bancaria pueden tener momentos diferentes; los cargos y retenciones se explican sin reducir indebidamente lo cancelado por el asociado.

### Caso de uso — CU-OPE-01

TEN-001 compra dos módems para Internet mediante OC-DEMO-002: cantidad 2, precio ficticio ARS 20.000 por unidad, total ARS 40.000 sin tributos. Se reciben y registran las series. Un equipo se asigna a un instalador y se aplica a una orden de Internet; el otro permanece disponible. No se reduce dos veces la existencia al entregarlo y luego instalarlo.

La factura del proveedor y el pago de la compra siguen el circuito de cuentas a pagar y tesorería. Por separado, la factura de Internet del asociado sigue su cuenta corriente, cobranza e imputación. El costo de adquirir el módem no se transforma automáticamente en un cargo al socio: su cobro o entrega en otra modalidad depende de las condiciones del producto.

**Resultado:** compras, existencias y consumo pueden analizarse por servicio y conciliarse con obligaciones y fondos. Este circuito desarrolla las secciones 19, 20, 21 y 75 sin crear módulos paralelos.

## 79. Fuentes geográficas y de mapas

Consultadas el 3 de noviembre de 2026. Respaldan las capacidades de fuentes y proveedores; su cobertura, condiciones e integración se validarán al implementar.

- **[GEO-F1] Georef, descripción oficial:** https://www.argentina.gob.ar/georef
- **[GEO-F2] Georef, recurso de calles:** https://datosgobar.github.io/georef-ar-api/referencia/operations/calles/get/
- **[GEO-F3] Georef, normalización y precisión:** https://datosgobar.github.io/georef-ar-api/addresses/
- **[GEO-F4] Google Maps, geocodificación:** https://developers.google.com/maps/documentation/javascript/geocoding
- **[GEO-F5] Georef, condiciones y licencia:** https://www.argentina.gob.ar/georef/condiciones-de-uso-y-licencia
- **[GEO-F6] Google Maps, geolocalización del dispositivo:** https://developers.google.com/maps/documentation/javascript/geolocation

## 80. Pendientes de geografía y compras por servicio

- [ ] Seleccionar fuentes y evaluar cobertura nacional, actualización y faltantes.
- [ ] Definir búsqueda de calles, normalización, confirmación del punto y excepciones rurales.
- [ ] Verificar condiciones de uso, persistencia, cuotas, credenciales y costos de Google Maps y fuentes geográficas.
- [ ] Definir qué canales y roles visualizan o editan el domicilio y mapa de prestación.
- [ ] Definir relación entre inmueble, dirección, punto de acceso y varios contratos.
- [ ] Definir asociación de líneas de compra/artículos y consumos con servicios, órdenes y centros de costos.
- [ ] Validar asignación de compras y artículos compartidos sin duplicar importes ni cantidades.
- [ ] Precisar reportes de conciliación entre cuentas corrientes, facturación, cobranza, tesorería y contabilidad.

La integración geográfica y los vínculos entre operación y ERP se incorporan como requisitos del producto; los catálogos y servicios externos no se consideran ya descargados o integrados por haberlos documentado.

## 81. Configuración independiente y copia de servicios entre tenants

### Objetivo y requisitos informados

Cada cooperativa administra su configuración de cada servicio por separado. Para acelerar un lanzamiento, se podrá tomar la configuración del servicio 1 de la cooperativa A y copiarla al servicio correspondiente de la cooperativa B, que luego lo disponibiliza a usuarios de su comunidad.

| ID | Requisito | Efecto |
|---|---|---|
| COP-001 | Configuración propia por servicio y tenant | Misma capacidad de plataforma con condiciones independientes para cada cooperativa. |
| COP-002 | Copiar configuración entre cooperativas | Reutilizar una base existente sin configurarla completamente desde cero. |
| COP-003 | Lanzar el servicio en el tenant destino | Publicar la oferta habilitada para su comunidad de usuarios. |

### Límite y distinciones

La copia es de **configuración**, no una transferencia de comunidad, operación o secretos. No copia asociados, usuarios, contratos, direcciones de clientes, facturas, deuda, pagos, tickets, respuestas de encuestas, stock físico, series de equipos ni credenciales del origen. Tampoco concede al destino acceso al tenant origen.

La configuración copiada constituye una base independiente: editar el origen después no actualiza el destino, salvo que en el futuro se defina expresamente otro mecanismo de plantillas o sincronización. Esta funcionalidad no presupone copiar bases completas ni duplicar servicios técnicos desplegados.

Copiar y publicar no es lo mismo. El destino debe resolver referencias y condiciones propias antes de poner el servicio a disposición de su comunidad. Publicar una oferta no genera contratos ni cobros automáticamente para todos sus usuarios.

### Alcance funcional propuesto

- Seleccionar tenant, tipo de servicio y versión de configuración de origen y un destino autorizado.
- Determinar si se crea la configuración del servicio en destino o se prepara una nueva versión de una existente; no sobrescribir en silencio.
- Elegir componentes copiables: productos, planes, conceptos facturables, reglas comerciales, formularios, tipos de gestión y plantillas, según el alcance permitido.
- Identificar dependencias y clasificar qué se copia, qué se conserva del destino y qué debe mapearse o configurarse nuevamente.
- Mantener la identidad del tenant destino: marca, diccionario, comunidad y permisos no se sustituyen por los del origen por copiar un servicio.
- Validar diferencias de jurisdicción, tarifas, tributos, beneficios, cobertura, ciclos de facturación y condiciones de contratación.
- Resolver áreas, centros de costos, cuentas contables, depósitos y referencias internas mediante correspondencias del destino, evitando referencias cruzadas al origen.
- Registrar una nueva identidad de configuración, procedencia, versión, componentes elegidos, actor, fecha y resultado de la copia.
- Permitir revisar diferencias, simular y completar datos pendientes antes de habilitar o publicar.
- Auditar copia y lanzamiento y evitar duplicados por reintentos.
- Conservar intactos los contratos y la historia del destino si se prepara una versión nueva.

La habilitación para leer configuración de origen y escribir en destino debe ser explícita. Ser administrador de B no autoriza a copiar información de A sin el permiso correspondiente. Quién opera la copia y qué puede seleccionar se definirá en la matriz de roles.

### Componentes de ejemplo

| Elemento | Tratamiento propuesto |
|---|---|
| Producto Internet Fibra y plan 100 Mbps | Copiable como base, con nueva referencia de configuración en B |
| Cargo de instalación y promoción de 3 ciclos | Copiables si se seleccionan; importes, vigencias y condiciones requieren validación en B |
| Régimen fiscal o subsidio | No presumir aplicabilidad; verificar y configurar para B |
| Área técnica, centro de costos y depósito | Mapear a entidades del destino o dejar pendiente |
| Formulario y plantilla de encuesta | Copiables como definición, sin solicitudes ni respuestas del origen |
| Marca y etiquetas del tenant | Aplicar las de B; no copiar toda la identidad de A por defecto |
| API keys y credenciales fiscales | Excluidas; configurar credenciales propias por el mecanismo seguro |
| Usuarios y contratos | Excluidos; la comunidad de B sigue siendo independiente |

### Caso de uso — CU-COP-01

1. Un operador autorizado selecciona Internet de TEN-001 en su versión aprobada.
2. Elige TEN-002 como destino y selecciona producto, plan, conceptos y formularios que quiere reutilizar.
3. El sistema prepara una configuración independiente e informa dependencias y referencias pendientes.
4. B define sus precios, calendario, área técnica, cuentas, cobertura y condiciones, conservando su marca y lenguaje.
5. Se prueba una contratación y una simulación de primera factura sin crear deuda real.
6. Se habilita y publica Internet para la comunidad de B por el circuito definido.
7. Los usuarios de B pueden consultar y contratar; quienes no lo contraten no reciben un servicio ni una obligación automática.

**Resultado:** B lanza el servicio reutilizando una base funcional, con configuración y operación propias. Si A cambia luego su instalación o promoción, B conserva sus condiciones hasta que decida modificarlas por su propio circuito.

**Datos ilustrativos:** origen TEN-001/INT/versión 1; destino TEN-002/INT/versión 1; ejecución COP-DEMO-001; estado inicial Borrador con dependencias pendientes. La disponibilidad posterior de Internet en B amplía el ejemplo de catálogo previo; no modifica retroactivamente sus escenarios históricos.

## 82. Connectyx como referencia prioritaria del componente de comunidad

### Requisito informado — COM-001

Por la importancia del concepto de comunidad, se requiere **tomar y reutilizar en la mayor medida posible la experiencia, capacidades y componentes de Connectyx** para la nueva solución de cooperativas, evaluando su adecuación funcional y técnica.

### Ubicación del proyecto indicada por el solicitante

Ruta local Windows:

```text
C:\Users\lenovo\Documents\CONNECTYX\connectia
```

La ruta se registra exactamente como fue proporcionada. **Connectyx** identifica la referencia de producto y `connectia` es el nombre de la carpeta en esa ruta. El contenido del proyecto no se ha inspeccionado en este relevamiento; no se afirma haber copiado código ni verificado las capacidades de esa versión.

### Objetivo y límite

Aprovechar una base de comunidad conocida en lugar de definir cada experiencia desde cero. La revisión debe determinar qué reutilizar en interfaces, recorridos, componentes y lógica, conservando las exigencias del producto: SaaS multitenant, autogestión, marca, lenguaje, seguridad y conexión con ERP y CRM.

La instrucción no implica trasladar datos personales, usuarios reales, publicaciones privadas, credenciales ni configuraciones productivas de otra organización. Tampoco obliga a reproducir toda la aplicación ni a asumir que todos los módulos de este documento ya existen en Connectyx.

### Ámbitos prioritarios de revisión

| Ámbito a revisar | Aplicación buscada en cooperativas |
|---|---|
| Experiencia de comunidad | Acceso de socios y empleados a su espacio de cooperativa |
| Muro de noticias y contenidos | Comunicación por tenant y audiencia, vinculada a los requisitos de noticias |
| Marca y navegación | Presentación consistente en canales, con recursos propios del tenant |
| Lenguaje de interfaz | Compatibilidad con el diccionario y etiquetas configurables |
| Formularios e interacción | Experiencias reutilizables para solicitudes y participación |
| Encuestas | Posible reutilización para satisfacción y otras consultas si el proyecto lo permite |
| Notificaciones | Avisos de comunidad y vínculo con gestiones, sin confundirlos con comunicación editorial |
| Usuarios y permisos | Adecuación a plataforma, tenant, roles funcionales y perfiles de pantalla |
| Componentes móviles/web | Reutilización según compatibilidad con el diseño técnico que se apruebe |

La tabla es un programa de revisión, no un inventario confirmado del código disponible. Chat, bot, tickets, servicios y funciones ERP deben contrastarse con sus requisitos propios antes de asumir que pueden resolverse copiando componentes comunitarios.

### Caso de uso de revisión — CU-COM-01

Al definir la interfaz del socio, el equipo revisa el proyecto de la ruta indicada y contrasta el muro y la navegación disponibles con los requisitos de cooperativas. Identifica componentes reutilizables, adaptaciones y faltantes. Una adaptación se prueba en TEN-001 y TEN-002 con marcas, diccionarios y audiencias distintas y sin mezcla de contenido.

**Resultado esperado:** decisión documentada de reutilización y trazabilidad entre cada componente tomado, su origen/versión y el requisito que cubre. Registrar la ruta por sí solo no completa esta revisión ni habilita a declarar el módulo construido.

### Pendientes específicos

- [ ] Revisar el proyecto indicado en el entorno donde se encuentre disponible.
- [ ] Identificar versión, estructura y componentes relevantes de Connectyx.
- [ ] Comparar requisitos de comunidad y UI con las capacidades efectivamente presentes.
- [ ] Definir adaptación a multitenancy, diccionario, marca y roles/perfiles.
- [ ] Determinar qué código se reutiliza, qué se adapta y qué se desarrolla nuevo.
- [ ] Documentar la relación con CRM, contratación, visitas y ERP sin duplicar responsabilidades.
- [ ] Especificar permisos, selección de componentes y validación para la copia de configuración entre tenants.

La referencia a Connectyx y la copia independiente de configuración de servicios quedan incorporadas como requisitos del producto y como puntos explícitos de revisión de arquitectura.

## 83. Titular DNI/CUIT y contratos independientes en un domicilio

### Objetivo y requisitos recibidos

Cada contratación de servicio se asocia con un titular identificado por DNI o CUIT. El tipo de servicio o el inmueble pueden repetirse: en una misma casa pueden existir dos conexiones de Internet de dos hermanos, cada una contratada, facturada y pagada por su titular.

| ID | Requisito | Consecuencia |
|---|---|---|
| TIT-001 | Servicio contratado asociado con DNI o CUIT | Identificación del titular de la obligación y vínculo verificable con su registro. |
| TIT-002 | Múltiples contrataciones del mismo servicio en un domicilio | No usar domicilio + tipo de servicio como clave única de contratación. |
| TIT-003 | Titulares y pagos independientes | No unir cuentas por convivencia, parentesco o ubicación coincidente. |

### Modelo y límites

- El **servicio de catálogo** es la prestación ofrecida; la identificación DNI/CUIT corresponde al **titular del contrato**, no a la definición global del servicio.
- Una persona puede tener muchos contratos; un inmueble puede alojar muchos contratos del mismo servicio. Cada contrato conserva su identificador y recursos de conexión/medición.
- Dos identificaciones verificadas de la misma persona, como DNI y CUIT de una persona humana, pueden relacionarse sin duplicarla; no se presume equivalencia sin validación.
- Titular, socio, usuario de la app, beneficiario, ocupante, propietario, representante y pagador son roles distintos. Un pago de tercero no transfiere automáticamente la titularidad.
- El requisito es DNI o CUIT según tipo de titular y trámite. Si se requieren otros documentos válidos en supuestos específicos, se definirá la excepción sin inventar DNI/CUIT.
- El registro sencillo de usuario puede preceder al contrato. Antes de habilitar la contratación efectiva debe completarse la identificación requerida.
- Compartir un domicilio no autoriza a mostrar facturas ni tickets ajenos, agrupar deuda entre personas ni cortar otra conexión por confundirlas.
- Que el modelo permita múltiples conexiones no garantiza su autorización técnica en cada servicio: acometidas, unidades funcionales y medidores se validan según prestación.

### Caso de uso — CU-TIT-01

| Dato | Hermano A | Hermano B |
|---|---|---|
| Persona ficticia | PER-H-A | PER-H-B |
| Identificación | DNI-A, marcador de ejemplo | DNI-B, marcador de ejemplo |
| Dirección | DIR-CASA-001 | DIR-CASA-001 |
| Servicio | Internet | Internet |
| Contrato | INT-H-A-001 | INT-H-B-001 |
| Conexión/equipo | CON-A / MOD-A | CON-B / MOD-B |
| Facturación y auxiliar | Titular A, sus documentos | Titular B, sus documentos |

Ambos contratan en el mismo domicilio. A paga su factura y B deja la suya pendiente. El sistema conserva ambos estados separados. Si B pide la baja, solo tramita su conexión. La cuenta unificada de A, si existe, agrupa sus propios servicios autorizados y no incorpora los de B por dirección común.

Los marcadores DNI-A y DNI-B no son documentos válidos para pruebas productivas. No se cargan números personales reales en este ejemplo.

## 84. Núcleo común y reglas propias de cada servicio

### Requisito confirmado

Cada servicio tiene reglas comerciales y operativas propias: listas de precios, planes, productos, bonificaciones, descuentos, recargos, intereses, documentos, cuenta corriente particular por prestación y vista general autorizada, solicitud, alta, baja y procesos internos.

La plataforma comparte capacidades de ERP/CRM, pero no debe imponer que Agua, Internet, Electricidad, Gas, Cementerio parque y Banco de sangre tengan el mismo ciclo físico, base económica o significado de baja.

### Perfil de configuración propuesto

| Dimensión | Definición por tenant y servicio |
|---|---|
| Prestador y jurisdicción | Prestación directa, subdistribución, convenio o intermediación administrativa; autoridad y título habilitante. |
| Titularidad | DNI/CUIT, representación, responsables, beneficiarios y cambios de titular. |
| Unidad de prestación | Conexión, suministro, cobertura, parcela o acto, sin equivalencias automáticas. |
| Oferta | Productos, planes, lista/versiones de precios y condiciones contratadas. |
| Cantidad | Medida real/estimada, capacidad, tiempo, unidad o cobertura según corresponda. |
| Excepciones | Beneficios, descuentos, exclusiones, cargos, recargos e intereses con base y vigencia. |
| Facturación | Conceptos permitidos, ciclos, corte, anticipado/vencido, prorrateo y clase fiscal. |
| Cuenta y pago | Auxiliar por contrato/servicio, agrupación autorizada, imputación y conciliación. |
| Ciclo comercial | Solicitud, validación, presupuesto, alta y fecha efectiva. |
| Operación | Visitas, recursos, equipos, registros, evidencia y responsables. |
| Cambios y salida | Cambio de plan/titular, suspensión, reactivación, baja y obligaciones remanentes. |
| Atención | Motivos, urgencias, tiempos, escalamiento y canales regulatorios. |
| Control | Auditoría, reportes específicos, integraciones y restricciones de datos. |

**Regla de arquitectura:** representar diferencias mediante configuraciones y componentes de dominio explícitos. No convertir toda particularidad en texto libre ni forzarla dentro de una fórmula universal P × Q. Compartir una cuenta corriente no elimina las diferencias de sus servicios ni la identificación de cada obligación.

## 85. Investigación: autoridades, Córdoba y vigencia de las fuentes

### Método y alcance

Investigación de fuentes primarias oficiales y de prestadores sobre su propia operación, realizada el 3 de noviembre de 2026. Se utilizan para identificar particularidades y traducirlas en propuestas funcionales. No se cargan cuadros monetarios como vigentes para todos los tenants ni se certifica una implementación regulatoria completa.

La consulta directa de parte del sitio de ERSeP no estuvo disponible. Se utilizaron el texto legal provincial oficial, documentación de EPEC y reglamentos publicados por prestadores, indicando su origen. Deben obtenerse y validar las resoluciones, concesión, anexos y cuadro actualizado de cada cooperativa antes de configurar producción. Un documento publicado hace años puede servir para identificar estructura sin demostrar que no tuvo modificaciones.

### Mapa de responsabilidades

| Servicio | Base verificada y responsabilidad | Consecuencia propuesta |
|---|---|---|
| Electricidad en Córdoba | La Ley 8835 define ERSeP y su competencia provincial; EPEC publica su reglamento de prestadora y una sección de relación comercial con cooperativas [ESP1–ESP3]. | No confundir regulador con prestador ni suministro mayorista a cooperativa con tarifa final al asociado. |
| Agua en Córdoba | La competencia depende del marco provincial/local y de la concesión. La Ley 8835 exceptúa ciertos servicios municipales; el Decreto 529/94 integra el marco hídrico provincial [ESP1, ESP6]. | Registrar titular del servicio, regulador/autoridad tarifaria y ámbito de cada tenant, sin aplicar toda tarifa de Córdoba Capital al interior. |
| Internet y TIC | ENACOM publica reglamento y canales de reclamos de Internet [ESP10–ESP12]. | Motor de atención y documentación con reglas TIC, además del circuito técnico. |
| Gas por redes | El portal oficial identifica al ENReGE como autoridad de funciones federales antes asignadas a ENARGAS/ENRE; la documentación sectorial distingue subdistribución [ESP13–ESP14]. | Mantener organismo/versiones y rol de la cooperativa; no tratar todo Gas como competencia de ERSeP. |
| Cementerio parque | Código Civil y Comercial, reglamento del establecimiento y autoridades/habilitación local [ESP18]. | Dominio de parcelas, derechos y registros, no solo abono. |
| Banco de sangre | Ley de Sangre, autoridades sanitarias y modalidad de convenio/establecimiento [ESP19–ESP21]. | Separar gestión administrativa de cobertura de la operación clínica habilitada. |

La Ley provincial 10739 modifica el contenido permitido de facturas de energía, agua y saneamiento e identifica categorías de cargos, beneficios e impuestos [ESP5]. La parametrización debe analizarla junto con normativa nacional, actos locales y resoluciones específicas; no se habilita cualquier rubro mediante un campo editable.

## 86. Particularidades de Internet

### Base verificada

El reglamento TIC aborda contratación, información, facturación y reclamos. ENACOM informa plazos diferenciados para reclamos técnicos, facturación y otros motivos y requiere identificación de la gestión previa ante el prestador [ESP10–ESP12]. Esto justifica conservar contrato, versiones de condiciones, documentación, número de caso y tiempos por motivo, sin fijar un único plazo para todas las gestiones.

### Objetivo y límite del módulo

Gestionar comercial y operativamente conexiones de Internet y sus productos por tenant. La gestión ERP no reemplaza los sistemas de red: aprovisionamiento, diagnóstico y medición necesitan integración autorizada o registro técnico. Mostrar un estado en la app no configura por sí mismo un equipo de red.

### Alcance funcional propuesto

- Cobertura por zona/domicilio, factibilidad y disponibilidad del recurso de conexión.
- Plan con tecnología, velocidades ofrecidas, condiciones del servicio y versión comercial.
- Contratos independientes por titular y conexión, incluso en un mismo domicilio.
- Producto y conceptos: instalación, abono, equipo en venta/préstamo, adicionales, promociones, financiación y ajustes habilitados.
- Solicitud, presupuesto cuando corresponda, cita, asignación técnica, instalación, prueba, conformidad y activación efectiva.
- Inventario de ONT/módem/router, serie, propiedad y custodia; asignación al contrato y retiro/devolución.
- Identificador de acceso, puerto/recurso y configuración técnica protegida; no exponer secretos de red al catálogo público o API de BI.
- Integración o procedimiento para activar, modificar plan, suspender, reactivar y desconectar; confirmación de cada ejecución.
- Historial de fallas individuales e incidentes de zona; diagnóstico y órdenes vinculadas al ticket.
- Medición de tráfico/uso solo si existe fuente definida; un abono de velocidad no convierte cada GB en un cargo.
- Facturación de períodos, promoción temporal y prorrateo bajo las reglas contratadas; no duplicar instalación y cuotas.
- Gestión de baja, constancias y equipos pendientes sin borrar deuda/devengamiento anterior ni impedir el canal de solicitud exigible.

### Casos y controles

**Alta:** persona nueva → validación de oferta y domicilio → solicitud → visita e instalación → prueba → fecha de activación → primer período de cobro. **Cambio:** registrar nueva oferta, aceptación y fecha efectiva; decidir qué ocurre con promociones y período en curso. **Baja:** recibir la solicitud, conservar constancia, ordenar desactivación y gestionar retiro; no asumir que devolver el router equivale a una baja comercial ya procesada.

**Ejemplo:** dos hermanos con INT-H-A-001 e INT-H-B-001 tienen planes y equipos distintos en DIR-CASA-001. El ticket Sin servicio de A se vincula a CON-A; la baja de B no apaga CON-A. **Indicadores:** altas pendientes, visitas fallidas, conexiones activas, incidentes, cumplimiento de atención, facturación y saldos por contrato.

**Configuración pendiente del tenant:** tecnología y catálogo real, sistemas de red disponibles, reglas de cobertura/capacidad, conceptos/precios aprobados, tiempos y ajustes por interrupción.

## 87. Particularidades de electricidad en Córdoba

### Base verificada

EPEC distingue suministros, puntos de medición, condiciones de conexión y variables de potencia en su reglamento [ESP2]. La documentación comercial para cooperativas y un cuadro histórico identifican una tarifa de abastecimiento a cooperativas [ESP3–ESP4]. Una cooperativa publica además el Reglamento de Suministros aprobado por la RG ERSeP 11/2005; se utiliza como referencia histórica de estructura, pendiente de verificar sus modificaciones [ESP26]. La Ley provincial 10281 establece seguridad eléctrica y la figura del instalador habilitado [ESP7]. Existen regímenes específicos de electrodependencia nacionales y provinciales [ESP8–ESP9].

**Importante:** el cuadro EPEC de septiembre de 2025 utilizado como fuente estructural no se incorpora como precio vigente de noviembre de 2026. El reglamento EPEC no sustituye automáticamente la concesión y reglamento particular del distribuidor cooperativo. Deben revisarse sus anexos y modificaciones con ERSeP.

### Objetivo y límite

Gestionar el suministro eléctrico al asociado y su operación técnica y tarifaria, distinguiéndolo de la energía que compra la cooperativa. No aplicar por defecto a todos los tenants las categorías, factores, importes o requisitos específicos de otra distribuidora.

### Alcance funcional propuesto

- Datos del suministro: titular DNI/CUIT, inmueble, destino/uso, categoría, punto de conexión y características técnicas.
- Tipo de suministro permanente/transitorio u otra clasificación del marco aplicable; vigencia y documentación.
- Potencia solicitada/autorizada, tensión y características de acometida, con evaluación técnica.
- Registro de solicitudes y documentación de aptitud/instalador habilitado cuando corresponda; presupuestos y obras necesarias.
- Equipos con serie, instalación/retiro, lectura inicial/final, multiplicadores y eventos.
- Capturas de energía y, cuando corresponda, potencia/demanda, franjas horarias y energía reactiva como magnitudes distintas. La documentación técnica de EPEC sobre factor de potencia aporta una referencia para evaluar ese concepto; no se toma su umbral como universal para el tenant [ESP27].
- Validación, estimación autorizada, corrección y trazabilidad de lectura versus consumo liquidable.
- Cuadros/versiones y categorías; componentes fijos, energía, demanda/potencia, franjas y otros conceptos habilitados.
- Subsidios y condiciones de protección acreditadas para el suministro, con vigencia, componente y restricciones de corte.
- Cargos, fondos, aportes y tributos solo según habilitación normativa concreta y documento admisible.
- Incidentes de red, cortes programados, calidad, órdenes, materiales y atención prioritaria cuando corresponda.
- Cambio de titular, aumento de potencia, traslado de medición, suspensión, rehabilitación y baja según procedimientos específicos.
- Lectura y liquidación final, tratamiento de medidor y conservación de la deuda de quien corresponda.
- Información y reclamos regulatorios con evidencia y trazabilidad, sin asumir que toda derivación estatal dispone de API.

### Compras y costos versus tarifa al usuario

El ERP debe poder registrar compra de energía, cargos de abastecimiento, red, pérdidas técnicas/analíticas y costos de operación sin convertirlos automáticamente en un recargo del usuario. La tarifa al socio es un objeto aprobado diferente. Esta separación también importa en las simulaciones por centro de costos.

### Caso de uso — CU-ESP-ELE

Un solicitante pide un suministro para un uso declarado. El área técnica evalúa capacidad, documentación y condiciones, instala el equipo autorizado y confirma fecha/lectura inicial. El ciclo toma mediciones, valida y liquida con la versión aplicable. Si existe una condición de electrodependencia acreditada, se procesa su régimen y la prioridad operativa mediante reglas específicas, no un descuento libre sin respaldo.

**Ejemplos de campos, sin valores productivos:** categoría local; tensión; potencia contratada; medidor; kWh; demanda en kW si corresponde; condición de beneficio y vigencia; fecha de aptitud. Los umbrales y tasas se obtienen del marco válido, no de esta ficha.

**Controles:** no equiparar kWh con kW; no aplicar una tarifa mayorista como minorista; no extender un beneficio de una persona a cualquier suministro sin revisar su alcance; no imponer baja definitiva por una evaluación de mora unificada sin verificar el servicio.

## 88. Particularidades de agua potable y saneamiento en Córdoba

### Base verificada

El marco provincial referencia agua y desagües cloacales [ESP6]. Aguas Cordobesas publica modalidades medidas y no medidas y describe diferencias de base de cálculo [ESP15–ESP16]. Una cooperativa del interior publica requisitos propios de conexiones urbanas/rurales, cuadros y tramitación de baja [ESP17]. Aguas Cordobesas también documenta procedimientos de lectura y estimación para su propio régimen [ESP28]. Son fuentes de modalidades reales, no una tarifa común para todos los prestadores.

### Objetivo y límite

Administrar conexiones, medición o bases no medidas, red, atención y obligaciones del usuario bajo el régimen específico del tenant. La extensión de competencia de ERSeP o de una autoridad local debe registrarse según concesión; no se infiere por la sola ubicación en Córdoba.

### Alcance funcional propuesto

- Registrar inmueble, unidad de facturación, parcela/unidad funcional, destino de uso, responsable y punto de servicio.
- Administrar factibilidad, radio servido, extensión de red y condiciones de conexión.
- Distinguir alta de conexión, cambio de titular, subdivisión/unificación y modificación de uso.
- Configurar régimen medido/no medido y conservar cambios con fecha efectiva.
- Para medidos, capturar lecturas en m³, equipos, recambios y factores válidos; controlar pérdidas aparentes/anomalías, estimaciones y posterior regularización.
- Para no medidos, admitir bases o parámetros aprobados —por ejemplo categorías o características del inmueble— sin inventar lecturas.
- Modelar cargo fijo, bloques/franquicias, excedentes y cargos autorizados solo si el régimen local los prevé.
- Separar días del período real de un eventual criterio de normalización del régimen; el método de un prestador no se aplica sin validación a otro.
- Administrar conexiones urbanas/rurales, obras, materiales e inspecciones con presupuestos diferenciados si corresponde.
- Vincular reclamos de falta de agua, presión, pérdidas, calidad y facturación con zona, conexión y responsable.
- Registrar red, válvulas, pozos/bombeo y mantenimiento si forman parte de la operación del tenant.
- Registrar controles de calidad y referencias a resultados/responsables mediante un alcance autorizado; no reemplazar laboratorio ni certificar potabilidad por un dato libre.
- Definir baja/desconexión, disponibilidad de red, cargos remanentes y rehabilitación según marco, sin copiar la suspensión de Internet.
- Si hay cloacas, tratarlas como prestación con relación explícita con agua, base de cálculo y obligaciones propias; no habilitarlas automáticamente por existir agua.

### Caso de uso — CU-ESP-AG

Un cliente de un régimen medido tiene una lectura observada. El sistema deja pendiente su liquidación hasta que se valide una cantidad real o una estimación permitida. Otro cliente de régimen no medido liquida por su regla aprobada sin exigirle un medidor ficticio. Ambos tienen contrato, factura y auxiliar propios y pueden iniciar reclamos sobre sus documentos.

**Ejemplo de configuración:** AG-MED y AG-NOMED son variantes ficticias de régimen. Una franquicia o bloque puede existir en un tenant y no en otro; los precios y cantidades de Aguas Cordobesas no se precargan como universales.

**Controles:** un domicilio con dos contratos no exige necesariamente dos conexiones autorizadas; la decisión técnica/local es explícita. Una baja contractual puede tener efectos distintos sobre la conexión física y la obligación regulatoria del inmueble, que deben relevarse antes de prometer ausencia de cargos futuros.

## 89. Particularidades de gas

### Base verificada

La autoridad federal actual se presenta como ENReGE [ESP13]. La documentación sectorial identifica al subdistribuidor como operador sujeto a autorización [ESP14]. Ecogas publica primera alta con aprobación técnica y documentación de medición con correcciones de volumen [ESP22–ESP23]. La información de derechos del usuario distingue titularidad y facturación [ESP24].

### Objetivo y límite

Gestionar la modalidad de gas realmente ofrecida: distribución/subdistribución por redes, comercialización de otra modalidad o gestión administrativa de un tercero. Gas natural por red, propano por red y gas envasado no se consideran equivalentes. El alcance técnico debe corresponder con la habilitación y responsabilidades de la cooperativa.

### Alcance funcional propuesto

- Registrar prestador/distribuidor de referencia, condición de subdistribución si corresponde, zona y título habilitante.
- Administrar tipo de gas, modalidad, categoría y destino de uso.
- Factibilidad de red, capacidad, proyecto, intervención de matriculado, inspecciones y aprobación de instalaciones antes de habilitar.
- Conservar legajo, formularios y respuestas de la distribuidora/autoridad mediante integración o seguimiento documental autorizado.
- Registrar medidor, lecturas, recambios, cantidad observada, estimaciones y validación.
- Separar volumen medido, factores/correcciones aplicados, cantidad resultante y componente energético cuando corresponda; versionar método y datos de origen.
- Administrar categorías y períodos de referencia, estacionalidad, cuadros y bloques del régimen aplicable.
- Distinguir componentes del precio, subsidios y cargos/tributos aprobados; no copiar la tarifa de electricidad o agua.
- Gestionar reclamos de consumo/facturación e incidentes con prioridad y protocolos de seguridad del prestador.
- Registrar suspensión, inspección de rehabilitación y reconexión efectiva; el pago por sí solo no acredita instalación segura.
- Tramitar cambio de titular y baja con lectura final, documentación, equipos y reglas de deuda correctamente atribuidos.

### Caso de uso — CU-ESP-GAS

Una persona inicia alta de gas. El caso permanece pendiente mientras falta la aprobación técnica exigida. Una vez habilitada la instalación se coloca/activa el medidor y se registra el inicio. El ciclo conserva lectura, correcciones y tarifa utilizadas. Tras una suspensión que requiera revisión técnica, la app informa Rehabilitación en trámite hasta su confirmación; no muestra Activo por recibir un pago.

**Datos de ejemplo:** GAS-RED-DEMO, categoría pendiente de validar, legajo TEC-GAS-001, matriculado referenciado, medidor y factores con fuente. No se fijan coeficientes físicos, umbrales ni tarifas en esta ficha.

**Controles:** el bot recibe y deriva incidentes, pero no sustituye al servicio de emergencia ni decide seguridad de instalaciones. Cambiar el titular no traslada automáticamente toda deuda histórica del inmueble al nuevo contratante; se aplica el régimen correspondiente con evidencia.

## 90. Particularidades de cementerio parque

### Base verificada

Los artículos 2103 a 2113 del Código Civil y Comercial regulan cementerios privados: afectación, reglamento, registros de inhumaciones y titulares, derechos de sepultura y obligaciones. Contemplan administración/mantenimiento y normativa nacional, provincial y municipal de policía mortuoria [ESP18]. Debe verificarse si el establecimiento del tenant encuadra en ese régimen o en otra modalidad de concesión/gestión.

### Objetivo y límite

Gestionar disponibilidad y derechos sobre unidades de sepultura, servicios asociados y obligaciones económicas, conservando registros permanentes. No modelarlo como un suministro medido ni asumir que se libera una parcela ocupada al dejar de pagar una cuota.

### Alcance funcional propuesto

- Identificar establecimiento, habilitación, reglamento/versiones y modalidad jurídica de los derechos comercializados.
- Catálogo físico de sectores, manzanas/filas, parcelas, nichos, urnarios u otras unidades que realmente existan.
- Estados separados de disponibilidad, reserva, derecho adjudicado y ocupación; evitar venta/reserva duplicada.
- Registrar titular identificado, derecho/documentación, responsables, autorizados y cambios con causa y evidencia.
- Separar persona contratante, persona fallecida y quienes pueden autorizar actuaciones.
- Gestionar reserva, contratación, cuotas de adquisición/derecho, mantenimiento y actos adicionales habilitados.
- Mantener listas por tipo de unidad y acto, beneficios y financiación autorizados, sin confundir derecho y abono.
- Registrar inhumaciones, exhumaciones, reducciones y traslados con permisos, identificación, fecha, origen/destino y responsables.
- Tramitar intervenciones y turnos con control documental; no ejecutar físicamente actos solo por una solicitud del portal.
- Conservar historial de ocupaciones y derechos; operaciones de baja/cesión/transferencia requieren reglas y respaldo propios.
- Mantener cuenta detallada por contrato/derecho/acto y relación con el resumen del socio cuando corresponda.
- Gestionar mantenimiento, proveedores y materiales sin tratar los restos humanos como stock comercial.

### Caso de uso — CU-ESP-CEM

Una persona reserva la parcela PAR-DEMO-001, firma el instrumento que corresponda y recibe la obligación por el derecho adquirido y el mantenimiento definido. Después se solicita una inhumación de un beneficiario/fallecido distinto del titular: se validan autorización y documentos, se agenda y registra el acto. Una modificación del pagador no elimina el registro de ocupación ni transfiere el derecho sin trámite.

**Configuraciones ilustrativas:** tipo de unidad Parcela; cargo por derecho, mantenimiento y acto de inhumación, cada uno con tratamiento definido. No se fija monto ni se promete que todo cementerio admite baja o devolución del derecho por un botón.

**Controles:** distinguir cementerio parque, sepelio y subsidio por fallecimiento; un socio puede tener alguno y no los otros. La gestión de mora no autoriza automáticamente cancelar derechos o disponer de restos: requiere revisión jurídica/operativa específica.

## 91. Particularidades de banco de sangre cooperativo

### Base verificada

Cooperativas consultadas describen cobertura mediante convenios con redes/bancos habilitados, para asociados y familiares. Tío Pujio informa un modelo asumido por la cooperativa sin trasladar costo al socio; COOPLA describe adhesión al sistema cooperativo provincial [ESP20–ESP21]. Esto demuestra que no debe suponerse un abono individual obligatorio para toda oferta.

La Ley 22990 regula actividades, habilitación y responsabilidades sanitarias y prohíbe intermediación lucrativa fuera de sus excepciones. También limita el cobro directo al receptor por transfusión/sangre y reserva las prácticas a los ámbitos autorizados [ESP19].

### Objetivo y alcance inicial propuesto

Gestionar **adhesión, cobertura, beneficiarios y solicitudes administrativas por convenio**, como escenario inicial a validar con el tenant. Si una cooperativa opera efectivamente un establecimiento sanitario, se requiere un alcance clínico separado y revisión especializada; el ERP de asociados no se convierte por defecto en sistema de hemoterapia.

- Registrar convenio, prestador/red, ámbito, vigencia y condiciones de atención.
- Distinguir titular contratante, grupo familiar/conviviente, beneficiarios y estado de cobertura a la fecha solicitada.
- Registrar modalidad financiada por cooperativa, aporte/cobertura permitidos o gratuita al socio según convenio, sin precio de venta por unidad de sangre.
- Gestionar altas y bajas del grupo y sus beneficiarios con evidencia de fechas, sin borrar historia de solicitudes previas.
- Recibir una solicitud de cobertura/autorización y canalizarla al prestador responsable, conservando referencia, estado y respuesta.
- Registrar contactos y documentación estrictamente necesaria con acceso restringido; no publicar información de salud en el muro ni BI general.
- Mantener campañas y turnos de donación como coordinación administrativa si se incorporan, sin decidir aptitud clínica por el ERP o bot.
- Registrar rendición, costo del convenio y obligaciones con la red, separados de un supuesto cobro por sangre al paciente.
- Medir solicitudes, tiempos de gestión, costos de convenio y cobertura, sin revelar datos clínicos a roles no autorizados.

### Límites expresos

No generar un inventario de bolsas como si fueran módems. No asignar compatibilidad transfusional ni liberar componentes por reglas comerciales. La disponibilidad clínica y respuesta urgente las determinan los profesionales/prestadores habilitados; el bot o una deuda no pueden resolverlas automáticamente. Tampoco se impone como requisito universal que un familiar aporte donantes por cada prestación sin revisar el marco aplicable.

### Caso de uso — CU-ESP-SAN

Una asociada solicita acreditar cobertura para un integrante registrado de su grupo. El operador autorizado valida convenio y vigencia y tramita la referencia con la red. El sistema registra la respuesta y el seguimiento administrativo. En un tenant cuyo convenio sea financiado íntegramente por la cooperativa, no emite una factura de sangre al paciente; el ERP registra el costo de convenio según corresponda.

**Datos ficticios:** convenio CONV-SAN-DEMO; grupo FAM-DEMO-001; beneficiario BEN-DEMO-001; solicitud SAN-DEM-001; estado En gestión con prestador. No se cargan diagnósticos, grupo sanguíneo ni indicaciones clínicas reales.

## 92. Otros servicios cooperativos y extensiones a relevar

La oferta publicada por cooperativas consultadas incluye también cloacas, telefonía/Internet, televisión y servicios sociales; otra red integra sepelio, subsidio por fallecimiento, traslados y elementos ortopédicos [ESP21, ESP25]. Esta constatación orienta extensibilidad, no confirma que cada tenant vaya a contratar todos esos módulos.

| Prestación candidata | Particularidad funcional propuesta | Aspecto a relevar antes de habilitar |
|---|---|---|
| Cloacas/saneamiento | Conexión, inmueble, red, mantenimiento y posible base relacionada con agua. | Régimen de concesión, cuadro, vínculo de cálculo y obligaciones. |
| Telefonía | Línea/número, plan y consumos si los hay; cambios y baja de línea. | Registro de llamadas, red/proveedor y reglas TIC específicas. |
| TV/cable | Paquete, puntos/equipos, activación y retiro. | Derechos, oferta, aprovisionamiento y tratamiento de adicionales. |
| Sepelio | Cobertura, grupo, prestador, evento y documentación. | Carencias, alcance territorial, exclusiones y coordinación del evento. |
| Subsidio por fallecimiento | Beneficiario, expediente, aprobación y pago. | Fondo/reglamento, requisitos, importe y controles; no es automáticamente seguro. |
| Traslados | Solicitud, origen/destino, agenda, recursos y constancia. | Tipo de traslado y habilitación; no asumir que incluye urgencias médicas. |
| Banco ortopédico | Elementos identificados, préstamo, devolución, limpieza/mantenimiento. | Condiciones de uso y responsabilidad; no es venta de equipo por defecto. |

El catálogo debe distinguir servicio confirmado por el solicitante de candidato investigado. **Confirmados nominalmente:** Electricidad, Banco de sangre, Agua, Gas y Cementerio parque; **Internet** ya integra los requisitos y ejemplos previos. Los demás quedan a validar por tenant.

## 93. Reglas transversales que cada servicio debe concretar

| Dominio | Internet | Electricidad | Agua | Gas | Cementerio parque | Banco de sangre por convenio |
|---|---|---|---|---|---|---|
| Unidad central | Conexión/contrato | Suministro y punto de medición | Conexión/unidad de facturación | Suministro/medidor/modalidad | Derecho/unidad de sepultura | Convenio/grupo/beneficiario |
| Cantidad posible | Abono y uso si está medido | Energía y otras magnitudes habilitadas | m³ o base no medida | Volumen corregido u otra unidad aplicable | Derecho, mantenimiento o acto | Cobertura y gestión administrativa |
| Recurso específico | Equipo y acceso de red | Medidor/acometida | Medidor/red | Legajo y medición | Parcela y registro de ocupación | Prestador sanitario externo |
| Hito de alta | Instalación/activación confirmada | Conexión habilitada | Conexión y condición del régimen | Aprobación técnica/habilitación | Constitución/adjudicación del derecho | Cobertura vigente por convenio |
| Salida | Baja y equipo | Baja/lectura final | Baja y efectos del inmueble | Baja y estado técnico | Transferencia/extinción/actos según régimen | Baja de adhesión/beneficiario |

Cada ficha debe completarse con lista de precios y versión, bonificaciones, descuentos, recargos e intereses habilitados; facturación y auxiliares; flujo de solicitud/alta/cambios/baja; procesos internos; roles/perfiles; formularios; evidencia; reportes y API. Donde un concepto no corresponda, se marca No aplica, en lugar de forzar un cargo o proceso ficticio.

### Nuevos requisitos identificados

| ID | Definición |
|---|---|
| ESP-001 | Mantener reglas y procesos diferenciados por servicio y tenant. |
| ESP-002 | Incluir los seis dominios nominales: Internet, Electricidad, Agua, Gas, Cementerio parque y Banco de sangre. |
| ESP-003 | Concretar en cada dominio productos/precios, beneficios, cargos y ciclo comercial/operativo propios. |
| ESP-004 | Conservar auxiliar por servicio y vista general autorizada sin fusionar titulares por domicilio. |
| ESP-005 | Registrar fuente, jurisdicción y vigencia de cada configuración regulada. |
| ESP-006 | Revisar prestaciones complementarias de cooperativas como extensiones, sin activarlas indiscriminadamente. |

## 94. Fuentes de la investigación por servicios

Consultadas el 3 de noviembre de 2026. Las páginas de prestadores son fuentes primarias de su operación, no normas generales para otras concesiones. Los documentos históricos se usan para identificar estructura y requieren contraste con las resoluciones vigentes de cada tenant.

- **[ESP1] Ley provincial 8835, texto actualizado, ERSeP y competencia:** https://www.argentina.gob.ar/normativa/provincial/ley-8835-123456789-0abc-defg-538-8000ovorpyel/actualizacion
- **[ESP2] EPEC, Reglamento de comercialización, versión publicada con modificaciones hasta 2023:** https://www.epec.com.ar/docs/servicios/regimen-electrico.pdf
- **[ESP3] EPEC, información comercial de cooperativas:** https://epec.com.ar/informacion-comercial/cooperativas
- **[ESP4] EPEC, cuadro histórico de septiembre de 2025, tarifa de cooperativas:** https://www.epec.com.ar/docs/cuadro-tarifario/cuadro-tarifario-publicado-290825-aplicacion-010925.pdf
- **[ESP5] Ley Córdoba 10739, modificación sobre conceptos de facturación:** https://www.argentina.gob.ar/normativa/provincial/ley-10739-123456789-0abc-defg-937-0100ovorpyel/actualizacion
- **[ESP6] Portal nacional, normativa ambiental de Córdoba y marco de agua:** https://www.argentina.gob.ar/ciencia/agencia/normativa-ambiental-cordoba
- **[ESP7] Provincia de Córdoba, Ley 10281 de Seguridad Eléctrica:** https://www.cba.gov.ar/wp-content/4p96humuzp/2015/12/Ley-de-Seguridad-Electrica.pdf
- **[ESP8] Ley nacional 27351, electrodependientes:** https://www.argentina.gob.ar/normativa/nacional/ley-27351-274737/texto
- **[ESP9] Legislatura de Córdoba, programa provincial y Ley 10511:** https://legislaturacba.gob.ar/funcionarios-de-discapacidad-informaron-del-programa-de-electrodependientes/
- **[ESP10] Reglamento de Clientes TIC, Resolución 733/2017, texto actualizado:** https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-733-2017-305484/actualizacion
- **[ESP11] ENACOM, plazos y reclamos por TAD:** https://enacom.gob.ar/como-reclamar-por-tramites-a-distancia_p4019
- **[ESP12] ENACOM, reclamos de Internet:** https://www.enacom.gob.ar/problemas-con-el-servicio---reclamos_p107
- **[ESP13] Portal oficial, qué es el ENReGE:** https://www.argentina.gob.ar/enrege/que-es-el-enrege
- **[ESP14] Portal regulatorio de gas, categorías y subdistribuidor:** https://www.enargas.gob.ar/secciones/precios-y-tarifas/categorias-de-usuarios.php
- **[ESP15] Aguas Cordobesas, régimen medido residencial:** https://www.aguascordobesas.com.ar/PrintContenido/iu/57/regimen-medido-residencial
- **[ESP16] Aguas Cordobesas, servicio no medido:** https://www.aguascordobesas.com.ar/InfoUtil/ver/23/servicio-no-medido
- **[ESP17] Cooperativa de Colonia Caroya y Jesús María, Agua Potable:** https://m.coop5.com.ar/servicios/aguaPotable
- **[ESP18] Código Civil y Comercial, arts. 2103–2113, texto actualizado:** https://www.argentina.gob.ar/normativa/nacional/ley-26994-235975/actualizacion
- **[ESP19] Ley 22990, Ley de Sangre, texto actualizado:** https://www.argentina.gob.ar/normativa/nacional/ley-22990-49103/actualizacion
- **[ESP20] COOPLA, cobertura de banco de sangre:** https://coopla.com.ar/banco-de-sangre/
- **[ESP21] Cooperativa Tío Pujio, Banco de Sangre y catálogo de servicios:** https://www.cooptiopujio.com/servicios/banco-de-sangre/
- **[ESP22] Ecogas, autogestión y primera alta con CTT aprobado:** https://autogestion.ecogas.com.ar/uiextranet/espacio
- **[ESP23] Ecogas, reglamento publicado, medición y corrección de gas:** https://www.ecogas.com.ar/appweb/leo/pub/notas/1406/reglamento_de_servicio-res_i-4313-2017.pdf
- **[ESP24] Portal regulatorio, derechos de usuarios de gas:** https://www.enargas.gob.ar/secciones/derechos-usuarios.php
- **[ESP25] Cooperativa de Colonia Caroya y Jesús María, Red Bienestar Cooperativo:** https://www.coop5.com.ar/servicios/sociales/BienestarCooperativo
- **[ESP26] Cooperativa de Colonia Caroya y Jesús María, publicación del Reglamento ERSeP RG 11/2005:** https://www.coop5.com.ar/servicios/energia/ReglamentoErsep
- **[ESP27] EPEC, información sobre factor de potencia:** https://epec.com.ar/informacion-comercial/grandes-clientes/info_de_interes-factor_de_potencia_o_coseno_fi
- **[ESP28] Aguas Cordobesas, procedimiento de lecturas:** https://chat.aguascordobesas.com.ar/InfoUtil/ver/46/procedimiento-de-lecturas

## 95. Validación pendiente y siguientes insumos por servicio

| Servicio | Documentación prioritaria para convertir la ficha en configuración real |
|---|---|
| Internet | Contrato, ofertas, facturas, equipos, red/proveedor de aprovisionamiento, circuitos y reclamos. |
| Electricidad | Concesión y anexos, reglamento cooperativo actualizado, cuadros ERSeP propios, categorías, medición, beneficios y circuitos técnicos. |
| Agua | Autoridad/título, reglamento y cuadro del tenant, medido/no medido, inmueble/base, conexiones y baja. |
| Gas | Condición de prestador/subdistribuidor, modalidad, cuadros, legajos y convenios con distribuidor, correcciones y rehabilitación. |
| Cementerio parque | Habilitación, reglamento, plano/unidades, instrumentos de derechos, registros y lista de actos/cargos. |
| Banco de sangre | Convenio, red/prestador, cobertura y financiación, responsables, datos mínimos y circuito de autorización. |

- [ ] Validar identificación DNI/CUIT, representación y cuentas de titulares con conexiones múltiples.
- [ ] Obtener los textos y resoluciones ERSeP concretos que no pudieron verificarse directamente y sus modificaciones.
- [ ] Confirmar categorías, importes, tasas, mínimos, vigencias y condiciones de cada cooperativa, sin copiar precios históricos o de otro prestador.
- [ ] Revisar formularios y criterios de altas, bajas, cambios y suspensiones específicos.
- [ ] Definir límites de información sanitaria y si Banco de sangre se limita a cobertura por convenio.
- [ ] Convertir cada ficha en pantallas, eventos, formularios, permisos y criterios de aceptación; vincularla al catálogo de requisitos.

La investigación completa el mapa funcional y las particularidades, pero no reemplaza el relevamiento de la concesión y condiciones vigentes de la cooperativa piloto. Los precios y cálculos ficticios de versiones anteriores se mantienen como demostraciones, no como cuadros oficiales de estos servicios.

## 96. Revisión de coherencia del documento — versión 0.15

### Alcance de la revisión

Se leyó el documento completo, secciones 1 a 95 y anexo, para verificar consistencia interna, contradicciones y faltantes. El resultado general es **coherente**: la visión de producto (SaaS multitenant, ERP + CRM, autogestión, facturación separada por servicio con agrupación opcional, diccionario por tenant, reglas propias por servicio) se mantiene sin contradicciones de fondo entre secciones. Los principios transversales se repiten de forma consistente: solicitar no equivale a ejecutar, el resumen no crea deuda, los cálculos son reproducibles, cada cambio se audita y ningún tenant ve datos de otro.

### Hallazgos de estructura y su tratamiento

| Hallazgo | Tratamiento en 0.15 |
|---|---|
| El documento creció por ampliaciones sucesivas: las secciones 37 (pendientes) y 38 (historial) quedaron en la mitad, y los requisitos de las secciones 42 a 95 complementan a los módulos 3 a 31 sin integrarse en ellos. | Se mantiene la numeración para no romper referencias. Se recomienda, al pasar a especificación, consolidar cada módulo con sus ampliaciones en un único capítulo y mover historial y pendientes al final. |
| La introducción indicaba que no hubo acceso a ninguna instalación, pero el proyecto contiene un relevamiento de una base DEMO de ProCoop. | Se actualizó el propósito y se incorporó su análisis en la sección 97. |
| La sección 32 lista particularidades sin Cementerio parque ni Banco de sangre, que luego son servicios confirmados (ESP-002). | La sección 32 queda como antecedente; las secciones 84 a 93 prevalecen. |
| El catálogo de precarga 39.2 incluía Telefonía y TV, no confirmados, y omitía Cementerio parque y Banco de sangre, confirmados. | Se agregaron CEM y SAN. Telefonía y TV quedan como ejemplos de extensión a validar por tenant. |
| La tabla de entidades (sección 33) no contemplaba conceptos introducidos después: oferta del tenant, titular, ciclo, lote, política de mora, copia, derechos de sepultura, convenio. | Se agregaron esas entidades. |
| Las secciones 25 y 43 hablan de activar y desactivar servicios desde la app; la 48 precisa que la base es solicitar. | Prevalece la sección 48; la ejecución inmediata queda como alternativa por servicio. |
| La afirmación del solicitante de que por ley cada servicio se factura separado (P-014) no tiene fundamento vigente universal (la Resolución INAES 3442/2018 fue dejada sin efecto). | Ya tratado en las secciones 44 y 70: se mantiene como requisito de producto. Sin embargo, el relevamiento DEMO muestra que ProCoop agrupa servicios en un mismo comprobante mediante Grupo Factura; esto impacta la migración (sección 97.10). En la versión 0.17 se admiten ambas modalidades (sección 103). |
| Los requisitos tienen identificadores estables solo cuando fueron informados (MT, MAR, FAC, CRM, etc.); los módulos 3 a 31 no los tienen. | Pendiente de la sección 37: asignar identificadores a todo requisito antes de diseñar pantallas. |
| No hay una priorización de alcance para la primera versión más allá de la sección 35. | Se propone una priorización en la sección 97.12, sujeta a aprobación. |

## 97. Requisitos complementarios identificados en la revisión

Los siguientes temas no estaban cubiertos o lo estaban solo de forma indirecta. Se incorporan como **propuesta para el sistema propio**, no como requisitos informados por el solicitante, y deben validarse con la cooperativa piloto y con asesoramiento legal, fiscal y contable.

### 97.1. Protección de datos personales

**Objetivo:** tratar los datos de socios, empleados y terceros conforme a la Ley 25.326 de Protección de Datos Personales y la normativa de la Agencia de Acceso a la Información Pública (AAIP), autoridad de control.

**Límite:** el principio de que la información de los asociados pertenece a la cooperativa (sección 59) no elimina los derechos de los titulares de los datos. En el modelo SaaS, cada cooperativa es responsable de sus bases y la plataforma actúa como prestadora del tratamiento; ese rol y sus obligaciones deben quedar en el contrato.

**Alcance propuesto:**

- Inventario de datos por entidad con finalidad, base de tratamiento, sensibilidad y plazo de conservación.
- Registro de consentimientos y preferencias, con versión del texto aceptado.
- Procedimiento para los derechos de acceso, rectificación, actualización y supresión, con plazos y evidencia; la supresión se compatibiliza con obligaciones fiscales y contables de conservación.
- Tratamiento reforzado de datos sensibles, en particular salud (Banco de sangre, servicios sociales) y electrodependencia: acceso restringido, sin uso en BI general ni en el muro.
- Minimización en APIs, exportaciones, bot e IA; no enviar datos personales a proveedores de IA sin acuerdo y evaluación previa.
- Registro de bases ante la autoridad cuando corresponda, contrato de encargo con la cooperativa y gestión de subencargados (nube, mensajería, mapas, pagos).
- Procedimiento de incidentes de seguridad con datos personales, notificación a la cooperativa y evidencia.
- Datos de prueba anonimizados o ficticios: nunca copiar datos reales a ambientes de desarrollo o demostración.

**Control:** la copia de servicios entre tenants (sección 81) y la reutilización de Connectyx (sección 82) nunca trasladan datos personales.

### 97.2. Factura electrónica e integración con ARCA

**Objetivo:** emitir comprobantes autorizados por ARCA de forma masiva y resiliente.

**Alcance propuesto, a verificar con la normativa vigente de ARCA:**

- Certificados digitales y autorización del servicio de facturación electrónica por cooperativa, guardados como secretos del tenant y nunca compartidos.
- Puntos de venta por cooperativa, servicio o canal, con numeración correlativa controlada por el sistema fiscal.
- Autorización por comprobante (CAE) y modalidad anticipada (CAEA) para lotes grandes o contingencia, con su posterior informe dentro de los plazos aplicables.
- Consulta del último comprobante autorizado antes de reintentar, para no duplicar ni saltear numeración.
- Códigos o validaciones provinciales cuando la jurisdicción lo exija (el relevamiento DEMO muestra un Código de Validación Provincial).
- Notas de crédito y débito asociadas al comprobante original.
- Representación impresa con los datos exigidos, código QR fiscal cuando corresponda y envío digital al socio.

**Relación:** completa las secciones 10, 52, 61 y 69. El lote no se marca emitido sin autorización fiscal confirmada.

### 97.3. Vencimientos múltiples, recargos e intereses

El relevamiento DEMO muestra comprobantes con hasta cuatro vencimientos y un total con recargo para cada uno, y una tabla de "Tramas de vencimientos". El documento solo mencionaba recargos por mora como concepto deshabilitado.

**Alcance propuesto:**

- Configurar por servicio y ciclo una trama de vencimientos: cantidad, separación entre fechas y recargo de cada una.
- Calcular el importe a pagar según la fecha efectiva del pago, con base, tasa y tope aprobados.
- Distinguir recargo por pago fuera de término, interés por mora sobre deuda vencida e interés de financiación (secciones 14, 23 y 72).
- Facturar los intereses devengados en un documento posterior cuando así lo exija el régimen fiscal, sin modificar la factura original.
- Exhibir en la factura y en la app el importe correspondiente a cada vencimiento.

**Control:** la tasa y el método requieren respaldo; no se precarga una tasa productiva.

### 97.4. Conceptos por cuenta y orden de terceros

En Argentina es habitual que las cooperativas cobren en su factura tasas municipales, de alumbrado público u otros fondos por convenio. El relevamiento DEMO lo confirma (Tasa Alumbrado Público, Tasa Hospital Municipal, entre otras). La sección 52 restringe conceptos ajenos al servicio; por eso este tema requiere un tratamiento explícito.

**Alcance propuesto:**

- Registrar convenios con el organismo beneficiario, fundamento normativo, vigencia, base, alícuota y servicio en que puede incluirse.
- Separar en el comprobante el cargo propio del concepto de terceros, según la exhibición exigida.
- Registrar el pasivo con el tercero y no como ingreso propio.
- Rendir periódicamente lo cobrado, con reporte, pago desde tesorería y conciliación.
- Definir el tratamiento de pagos parciales: qué parte se imputa al tercero.
- Habilitar un concepto de terceros solo con convenio y fundamento cargados; sin ellos, el motor lo bloquea.

### 97.5. Energía prepaga y telemedición

El relevamiento DEMO muestra una modalidad prepaga de energía y un módulo de telemedición.

- **Prepago:** compra de crédito, saldo disponible, consumo descontado, avisos de saldo bajo y tratamiento fiscal de la compra. Es una modalidad distinta del ciclo pospago y se configura por servicio y contrato.
- **Telemedición:** importar lecturas de medidores remotos o lectores portátiles en forma masiva, con validación, origen identificado y sin duplicar las lecturas manuales (secciones 8 y 9).
- **Corte y reconexión remota:** si el equipo lo permite, se ejecuta solo tras el circuito de la sección 68, con confirmación del resultado.

### 97.6. Canales de cobro del mercado argentino

La sección 39.4 enumera medios de pago genéricos. Se proponen además, sujetos a contratación con cada proveedor:

- Código de pago electrónico para redes de pago de servicios y homebanking, y código de barras para entidades recaudadoras presenciales.
- Débito automático por CBU o tarjeta, con adhesión, baja y rechazos.
- QR interoperable y transferencias, con conciliación por referencia única.
- Archivos de rendición por entidad, con conciliación de bruto, comisión y neto (sección 13).

### 97.7. Capital social y aportes cooperativos

Las cooperativas pueden registrar aportes de capital de sus asociados, en algunos casos cobrados junto con los servicios. La sección 27 los menciona de forma general.

- Registrar cuotas sociales, suscripción, integración y saldo de capital por asociado.
- Distinguir el aporte de capital del precio del servicio, en el documento, la cuenta corriente y la contabilidad.
- Habilitar su cobro junto con servicios solo si la cooperativa y la normativa aplicable lo admiten, con exhibición diferenciada.
- Contemplar reembolso de capital ante la baja del asociado según estatuto.

### 97.8. Requisitos no funcionales

El documento define controles de seguridad pero no metas de servicio. Se proponen como dimensiones a fijar en el acuerdo con cada cooperativa, sin cifras comprometidas todavía:

| Dimensión | Qué debe definirse |
|---|---|
| Volumen | Contratos por tenant y tenants totales. El relevamiento DEMO muestra unos 12.500 comprobantes en una semana de facturación masiva de una sola cooperativa. |
| Rendimiento | Tiempo máximo de un lote de facturación, de una consulta del socio y de la emisión fiscal. |
| Disponibilidad | Objetivo de disponibilidad mensual y ventanas de mantenimiento. |
| Recuperación | Pérdida de datos tolerable y tiempo de restauración, con pruebas periódicas. |
| Aislamiento de carga | Un lote o una API de BI de un tenant no degrada a otros. |
| Conectividad | Funcionamiento sin conexión de las apps de lectura y técnica. |
| Accesibilidad | Nivel de accesibilidad de landing y app de socios, usable en celulares de gama baja. |
| Observabilidad | Registros, métricas y alertas técnicas por tenant y proceso. |
| Conservación | Plazos de retención de comprobantes, auditoría y datos personales según normativa. |

### 97.9. Ambientes, configuración y pruebas por tenant

- Ambientes separados de desarrollo, pruebas y producción; la precarga de demostración no existe en producción.
- Posibilidad de que una cooperativa pruebe una configuración nueva (tarifa, ciclo, regla) en un entorno de prueba o simulación antes de publicarla.
- Versionado de la configuración con fecha de vigencia, aprobación y reversión.

### 97.10. Migración desde ProCoop

La sección 31 trata la migración en forma genérica. Dado que ProCoop es el competidor de referencia y el sistema de origen más probable, se propone un plan específico basado en el relevamiento DEMO:

| ProCoop | Modelo propio | Consideración |
|---|---|---|
| Persona | Persona | Detección de duplicados y normalización de DNI/CUIT. |
| Titular (N° titular, NIP) | Titular del contrato y, si corresponde, asociado | El NIP se conserva como identificador externo. |
| Cuenta (domicilio, condición IVA) | Inmueble, dirección de prestación y datos fiscales | La condición fiscal pasa a la persona o al contrato según corresponda. |
| Grupo Factura | Política de agrupación de cuenta corriente | ProCoop emite varios servicios en un comprobante. Desde la versión 0.17 se migra a un grupo de facturación equivalente (FAC-012, sección 103), con validación fiscal antes de migrar. |
| Servicio (tipo, medidor, estado, categoría) | Contrato, equipo e instalación, categoría tarifaria | Estados a mapear al catálogo de la sección 39.5. |
| Zona, sector, recorrido | Rutas de lectura | Conservan el orden de lectura. |
| Cuadros tarifarios versionados por vigencia | Versiones de tarifa | Se migran los vigentes y los necesarios para reproducir períodos abiertos. |
| Observaciones con bloqueo | Observaciones y bloqueos operativos | El bloqueo debe tener efecto explícito. |
| Comprobantes y deuda | Documentos abiertos y saldos iniciales | Conciliación de saldo por titular y servicio antes del corte definitivo. |

**Requisitos de la migración:** extracción de solo lectura, ensayos repetibles, reportes de diferencias, corte con período de convivencia definido y aprobación de la cooperativa sobre saldos iniciales.

### 97.11. Comercialización de la plataforma

La sección 64 deja pendiente cómo se factura el SaaS a las cooperativas. Se propone que la plataforma registre el plan contratado por tenant, las capacidades habilitadas, los límites de uso y la facturación propia de la plataforma, separada de la facturación que cada cooperativa hace a sus socios.

### 97.12. Priorización propuesta para la primera versión

Complementa la sección 35. Es una propuesta sujeta a aprobación.

| Prioridad | Alcance |
|---|---|
| Base desde el día uno | Multitenancy, identidad con 2FA, roles y perfiles, auditoría de cambios, diccionario y marca por tenant, catálogo de servicios habilitables. |
| Primer ciclo completo | Un servicio piloto: personas, titular DNI/CUIT, contrato, tarifa versionada, ciclo y lote de facturación con factura electrónica ARCA, cuenta corriente, cobro presencial y un canal digital, conciliación. |
| Canal del socio | Registro sencillo, landing, app de socios con facturas, pagos, solicitud de alta y baja con botón de baja, reclamos con ticket. |
| Operación | CRM con bandeja de supervisión, órdenes técnicas, agenda de visitas, stock de equipos. |
| Administración | Contabilidad con plan de cuentas y centros de costos, tesorería, compras, módulo fiscal de retenciones. |
| Extensiones | Resto de servicios, simulaciones contables, APIs de BI, copia de servicios, comunidad, IA. |

## 98. Pendientes de la revisión 0.15

- [ ] Confirmar el rol de la plataforma frente a la Ley 25.326 y redactar el modelo de contrato de encargo con cada cooperativa.
- [ ] Definir plazos de conservación de comprobantes, auditoría y datos personales.
- [ ] Verificar con ARCA el esquema de autorización (CAE, CAEA), puntos de venta y contingencia para facturación masiva.
- [ ] Relevar tramas de vencimientos, recargos e intereses aplicables a la cooperativa piloto.
- [ ] Relevar convenios de cobro por cuenta de terceros y su fundamento.
- [ ] Definir si la piloto usa prepago y telemedición.
- [ ] Elegir proveedores y canales de cobro.
- [ ] Confirmar tratamiento de capital social y aportes.
- [ ] Fijar metas no funcionales con la piloto.
- [x] Decidir cómo migrar la agrupación Grupo Factura de ProCoop: se migra a un grupo de facturación equivalente (versión 0.17, FAC-012). Queda la validación fiscal de 106.
- [ ] Aprobar o ajustar la priorización de la sección 97.12.
- [ ] Consolidar cada módulo con sus ampliaciones y asignar identificadores a todos los requisitos.

## 99. Relevamiento del mercado argentino de sistemas para cooperativas

### 99.1. Método y criterio

Relevamiento realizado el 3 de noviembre de 2026 sobre la información **publicada por cada proveedor en su sitio web**. No se probaron los productos, no se accedió a demos y no se verificó que cada función esté disponible en todas sus versiones. Que una función no aparezca publicada no prueba que el producto no la tenga. El objetivo es detectar funciones que el mercado ofrece y este documento no define, o define con menos detalle.

### 99.2. Sistemas relevados

| Sistema | Proveedor y origen | Enfoque publicado | Fuente |
|---|---|---|---|
| ProCoop Gestión y complementos | ProCoop SRL, Córdoba | Integral multiservicio; POS fiscal, prepago remoto, conector de lecturas, turnero, SMS, web, CMS, actividades | [MER1] |
| GestBit | GestBit | ERP para cooperativas, instalado en la cooperativa o en la nube, con servicios digitales: portal, bot de WhatsApp, pagos, app de lecturas | [MER2, MER3] |
| GIES | Etheralink, Costa Atlántica | Abonados, órdenes de trabajo con agenda, obras y lotes, factura electrónica, cobranzas, contabilidad, informes ARBA y ARCA | [MER4] |
| GLMSUIT Servicios Públicos | GLM S.A., Rosario | Agua, energía y gas para cooperativas y empresas; cartera, fraudes, garantías, gestión judicial, BI, workflow, RRHH | [MER5] |
| GSP | Solsoft SRL, San Francisco (Córdoba) | Amplio catálogo de servicios, incluidos banco de sangre, obras públicas y cobranza por cuenta de terceros; capital y Libro de asociados | [MER6] |
| UniBiz Billing | UniSolutions | Servicios públicos de gran volumen; trámites con estados y plazos; facturación prepaga, in situ o inmediata | [MER7] |
| Sistema para cooperativas eléctricas | Estudio Scapin & Asociados | Padrón, lecturas, factura de energía con otros servicios, grandes consumidores, cobranzas, contabilidad | [MER8] |
| SIA Coop | Sistemas & Soluciones | Administrativo-contable; códigos de barra para muchas redes de cobro; reclamos y calidad comercial | [MER9] |
| GestarCoop | GestarCoop | Planes por tamaño de cooperativa; oficina virtual, medios de pago, migración, landing, app de lecturas | [MER10] |
| CoopInfo | CoopInfo, Córdoba | Gestión integral; toma de estado georreferenciada, WhatsApp con bot, seguimiento satelital de vehículos | [MER11] |
| ADCP | ADCP | Padrón, lecturas, facturación masiva, mora, portal y reportes | [MER12] |
| SIWCA | SIWCA, Mar del Plata | Oficina virtual, pagos, comunicación multicanal e integraciones por API para cooperativas y otras instituciones | [MER13] |
| ISPRED | ISPRED | Gestión de proveedores de internet en la nube: red, equipos, monitoreo, facturación, pagos y tickets | [MER14] |
| DEMI-AMI | Demitec | Telelectura y AMI de medidores eléctricos, integrable con la facturación por API o vistas SQL | [MER15] |

### 99.3. Matriz comparativa

Funciones que el mercado publica, con su cobertura en este documento. **Cubierto** significa definido con objetivo, alcance o caso; **parcial**, mencionado sin detalle suficiente; **faltante**, no definido.

| Función del mercado | Publicada por | Cobertura en este documento | Tratamiento |
|---|---|---|---|
| Padrón multiservicio, suministro por servicio, rutas y categorías | Todos | Cubierto (secciones 3, 4, 83) | — |
| Lecturas con app offline, foto, validación de rangos | ProCoop, GestBit, CoopInfo, GestarCoop, GLM | Cubierto (8, 9) | — |
| Cronogramas de lectura y generación automática de recorridos | GLM | Parcial | MER-018 |
| Autolectura del usuario por web | Solsoft | Faltante | MER-018 |
| Telemedición y AMI | ProCoop, Demitec, Solsoft | Parcial (97.5) | Se mantiene en 97.5 |
| Cuadros tarifarios por categoría, escalones, mínimos y excedentes | Todos | Cubierto (6, 51) | — |
| Grandes usuarios y contratos especiales: pico, valle, resto, demanda y reactiva | GLM, Scapin, Solsoft, ProCoop | Parcial (87) | MER-003 |
| Usuario-generador y balance neto | Ningún proveedor lo publica | Faltante | MER-001 |
| Factura electrónica, CAE y CAEA | GIES, GestBit, Solsoft, ISPRED | Cubierto (97.2) | — |
| Comprobante Liquidación de Servicios Públicos y rendición a ARCA | ProCoop (comprobante observado), Solsoft | Faltante | MER-002 |
| Regímenes informativos y libros IVA | GestBit, Solsoft, GIES | Parcial (61) | MER-002 |
| Vencimientos precalculados, código de barras, gráfico de consumos | ProCoop, Solsoft, Scapin, SIA Coop | Parcial (97.3, 97.6) | MER-019 |
| Facturación prepaga, in situ o inmediata | UniSolutions, ProCoop, Solsoft | Parcial (97.5) | MER-018 |
| Ventas y cuotas cobradas en la factura del servicio | ProCoop, Solsoft | Faltante, y en tensión con la sección 52 | MER-010 |
| Cobranza por cuenta de terceros | Solsoft, ProCoop (observado) | Cubierto (97.4) | — |
| Cobranza multicanal, rendiciones y débito automático | Todos | Cubierto (12, 13, 97.6) | — |
| Cobradores a domicilio con comisión y cobranza remota | Solsoft, ProCoop | Faltante | MER-007 |
| Punitorios cobrados al momento o diferidos a la próxima factura | ProCoop, GestBit | Parcial (97.3) | MER-019 |
| Convenios con sistema francés, alemán, americano o directo | ProCoop | Parcial (14) | MER-019 |
| Instancias de mora, cartas, intimación, corte y reconexión | ProCoop, GLM, GestBit, Solsoft | Cubierto (14, 53, 68) | — |
| Orden de corte derivada automáticamente a cuadrillas | GestBit, GLM | Parcial (68) | MER-019 |
| Gestión judicial, incobrables y caducidad | GLM, Solsoft | Faltante | MER-006 |
| Garantías y garantes | GLM, ProCoop | Faltante | MER-005 |
| Fraudes, hurto y consumo no registrado | GLM | Faltante | MER-004 |
| Impresión y reparto físico de facturas por repartidor | Solsoft, ProCoop | Faltante | MER-008 |
| Obras, loteos, planes de vivienda y contribución por mejoras | Solsoft, GIES, ProCoop | Faltante | MER-009 |
| Capital suscripto e integrado, retorno de excedentes, Libro de asociados | Solsoft | Parcial (27, 97.7) | MER-011 |
| Órdenes de trabajo con agenda, vehículos y materiales | GIES, ProCoop | Cubierto (17, 50, 73) | — |
| Seguimiento satelital de flota | CoopInfo | Faltante | MER-015 |
| Workflow de autorizaciones con bandeja única | GLM | Parcial (aprobaciones dispersas) | MER-012 |
| Trámites con estados, plazos y sectores configurables | UniSolutions | Cubierto (47) | — |
| Bot de WhatsApp para saldo, facturas y avisos | GestBit, CoopInfo, GLM, SIWCA | Parcial (47 menciona chat y bot) | MER-016 |
| Integración con IVR telefónico | GLM | Faltante | MER-016 |
| BI, generador de reportes y conexión directa a datos | GLM, Solsoft, ProCoop | Parcial (30, 59) | MER-013 |
| Informes a entes reguladores (ENACOM, Secretaría de Energía, ERSeP) | ProCoop, Solsoft, GLM | Parcial | MER-014 |
| Telefonía con registros de centrales | Solsoft | Parcial (92) | MER-017 |
| Monitoreo de red y equipos de ISP | ISPRED | Parcial (86) | MER-017 |
| Mesa de entradas y correspondencia | ProCoop | Faltante | MER-016 |
| Garantías de equipos con proveedores (RMA), bienes de uso | ProCoop | Faltante | MER-020 |
| Nómina y libro de sueldos digital | GLM, ProCoop | Incorporado en 0.17 (104) | SUE-001 a SUE-014 |
| Turnero, SMS, actividades, CMS | ProCoop | Cubierto (26, 46) | — |
| Elección de dónde residen los datos y portabilidad | GestBit | Faltante | MER-020 |
| Planes comerciales por tamaño de cooperativa | GestarCoop | Parcial (97.11) | Se mantiene en 97.11 |

### 99.4. Conclusiones del relevamiento

**Lo que el documento ya tiene y el mercado no publica.** Ningún proveedor relevado publica en su sitio, con el nivel de detalle de este documento: un SaaS multitenant con marca y diccionario de términos por cooperativa; CRM con tickets, fotos, supervisión y asistencia de IA; APIs tokenizadas para BI; doble factor e ingreso con Google; copia de configuración de servicios entre cooperativas; simulaciones con varios planes de cuentas; botón de baja; e instalación integral con aviso de instalador en camino, conformidad y encuesta. Son los diferenciales del producto. Algunos proveedores ofrecen piezas sueltas (por ejemplo, SIWCA publica integraciones por API y GestBit una capa digital en la nube).

**Lo que el mercado da por sentado y el documento no definía.** El grueso de lo faltante está en el **núcleo operativo de una cooperativa eléctrica y de agua tradicional**: usuarios-generadores, grandes usuarios, consumo no registrado, garantías, incobrables, reparto de facturas en papel, obras con cobro a frentistas, cobradores, capital y excedentes, informes a reguladores. Sin esas funciones el sistema puede quedar mejor que ProCoop en experiencia y peor en profundidad, que la sección 64.2 identifica como condición para competir.

**Una diferencia de modelo a decidir.** ProCoop, GSP y Scapin publican la emisión de **varios servicios en un mismo comprobante** (grupos de facturación). Es la práctica a la que están acostumbradas muchas cooperativas. Este documento exige factura separada por servicio (FAC-002). Se mantiene ese requisito, pero para no perder la comodidad del pago único se agrega en MER-019 un cupón de pago único para el resumen. La validez fiscal de cada alternativa debe confirmarse por servicio y jurisdicción. *(Resuelto en la versión 0.17: se admiten las dos modalidades; ver sección 103.)*

**Nómina.** Al menos dos competidores (GLM y ProCoop) incluyen sueldos. La sección 28 lo difiere. Se recomienda mantener la integración como primera opción y evaluar la nómina como módulo posterior si la cooperativa piloto lo exige para reemplazar su sistema actual. *(Resuelto en la versión 0.17: sueldos se incorpora al alcance; ver sección 104.)*

## 100. Requisitos incorporados por el relevamiento de mercado

Propuestas para el sistema propio derivadas de la sección 99. Cada una debe validarse con la cooperativa piloto y, cuando corresponda, con asesoramiento técnico, legal o fiscal.

### MER-001. Usuario-generador de energía renovable (generación distribuida)

**Objetivo:** gestionar a los asociados que generan energía renovable para autoconsumo e inyectan excedentes a la red de la cooperativa.

**Base verificada:** la Ley 27.424 establece el balance neto de facturación: el distribuidor compensa la energía demandada con el valor de la inyectada, paga una tarifa de inyección por cada kWh entregado y, si queda un saldo a favor del usuario-generador, lo acredita en los períodos siguientes; el usuario puede pedir la retribución del saldo en un plazo que no supere seis meses, y la reglamentación prevé la cesión de créditos entre usuarios [MER16]. La reglamentación exige un medidor bidireccional que registre por separado la energía demandada y la inyectada [MER17]. La RG ARCA 5746/2025 detalla lo que debe informarse para la energía inyectada en el comprobante "Liquidación de Servicios Públicos" (clasificación del usuario-generador, potencia, kWh inyectados, precio, IVA, balance neto, crédito anterior, cesión, retribución y crédito final) y aprobó la versión 2.0 del aplicativo de rendición, obligatoria desde octubre de 2025 para los distribuidores alcanzados [MER18].

**Límite:** el contrato de generación distribuida es un vínculo propio asociado al suministro, no un servicio nuevo independiente. La tarifa de inyección y las exenciones dependen del régimen y la jurisdicción aplicables. La adhesión de cada provincia debe verificarse.

**Alcance propuesto:**

- Registrar el contrato de generación distribuida: clasificación del usuario-generador, potencia, equipo, fecha de conexión e instalador.
- Medidor bidireccional con lecturas separadas de demanda e inyección, y franjas o potencia cuando correspondan.
- Liquidar la energía demandada y la inyectada como operaciones separadas en el mismo comprobante, con su tratamiento de IVA.
- Llevar la cuenta de créditos del usuario-generador: crédito anterior, generado en el período, aplicado, cedido, retribuido y final.
- Tramitar pedidos de retribución y de cesión de créditos con sus plazos.
- Generar la rendición a ARCA con el detalle exigido.
- Cambio de titular y baja del contrato de generación vinculados a los del suministro.

**Caso de uso — CU-MER-01:** un asociado con paneles solares demanda 300 kWh e inyecta 120 kWh en el mes. El sistema liquida la demanda con la tarifa del suministro y la inyección con la tarifa de inyección vigente. Si el valor inyectado supera lo que paga, el saldo queda como crédito para el período siguiente. Valores ficticios; las tarifas reales son las del régimen aplicable.

### MER-002. Comprobante de servicios públicos y regímenes informativos

- Emitir el tipo de comprobante "Liquidación de Servicios Públicos" cuando corresponda, con el contenido mínimo exigido por la RG 3571 y sus modificatorias [MER18], además de las facturas comunes.
- Preparar las rendiciones y regímenes informativos que correspondan a la cooperativa (por ejemplo rendición de comprobantes de servicios públicos y consumos relevantes), libros de IVA digital y exportaciones a aplicativos de ARCA y organismos provinciales.
- Registrar presentación, acuse y rectificación, con el mismo criterio de la sección 61.

### MER-003. Grandes usuarios y contratos especiales

- Contratos con condiciones particulares de precio, potencia contratada, plazo y penalidades, aprobados y versionados.
- Lecturas por franja (pico, valle, resto), demanda en punta y fuera de punta, y energía reactiva con cargos por bajo factor de potencia según el régimen.
- Facturación con detalle por componente y revisión previa obligatoria por su importe.

### MER-004. Consumo no registrado, fraude e inspecciones

**Objetivo:** detectar, inspeccionar y regularizar conexiones clandestinas, manipulación de medidores y consumos no registrados.

**Límite:** una sospecha no es una infracción. El recupero de consumo y cualquier multa solo se aplican con procedimiento, evidencia y fundamento del régimen del servicio; no se calcula ni se cobra en forma automática.

**Alcance:** alertas por patrones de consumo, órdenes de inspección con acta y fotos, precintos, descargo del usuario, cálculo del recupero según método aprobado, facturación separada y seguimiento.

### MER-005. Garantías y garantes

- Registrar garantes y depósitos en garantía exigidos para ciertas contrataciones (por ejemplo inquilinos o grandes usuarios).
- Aplicar o devolver el depósito en la baja, con su liquidación e imputación trazables.

### MER-006. Incobrables, gestión judicial y prescripción

- Pasar deuda a gestión externa o judicial con su expediente, estudio a cargo, gastos y estado.
- Declarar incobrables con aprobación y su efecto contable, sin borrar la deuda del historial.
- Controlar la antigüedad para prescripción según el plazo legal que corresponda a cada obligación.
- Recuperos posteriores imputados a la deuda original.

### MER-007. Cobradores y cobranza fuera de oficina

- Cobradores a domicilio o en puntos remotos con lista de cobro, recibo, rendición y liquidación de comisiones.
- Cobranza sin conexión con sincronización posterior y control de duplicados.
- Puntos de venta remotos para energía prepaga (kioscos, estaciones de servicio), como el R-Pos de ProCoop [MER1].

### MER-008. Impresión y reparto de facturas

Aunque el canal digital sea el preferido, muchas cooperativas siguen repartiendo facturas en papel.

- Rutas y repartidores de distribución, con orden de impresión por ruta y secuencia.
- Preferencia de cada usuario entre papel, correo y app, y registro de entrega o devolución.
- Impresión masiva en lote o exportación a imprenta, con mensajes personalizados en la factura.

### MER-009. Obras, loteos y contribución por mejoras

**Objetivo:** gestionar obras de red de agua, cloacas, electricidad, pavimento o viviendas cuyo costo se distribuye entre los frentistas o beneficiarios.

**Límite:** el cobro requiere una base aprobada (ordenanza, convenio o asamblea) y un criterio de prorrateo explícito.

**Alcance:** obra con presupuesto, avance y costeo; padrón de beneficiarios por lote o frente; prorrateo por metros de frente, superficie u otro criterio; planes de pago; cobro en cuotas y seguimiento. Se relaciona con compras, stock, contabilidad y centros de costos.

### MER-010. Ventas y cuotas incluidas en la factura del servicio

Los competidores permiten incluir en la factura mensual una venta o las cuotas de un plan. La sección 52 indica que un comprobante no debe contener conceptos ajenos al servicio contratado.

- Por defecto, las ventas y sus cuotas se facturan en documentos propios y se presentan juntas en el resumen de cuenta.
- La inclusión en la factura del servicio solo se habilita para conceptos vinculados a ese servicio (por ejemplo, la instalación financiada del propio servicio) y con validación fiscal.

### MER-011. Capital social, excedentes y Libro de asociados

Amplía la sección 97.7.

- Suscripción e integración de cuotas sociales al ingresar el asociado o al contratar un servicio.
- Distribución de excedentes o retornos según lo resuelva la asamblea, en proporción al uso de los servicios u otro criterio aprobado.
- Reembolso de capital en la baja del asociado.
- Registro de asociados y padrón para asambleas en el formato que exija el INAES, a verificar con la normativa vigente.

### MER-012. Workflow de autorizaciones

Hoy las aprobaciones están dispersas en muchas secciones (tarifas, anulaciones, imputaciones, reglas, ajustes).

- Motor común para definir qué operación requiere autorización, quién la aprueba, por importe o riesgo, en qué orden y con qué plazo.
- Bandeja única de pendientes por usuario, con notificación e historial de cada decisión.
- La operación no produce efectos hasta su aprobación, y cada paso queda auditado.

### MER-013. Generador de reportes para el tenant

Complementa las APIs de la sección 59.

- Reportes y tableros armados por usuarios autorizados de la cooperativa, sin depender del proveedor.
- Plantillas de reportes, programación de envíos y exportación.
- Solo sobre datos del propio tenant y respetando permisos y datos sensibles.

### MER-014. Informes a entes reguladores

Distinto del módulo fiscal de retenciones (sección 61).

- Catálogo de informes por organismo y servicio (por ejemplo ENACOM para telecomunicaciones, Secretaría de Energía, ERSeP u otro regulador provincial), con formato, período y vencimiento.
- Generación, validación, presentación y acuse, con conceptos configurables para cada informe.
- Indicadores de calidad de servicio y atención cuando el regulador los exija.

### MER-015. Flota y vehículos

- Vehículos con conductor asignado, mantenimiento, documentación y vencimientos.
- Uso por orden de trabajo y costo imputable a la orden o al centro de costos.
- Integración opcional con seguimiento satelital para recorridos y kilometraje. No reemplaza el estado "En camino" de la sección 73 ni habilita mostrar la ubicación en vivo al socio.

### MER-016. Canales de atención adicionales

- WhatsApp como canal concreto del bot y del CRM: consulta de saldo, envío de facturas y avisos, apertura de tickets. Usa la cuenta oficial del tenant y respeta las políticas del proveedor.
- Integración opcional con IVR telefónico para consultas y reclamos.
- Mesa de entradas para notas, oficios y documentación recibida, con número de expediente y derivación interna.

### MER-017. Telecomunicaciones: telefonía y red de internet

- **Telefonía:** importación y tarificación de registros de llamadas de centrales o proveedores, numeración, planes y cargos de uso.
- **Internet:** integración con los equipos de red habilitados para alta, cambio de plan, suspensión por mora y reactivación con confirmación del resultado; monitoreo de nodos y equipos asociado a incidentes de zona. Ninguna acción sobre la red se ejecuta sin el circuito del CRM o de la mora.

### MER-018. Lecturas y facturación: variantes adicionales

- Cronogramas de lectura y generación automática de recorridos.
- Autolectura por el usuario desde la app con foto, sujeta a validación como cualquier lectura capturada.
- Facturación in situ: emisión en el momento de la lectura cuando el régimen y la cooperativa lo permiten.

### MER-019. Mejoras a cobranza y mora ya definidas

- Cupón de pago único: un solo código de barras o QR que cancela varias facturas del resumen, imputando a cada una según la regla definida.
- Punitorios cobrados en el momento del pago o diferidos a la próxima factura mediante nota de débito.
- Sistemas de amortización en convenios: francés, alemán, americano y directo.
- Orden de corte generada al cumplirse la instancia de mora y enviada a la cuadrilla, y orden de reconexión al regularizar, siempre con los controles de la sección 68.
- Gráfico de consumos de los últimos períodos en la factura y en la app.

### MER-020. Activos, garantías de equipos y salida del cliente

- Bienes de uso con amortización, ya pendiente en la sección 55.
- Garantías y devoluciones de equipos a proveedores (RMA), vinculadas a la serie del equipo.
- **Salida del cliente:** si una cooperativa deja la plataforma, debe poder exportar todos sus datos en formatos documentados, con un plazo de entrega y la posterior eliminación certificada. Es un argumento comercial frente a proveedores que ofrecen instalar la base en la cooperativa.

## 101. Pendientes y fuentes del relevamiento de mercado

### Pendientes

- [ ] Ver demos de al menos ProCoop, GestBit, GIES y GLMSUIT para confirmar funciones y su profundidad real.
- [ ] Relevar con la cooperativa piloto qué funciones de la matriz usa hoy y cuáles son indispensables para reemplazar su sistema.
- [ ] Confirmar la adhesión de cada provincia al régimen de generación distribuida y su tarifa de inyección.
- [ ] Validar fiscalmente la emisión separada por servicio frente a la práctica de grupos de facturación.
- [ ] Definir el procedimiento de consumo no registrado según el régimen de cada servicio.
- [ ] Priorizar MER-001 a MER-020 dentro de la propuesta de la sección 97.12.

### Fuentes

Consultadas el 3 de noviembre de 2026. Las páginas de proveedores describen sus productos según sus propios términos.

- **[MER1] ProCoop Gestión:** https://www.procoopsrl.com.ar/productos/p-gestion.html
- **[MER2] GestBit:** https://gestbit.com/
- **[MER3] GestBit, facturación para cooperativas:** https://gestbit.com/facturacion-cooperativas
- **[MER4] GIES:** https://gies.com.ar/
- **[MER5] GLMSUIT Servicios Públicos:** https://www.glmsa.com.ar/solucion-serviciospublicos
- **[MER6] Solsoft, GSP:** https://www.solsoft.com.ar/cooperativas.html
- **[MER7] UniSolutions, UniBiz Billing:** https://www.unisolutions.com.ar/soluciones/unibiz/billing/
- **[MER8] Estudio Scapin & Asociados:** https://www.scapinyasociados.com.ar/cooperativas-de-servicios-publicos/
- **[MER9] SIA Coop:** https://www.sysoluciones.com.ar/Productos/SIACoop/
- **[MER10] GestarCoop:** https://www.migestarcoop.com/
- **[MER11] CoopInfo:** https://www.coopinfo.com.ar/
- **[MER12] ADCP:** https://web.adcp.com.ar/es/soluciones/servicios-publicos-y-cooperativas
- **[MER13] SIWCA:** https://siwca.com.ar/
- **[MER14] ISPRED:** https://ispred.app/
- **[MER15] Demitec, DEMI-AMI:** https://demitec.com.ar/
- **[MER16] Ley 27.424, texto actualizado:** https://www.argentina.gob.ar/normativa/nacional/norma-305179/actualizacion
- **[MER17] Resolución SGE 314/2018, Anexo I:** https://epremendoza.gob.ar/usuario-generador/Normativa%20Nacional/Anexo%20I%20-%20Res.%20SGE%20N%C2%BA%20314-2018.pdf
- **[MER18] RG ARCA 5746/2025:** https://www.boletinoficial.gob.ar/detalleAviso/primera/329856/20250814

## 102. Complemento de análisis funcional y diseño — AGR-001 a AGR-036

### Origen e incorporación

El complemento fue aportado por el solicitante el 3 de noviembre de 2026 (versión 0.1). Se conserva sin cambios en `docs/base-funcional/PROCOOP_COMPLEMENTO_ANALISIS_FUNCIONAL_Y_DISENO.md` y se incorpora completo a continuación, en las subsecciones 102.1 a 102.11, como insumo para diseñar y especificar las soluciones que se detallan en la sección 105. Sus 36 propuestas AGR mantienen la condición de **propuestas pendientes de validación**: aparecer en este documento no las convierte en requisitos aprobados. Su estado se decide con la plantilla de la subsección 102.9.

### Correspondencia de referencias

El complemento se escribió sobre la versión 0.14 de este documento. Sus referencias a secciones se leen así:

- **Secciones 1 a 95:** conservan número y contenido. Las referencias del complemento valen sin cambios.
- **"Sección 96" del complemento:** en la versión 0.14 era el anexo de mensajes originales, que ahora es la sección 107.
- **Secciones 96 a 101, 103 a 106 actuales:** son posteriores al complemento. La tabla siguiente vincula las propuestas AGR con requisitos agregados después.

| Propuesta AGR | Contenido actual relacionado | Cómo se combinan |
|---|---|---|
| AGR-003 Estados y reversión | MER-012 workflow de autorizaciones | El workflow ejecuta aprobaciones; las tablas de estados de AGR-003 definen qué transiciones las requieren. |
| AGR-005 Contrato comercial SaaS | 97.11 comercialización de la plataforma | 97.11 define planes y precios; AGR-005 agrega habilitación verificable de capacidades. |
| AGR-011 Única fuente del saldo | 103 factura multiservicio | Un comprobante con varios servicios conserva obligación y saldo por servicio dentro del auxiliar. |
| AGR-012 Pagos excedentes | MER-019 cupón de pago único | El cupón necesita la regla de imputación y el tratamiento del excedente de AGR-012. |
| AGR-013 Devoluciones y reversos | MER-001 retribución al usuario-generador; MER-005 devolución de garantías | Ambos son devoluciones con efecto en fondos y en cuenta corriente. |
| AGR-014 Convenios | MER-019 sistemas de amortización; MER-009 obras | El ciclo de vida de AGR-014 aplica a planes de obra y refinanciaciones. |
| AGR-015 Cierre de ciclo | 97.3 vencimientos; MER-002 rendición a ARCA | El cierre aprobado es la condición para emitir la rendición del período. |
| AGR-018 Migración | 97.10 migración desde ProCoop; 103 Grupo Factura | 97.10 tiene el mapeo de datos; AGR-018 agrega ensayo, corte y conciliación. |
| AGR-019 y AGR-020 Recuperación y capacidad | 97.8 requisitos no funcionales | AGR-019 y AGR-020 hacen verificables los objetivos de 97.8. |
| AGR-022 BI | MER-013 generador de reportes | Los reportes de MER-013 deben usar el contrato semántico de AGR-022. |
| AGR-023 Expediente y evidencia | 97.1 protección de datos | La conservación debe respetar la finalidad y los plazos de 97.1. |
| AGR-024 Comunicaciones | MER-008 reparto de facturas; MER-016 WhatsApp e IVR | Toda entrega, física o digital, deja constancia. |
| AGR-026 Activos y reparación | MER-020 activos y RMA | Se consolidan en una sola definición de inventario valorizado. |
| AGR-029 Capital | 97.7 capital social; MER-011 excedentes y Libro de asociados | Se consolidan en un único módulo institucional. |
| AGR-033 Privacidad y salida | 97.1; MER-020 salida del cliente | La salida de una cooperativa y el derecho de cada titular se tratan juntos. |
| AGR-035 Entornos | 97.9 ambientes | AGR-035 agrega evidencias de prueba por entrega. |
| AGR-036 Piloto | 97.12 priorización v1 | 97.12 propone el contenido; AGR-036 la aceptación firmable. |
| — | 104 personal y sueldos | El complemento no lo trata; aplican AGR-002, 003, 010, 016 y 035. |

Donde hay superposición, el requisito existente fija el alcance y la propuesta AGR aporta la regla operativa y el criterio de aceptación. Si se contradicen, la decisión se registra con la plantilla de 102.9.

### 102.1. Propósito y criterio de revisión

Este documento adicional identifica aspectos que conviene incorporar o precisar para convertir la visión del sistema en una especificación desarrollable y operable. Se revisó el documento base completo, sus 96 secciones numeradas, ampliaciones, fuentes y anexo de 20 mensajes originales. La base se conserva sin cambios.

El foco es el producto definido: SaaS multitenant de gestión cooperativa con ERP, CRM, comunidad, autogestión, servicios configurables, facturación argentina y operación técnica. No se proponen módulos ajenos a esa visión ni se convierte cada posibilidad en requisito obligatorio.

Se distinguen tres diagnósticos:

- **No explicitado:** no se encontró un circuito o requisito expreso equivalente en la base. No significa que no pueda estar implícito en una categoría general.
- **Detalle insuficiente:** el tema existe; faltan decisiones, reglas o criterios para implementarlo sin ambigüedad.
- **Pendiente ya identificado:** la base ya lo dejó abierto. El aporte aquí es proponer cómo cerrarlo, no presentarlo como un descubrimiento nuevo.

Las prioridades son de análisis, no de implementación completa:

- **P0:** resolver la decisión o contrato funcional antes de cerrar arquitectura o construir el núcleo. No exige construir toda la función en la primera entrega.
- **P1:** concretar antes de poner en producción el flujo afectado; imprescindible si se incluye en el piloto.
- **P2:** decidir su inclusión y momento; puede diferirse con límites explícitos.

Todas las recomendaciones de este complemento son propuestas. Los requisitos informados por el solicitante conservan su condición en la base; ninguna propuesta se considera aprobada por aparecer aquí.

### 102.2. Diagnóstico principal

La base tiene una cobertura funcional amplia: los módulos principales y las particularidades de servicios ya están relevados. El mayor trabajo pendiente no consiste en agregar nombres de módulos, sino en definir cómo funcionan sus bordes: quién puede actuar, qué dato es la fuente, cuándo cambia el estado, cómo se reintenta, cómo se corrige y cómo se concilian los efectos económicos.

Los puntos más determinantes para arquitectura son el modelo de identidad multitenant, los responsables de los datos, los estados y eventos entre módulos, el historial con fechas efectivas, la integridad de saldos y la publicación de configuración. Si se resuelven tarde, obligarán a rehacer contratos de API, pantallas, procesos y migraciones.

Los vacíos operativos más visibles son el circuito de pagos excedentes/no identificados y la moderación de comunidad si se habilita participación. Otros puntos —migración, backups, presupuestos, activos, privacidad y soporte— ya están mencionados, pero necesitan definición para ser comprobables.

#### 102.2.1. Qué ya está y no hace falta volver a inventar

| Capacidad cubierta en la base | Referencias | Aporte necesario del complemento |
|---|---|---|
| Tenants, roles, perfiles, marca y diccionario | 42–45, 60, 65 | Cerrar reglas efectivas, ciclo del tenant y publicación. |
| Catálogo de servicios y copia entre cooperativas | 66, 72, 81, 84 | Convertir copia en paquete validable y mantener dependencias. |
| Facturación, cuenta corriente, cobranza y tesorería | 10–14, 21–22, 44, 68–69, 75 | Definir invariantes, correcciones, excedentes y cierre. |
| ERP con cuentas y centros de costos reales/simulados | 55, 75 | Completar controles operativos y opciones de activos/presupuesto. |
| CRM, IA, chat, bot y supervisión | 47 | Estados, responsabilidad y evaluación de automatizaciones. |
| Visitas, equipo, firma, encuesta y primer cobro | 50, 73 | Concurrencia, contingencia offline y efectos parciales. |
| APIs, seguridad, auditoría y organismos fiscales | 54, 59–62 | Contratos operativos, entornos y evidencia de verificación. |
| Seis dominios y límites regulatorios | 85–95 | Obtener documentación real y cerrar reglas por cooperativa. |

### 102.3. Matriz de propuestas y trazabilidad

La referencia a secciones corresponde siempre al documento base v0.14. Los identificadores AGR son propios de este complemento y no reutilizan los IDs de requisitos originales.

| ID | Propuesta | Prioridad | Diagnóstico respecto de la base | Secciones base |
|---|---|---|---|---|
| AGR-001 | Consolidar requisitos y decisiones en un catálogo único | P0 | Detalle insuficiente | 2, 34–38, 84, 93, 96 |
| AGR-002 | Responsable de cada dato y límite entre ERP, CRM y operación | P0 | Pendiente ya identificado | 33, 58, 73, 75, 78, 84 |
| AGR-003 | Modelos de estados y reversión por proceso | P0 | Detalle insuficiente | 15–17, 39, 47–50, 53, 69, 73 |
| AGR-004 | Ciclo de vida completo de la cooperativa y preparación para producción | P0 | Detalle insuficiente | 42–43, 64, 66, 81 |
| AGR-005 | Contrato comercial SaaS y habilitación de capacidades | P2 | Pendiente ya identificado | 64, 66, 81 |
| AGR-006 | Identidad de acceso, pertenencia y selección de cooperativa | P0 | Pendiente ya identificado | 3, 42, 59–60, 67, 83 |
| AGR-007 | Representaciones, titulares, beneficiarios y cambios de responsabilidad | P1 | Detalle insuficiente | 3–4, 24, 67, 83, 90–91 |
| AGR-008 | Regla exacta de combinación entre roles y perfiles | P0 | Pendiente ya identificado | 29, 42, 45, 60 |
| AGR-009 | Publicación segura de configuración y paquetes de servicio | P0 | Detalle insuficiente | 6, 51, 65–66, 72, 81 |
| AGR-010 | Historia con fecha efectiva y fecha de registro | P0 | Detalle insuficiente | 4, 6–11, 51, 55, 69, 75, 83 |
| AGR-011 | Invariantes monetarias y única fuente del saldo | P0 | Detalle insuficiente | 10–14, 22, 40, 44, 51, 55, 75, 78 |
| AGR-012 | Pagos excedentes, anticipos y cobros sin identificar | P1 | No explicitado | 11–13, 40, 44, 68, 75 |
| AGR-013 | Devoluciones y reversos con sus dos efectos | P1 | Detalle insuficiente | 10–14, 21–22, 53, 61, 75 |
| AGR-014 | Vida completa de convenios y financiación | P1 | Detalle insuficiente | 14, 23, 51, 68, 72 |
| AGR-015 | Cierre y aprobación de cada ciclo de facturación | P0 | Detalle insuficiente | 10, 51, 69, 75 |
| AGR-016 | Ejecución fiable de acciones entre componentes | P0 | Detalle insuficiente | 13, 47, 54, 58–59, 61, 69, 73 |
| AGR-017 | Calendarios, prorrateos y cambios dentro del período | P1 | Detalle insuficiente | 6, 51, 69, 72–73 |
| AGR-018 | Migración y cambio operativo desde el sistema anterior | P1 | Detalle insuficiente | 31, 35, 64, 95 |
| AGR-019 | Recuperación y restauración por tenant | P0 | Detalle insuficiente | 29, 54, 60, 64 |
| AGR-020 | Capacidad, rendimiento y aislamiento de carga | P0 | Pendiente ya identificado | 54, 58–60, 64, 69 |
| AGR-021 | Operación de APIs y conectores, además de su desarrollo | P1 | Detalle insuficiente | 13, 31, 59, 61, 79 |
| AGR-022 | Contrato semántico para dashboards y BI | P1 | Detalle insuficiente | 30, 54–55, 59, 75 |
| AGR-023 | Expediente documental y conservación de evidencia | P1 | Detalle insuficiente | 3, 17, 43, 47, 54, 61, 73, 90–91 |
| AGR-024 | Comunicaciones, entrega y constancias | P1 | Detalle insuficiente | 26, 43, 47, 50, 52–54, 73 |
| AGR-025 | Visitas y operación sin conexión con conflictos | P1 | Detalle insuficiente | 8, 17, 50, 73, 77 |
| AGR-026 | Valorización, activos y reparación de equipos | P1 | Pendiente ya identificado | 7, 18, 20, 55, 73, 75, 78 |
| AGR-027 | Control de compra, recepción y factura de proveedor | P1 | Detalle insuficiente | 19–21, 61, 75, 78 |
| AGR-028 | Presupuestos y compromisos de fondos | P2 | Pendiente ya identificado | 19, 21–22, 55, 75 |
| AGR-029 | Capital y relación institucional del asociado | P1 | Pendiente ya identificado | 3, 27, 75, 83 |
| AGR-030 | Gobierno de la IA y verificación de sus resultados | P0 | Detalle insuficiente | 47, 54, 60, 65, 73, 91 |
| AGR-031 | Moderación y ciclo de vida de la comunidad | P2 | No explicitado | 26, 46, 65, 82 |
| AGR-032 | Accesibilidad y autogestión tolerante a errores | P1 | Detalle insuficiente | 25, 43, 50, 60, 65, 67, 73 |
| AGR-033 | Ciclo de privacidad, conservación y salida de datos | P0 | Detalle insuficiente | 29, 54, 59–60, 64, 77, 83, 90–91 |
| AGR-034 | Soporte con acceso temporal y responsabilidad | P1 | Detalle insuficiente | 42, 54, 60, 64 |
| AGR-035 | Entornos, pruebas y evidencias antes de cada entrega | P0 | Detalle insuficiente | 34, 39–40, 54–55, 60, 69, 73 |
| AGR-036 | Plan de entrega y aceptación de la cooperativa piloto | P0 | Pendiente ya identificado | 35, 37, 58, 64, 95 |

### 102.4. Fichas de ampliación recomendadas

Cada ficha contiene un problema concreto, una propuesta, un ejemplo y un criterio verificable. El criterio puede implementarse como prueba, inspección de diseño o evidencia operativa según corresponda.

#### AGR-001 — Consolidar requisitos y decisiones en un catálogo único

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 2, 34–38, 84, 93, 96.

**Qué falta concretar y por qué:** La base acumuló ampliaciones y pendientes a lo largo de 96 secciones. Tener todos los textos no asegura que cada decisión tenga una única versión vigente y responsable.

**Propuesta:** Crear un registro con ID estable, origen, redacción vigente, estado —informado, propuesto, aprobado, rechazado o sustituido—, responsable, dependencia, versión y criterio de aceptación. Referenciar los mensajes P-001 a P-020 sin convertir todas las opiniones del anexo en hechos verificados. Mantener ejemplos fuera de la configuración normativa.

**Ejemplo:** Una regla propuesta en una sección y precisada después debe mostrar cuál redacción prevalece y qué decisión la sustituyó.

**Criterio de aceptación:** Cada requisito del piloto tiene una definición vigente identificable y puede rastrearse a su origen y prueba; una contradicción no se resuelve eligiendo arbitrariamente el párrafo más conveniente.

#### AGR-002 — Responsable de cada dato y límite entre ERP, CRM y operación

**Prioridad:** P0. **Diagnóstico:** Pendiente ya identificado. **Base:** secciones 33, 58, 73, 75, 78, 84.

**Qué falta concretar y por qué:** La revisión de arquitectura está expresamente pedida, pero falta convertirla en un mapa de propietarios de datos y comandos. Varias pantallas podrían terminar modificando el mismo estado.

**Propuesta:** Asignar un responsable funcional a persona, vínculo de tenant, contrato, visita, instalación, medición, factura, pago y asiento. Los otros módulos solicitan acciones o consultan proyecciones; no escriben directamente estados ajenos. Definir comandos, eventos y resultados esperados.

**Ejemplo:** CRM puede solicitar una baja y mostrar su avance; el componente contractual confirma el cambio efectivo y facturación calcula las consecuencias.

**Criterio de aceptación:** Para cada entidad crítica hay un responsable y una interfaz de modificación documentados; cerrar un ticket por sí solo no cambia un contrato ni cancela deuda.

#### AGR-003 — Modelos de estados y reversión por proceso

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 15–17, 39, 47–50, 53, 69, 73.

**Qué falta concretar y por qué:** Ya existen estados de ejemplo, pero no tablas completas de transiciones, responsables, precondiciones y efectos. Dos procesos pueden quedar en estados incompatibles.

**Propuesta:** Definir por proceso estado origen/destino, actor, requisitos, datos obligatorios, efectos, avisos, reversión y tratamiento de cancelación. Distinguir el estado del trámite del estado real del contrato, equipo, pago y documento.

**Ejemplo:** Cancelar una visita no cancela necesariamente la contratación; anular una solicitud antes de instalar no debe exigir el circuito de retiro de un equipo instalado.

**Criterio de aceptación:** Toda transición aceptada o rechazada puede explicarse por una regla; no existe edición libre de Activo, Pagado o Emitido para forzar cierres.

#### AGR-004 — Ciclo de vida completo de la cooperativa y preparación para producción

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 42–43, 64, 66, 81.

**Qué falta concretar y por qué:** Se contempla el alta del tenant, pero faltan etapas operativas de preparación, validación, habilitación, suspensión administrativa, reactivación y salida.

**Propuesta:** Proponer estados Preparación, Prueba, Listo para habilitar, Operativo y Cierre administrativo, con tareas por área. Exigir checklist de identidad, servicio, tarifas, emisión, pagos, usuarios, contactos y saldos iniciales para cada capacidad productiva. Diferenciar disponibilidad técnica, situación comercial SaaS y prestación al socio.

**Ejemplo:** Un tenant puede cargar marca y catálogo mientras todavía no tiene credenciales fiscales aprobadas; eso no debe habilitar emisión real.

**Criterio de aceptación:** No se activa una capacidad productiva con datos de demostración o dependencias faltantes; una decisión administrativa de plataforma no ejecuta bajas masivas de servicios de la cooperativa.

#### AGR-005 — Contrato comercial SaaS y habilitación de capacidades

**Prioridad:** P2. **Diagnóstico:** Pendiente ya identificado. **Base:** secciones 64, 66, 81.

**Qué falta concretar y por qué:** La base declara que precio y licenciamiento SaaS no están definidos. Conviene diseñar el punto de conexión sin inventar todavía el modelo comercial.

**Propuesta:** Separar capacidades contratadas a la plataforma, servicios ofrecidos por el tenant y contratos de sus socios. Si se comercializa por módulos o cupos, definir vigencia, límites blandos/duros, excedentes, avisos y tratamiento de baja del cliente SaaS. Determinar acceso a documentos y exportación durante una transición.

**Ejemplo:** Deshabilitar nuevas contrataciones de un módulo no debe ocultar facturas históricas del tenant ni eliminar expedientes.

**Criterio de aceptación:** El sistema puede explicar qué habilitación depende del producto SaaS y cuál del catálogo del tenant; no se implementa un precio o límite sin decisión comercial expresa.

#### AGR-006 — Identidad de acceso, pertenencia y selección de cooperativa

**Prioridad:** P0. **Diagnóstico:** Pendiente ya identificado. **Base:** secciones 3, 42, 59–60, 67, 83.

**Qué falta concretar y por qué:** La identidad global o separada por tenant sigue abierta y afecta registro, Google, recuperaciones, duplicados y privacidad.

**Propuesta:** Como hipótesis preferida, evaluar una identidad de acceso común con pertenencias privadas a tenants, manteniendo separados los registros de personas y asociados de cada cooperativa. La selección de ámbito debe ser explícita, comprobada en servidor y visible al usuario. La coincidencia de DNI o correo no concede pertenencia.

**Ejemplo:** Una persona que trabaja en A y contrata un servicio en B cambia de ámbito sin mezclar sus roles ni revelar a una cooperativa su relación con la otra.

**Criterio de aceptación:** Un cambio de tenant obliga a recalcular permisos y datos visibles, incluyendo descargas, caché, conversaciones y trabajos de fondo.

#### AGR-007 — Representaciones, titulares, beneficiarios y cambios de responsabilidad

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 3–4, 24, 67, 83, 90–91.

**Qué falta concretar y por qué:** Los roles de persona están distinguidos, pero falta el ciclo verificable de autorización, vencimiento y revocación de representación y de los cambios de titularidad.

**Propuesta:** Modelar relaciones con inicio/fin, alcance y evidencia. Definir quién puede consultar, pagar, solicitar baja o firmar por otro. Resolver fallecimiento, representación de organizaciones, grupo familiar y cambio de pagador sin reasignar deuda automáticamente. Conservar la responsabilidad de cada período.

**Ejemplo:** Un hermano paga una factura del otro sin adquirir derecho a ver todos sus contratos; revocar una representación retira el acceso futuro.

**Criterio de aceptación:** Cada gestión en nombre de tercero acredita una relación vigente para esa acción y conserva quién actuó y por quién.

#### AGR-008 — Regla exacta de combinación entre roles y perfiles

**Prioridad:** P0. **Diagnóstico:** Pendiente ya identificado. **Base:** secciones 29, 42, 45, 60.

**Qué falta concretar y por qué:** Está clara la diferencia entre pantalla y función, pero falta resolver varios roles/perfiles, restricciones por sucursal/área, denegaciones y separación de tareas.

**Propuesta:** Definir cómo se calcula el permiso efectivo, el alcance sobre datos y el tratamiento de conflictos. Proponer denegación por defecto, aprobación independiente para operaciones sensibles y pruebas de permiso por acción y objeto. Restringir la autoasignación de privilegios y el poder de delegarlos.

**Ejemplo:** Ver Tesorería no permite aprobar una devolución propia; un supervisor de Agua no obtiene por ese rol los expedientes sanitarios de Banco de sangre.

**Criterio de aceptación:** Para cualquier usuario se puede explicar por qué una pantalla, registro y acción están habilitados o denegados, también en la API.

#### AGR-009 — Publicación segura de configuración y paquetes de servicio

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 6, 51, 65–66, 72, 81.

**Qué falta concretar y por qué:** La configuración versionada y la copia existen conceptualmente, pero falta definir cómo se publica un conjunto coherente y cómo se evita aplicar solo una parte.

**Propuesta:** Crear una versión de configuración que reúna dependencias, validaciones, simulación, revisión y fecha efectiva. Copiar a borrador y mostrar diferencias. Separar cambios comerciales, fiscales y de presentación; una corrección de label no debe generar una revisión tarifaria innecesaria. No sobrescribir contratos vigentes sin política.

**Ejemplo:** Copiar Internet a B importa formularios, pero la publicación se detiene si no hay equivalencia contable o una tarifa aplicable para B.

**Criterio de aceptación:** La publicación es íntegra y auditable; no queda un plan visible sin precio o con un impuesto del tenant origen por una actualización parcial.

#### AGR-010 — Historia con fecha efectiva y fecha de registro

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 4, 6–11, 51, 55, 69, 75, 83.

**Qué falta concretar y por qué:** Existen vigencias, pero falta una regla transversal para cambios retroactivos, datos recibidos tarde y reconstrucción de lo conocido en una fecha.

**Propuesta:** Conservar fecha efectiva del hecho y fecha en que el sistema lo recibió, además de su origen. Definir qué puede corregirse en borrador y qué exige un ajuste de operación emitida/cerrada. Las consultas históricas deben declarar qué fecha interpretan.

**Ejemplo:** Una instalación realizada el 10 se sincroniza el 12; una tarifa cargada el 15 tiene vigencia autorizada desde el 1. No son el mismo tipo de retroactividad.

**Criterio de aceptación:** Se puede explicar una factura con los datos y reglas que utilizó, y reconstruir la corrección posterior sin reescribir silenciosamente el documento original.

#### AGR-011 — Invariantes monetarias y única fuente del saldo

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 10–14, 22, 40, 44, 51, 55, 75, 78.

**Qué falta concretar y por qué:** Las conciliaciones y ejemplos están bien planteados, pero falta convertirlos en reglas obligatorias del diseño y la persistencia.

**Propuesta:** Definir representación decimal, precisión por concepto, redondeo, moneda y reglas de compensación. El saldo comercial se deriva de movimientos válidos e imputaciones, no de campos editables independientes. Mantener control de documentos, auxiliar, caja/banco y contabilidad con diferencias explicadas.

**Ejemplo:** Una factura de ARS 13.000 con ARS 5.000 imputados tiene ARS 8.000 de saldo aunque el resumen se regenere o cambie su presentación.

**Criterio de aceptación:** El total no depende de la pantalla o proceso que lo consulte; ningún ajuste de saldo carece de operación, causa, autor y contrapartida.

#### AGR-012 — Pagos excedentes, anticipos y cobros sin identificar

**Prioridad:** P1. **Diagnóstico:** No explicitado. **Base:** secciones 11–13, 40, 44, 68, 75.

**Qué falta concretar y por qué:** Se contemplan pagos parciales y a cuenta, pero no está cerrado el tratamiento de excedentes, transferencias no identificadas y pagos de terceros.

**Propuesta:** Crear un circuito de pendientes de identificación y saldo a favor, con conciliación, responsable y aplicación autorizada. Definir qué datos se requieren para identificar al titular beneficiado y cómo se trata un pago anterior a la factura. No aplicar un excedente a otro conviviente o servicio por inferencia.

**Ejemplo:** Ingresan ARS 15.000 para una factura de ARS 13.000: se cancela la obligación y quedan ARS 2.000 a favor o pendientes de aplicación según la política acordada.

**Criterio de aceptación:** Cada peso recibido queda explicado como cancelación, crédito o pendiente; no se pierden excedentes ni se asignan fondos solo por dirección, nombre parecido o imagen de comprobante.

#### AGR-013 — Devoluciones y reversos con sus dos efectos

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 10–14, 21–22, 53, 61, 75.

**Qué falta concretar y por qué:** La base menciona devoluciones y contracargos, pero falta el expediente que distingue corrección comercial, autorización y devolución efectiva de dinero.

**Propuesta:** Definir solicitud, causa, documento correctivo si corresponde, aprobación, cuenta a reintegrar, ejecución financiera y conciliación. Mantener vinculadas las operaciones originales y reversos. Evaluar efectos en promociones, mora, financiación y períodos cerrados.

**Ejemplo:** Emitir un crédito de ARS 2.000 no significa que el banco ya devolvió ARS 2.000. Un contracargo puede reabrir una obligación sin borrar el recibo original.

**Criterio de aceptación:** Se puede explicar por separado el saldo comercial y el reintegro pendiente/ejecutado; no se devuelve dos veces al repetir una orden.

#### AGR-014 — Vida completa de convenios y financiación

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 14, 23, 51, 68, 72.

**Qué falta concretar y por qué:** Existen planes y acuerdos, pero faltan reglas de sustitución de deuda, refinanciación, cancelación anticipada, incumplimiento y conciliación de cuotas.

**Propuesta:** Conservar obligaciones incluidas, capital, intereses y componentes del acuerdo; definir qué sigue exigible y qué queda reemplazado. Separar venta financiada y regularización. Precisar aplicación de pagos, cambios de tasa si fueran válidos y efecto de baja del servicio.

**Ejemplo:** Una deuda incluida en un convenio no puede seguir reclamándose íntegramente junto con todas sus cuotas como si fueran obligaciones adicionales.

**Criterio de aceptación:** Se concilian deuda de origen, pagos, capital pendiente y cargos del acuerdo sin doble exigencia ni cuotas huérfanas.

#### AGR-015 — Cierre y aprobación de cada ciclo de facturación

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 10, 51, 69, 75.

**Qué falta concretar y por qué:** Los lotes ya tienen validación y excepciones. Falta un cierre de ciclo que establezca si la cooperativa puede dar por terminado el período y quién acepta diferencias.

**Propuesta:** Definir universo congelado o versionado, totales esperados, simulación, aprobación y emisión. Clasificar cada seleccionado como emitido, observado, pendiente, excluido con causa o incierto, y cuadrar sus cantidades. Determinar reapertura y reportes de pendientes trasladados.

**Ejemplo:** Un lote de 100 con 98 emitidos y 2 pendientes puede terminar su ejecución, pero el período no debe aparentar 100 facturados.

**Criterio de aceptación:** El cierre produce un acta/reporte de control con responsables y excepciones; no exige ocultar errores para cerrar ni deja casos sin seguimiento.

#### AGR-016 — Ejecución fiable de acciones entre componentes

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 13, 47, 54, 58–59, 61, 69, 73.

**Qué falta concretar y por qué:** Se pide evitar duplicados, pero falta una política común de identidad de operación, entrega de mensajes y reparación de acciones incompletas.

**Propuesta:** Definir identificador de operación por tenant, reintento seguro, estados intermedios, correlación y resultado final. Registrar de forma durable el cambio y el trabajo pendiente para otros componentes; reintentar sin volver a aplicar lo ya confirmado. No exigir una tecnología específica ni presumir entrega única de mensajes.

**Ejemplo:** El servicio quedó instalado y se registró stock, pero falló crear el cargo: se repara el paso faltante y no se instala ni descuenta otra vez.

**Criterio de aceptación:** Un fallo después de confirmar un pago o activar un servicio puede recuperarse sin duplicar efectos; existe una bandeja técnica/operativa para casos no reparables automáticamente.

#### AGR-017 — Calendarios, prorrateos y cambios dentro del período

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 6, 51, 69, 72–73.

**Qué falta concretar y por qué:** Hay ejemplos de prorrateo y fechas, pero falta una especificación de fronteras que sirva para todos los motores de cálculo.

**Propuesta:** Definir zona horaria, inclusión de días, meses cortos, feriados, cambio de plan o titular, suspensión, promoción y redondeo por tramo. Diferenciar calendario de lectura, liquidación, emisión y vencimiento. Guardar cada tramo y su regla.

**Ejemplo:** Una promoción de tres ciclos puede consumir o no un primer ciclo parcial; cualquiera sea la decisión, debe estar definida y explicarse al socio.

**Criterio de aceptación:** Los casos de fin de mes, año bisiesto, cambios a mitad de período y carga tardía producen resultados aprobados y reproducibles, no dependientes del horario del servidor.

#### AGR-018 — Migración y cambio operativo desde el sistema anterior

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 31, 35, 64, 95.

**Qué falta concretar y por qué:** La migración está contemplada, pero falta una estrategia ejecutable para la primera cooperativa y su continuidad diaria.

**Propuesta:** Planificar inventario de fuentes, correspondencias, limpieza, ensayo completo, conciliación por servicio y titular, congelamiento de cambios, carga final, aceptación y plan de retorno. Definir qué historia se importa y qué queda disponible solo para consulta. No usar una misma persona/domicilio para fusionar contratos distintos.

**Ejemplo:** Un saldo inicial de ARS 8.000 debe conservar titular, contrato, documento/período y origen, además de coincidir con el total contable.

**Criterio de aceptación:** Antes de habilitar producción se cuadran socios, contratos activos, equipos, deuda y fondos; los cambios realizados después del corte no desaparecen si se debe volver al sistema anterior.

#### AGR-019 — Recuperación y restauración por tenant

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 29, 54, 60, 64.

**Qué falta concretar y por qué:** Ya se prevén copias y pruebas. Falta precisar pérdida admisible de datos, tiempo de recuperación y cómo restaurar una cooperativa sin retroceder las demás.

**Propuesta:** Acordar RPO —datos que se tolera perder— y RTO —tiempo objetivo de recuperación— por proceso, sin inventar cifras. Diseñar restauración selectiva, claves, adjuntos, auditoría y conciliación con terceros. Una restauración no puede deshacer una emisión fiscal o un cobro externo ya confirmado.

**Ejemplo:** Restaurar una copia anterior al último pago exige recuperar/conciliar ese pago desde evidencia verificable, sin volver a cobrarlo.

**Criterio de aceptación:** Un ensayo demuestra recuperación del tenant, integridad de documentos y conciliación externa; no basta comprobar que existe un archivo de backup.

#### AGR-020 — Capacidad, rendimiento y aislamiento de carga

**Prioridad:** P0. **Diagnóstico:** Pendiente ya identificado. **Base:** secciones 54, 58–60, 64, 69.

**Qué falta concretar y por qué:** No hay un perfil cuantificado de volumen y simultaneidad que permita elegir infraestructura y probar el servicio.

**Propuesta:** Relevar tenants, usuarios, contratos, documentos por ciclo, tamaño de archivos, mensajes, consultas BI y trabajos de fondo. Definir objetivos de respuesta y ventanas batch, límites por tenant y prioridades. Proponer separar trabajos pesados del uso interactivo según las mediciones.

**Ejemplo:** Un tenant exporta toda su historia mientras otro cobra en caja; la exportación no debe monopolizar recursos y bloquear la cobranza.

**Criterio de aceptación:** Se validan escenarios de carga representativos con métricas por tenant; las cifras acordadas son verificables y no se promete capacidad ilimitada.

#### AGR-021 — Operación de APIs y conectores, además de su desarrollo

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 13, 31, 59, 61, 79.

**Qué falta concretar y por qué:** Las APIs y mecanismos externos están definidos, pero falta un contrato operativo uniforme para fallos, cambios de esquema y vencimiento de credenciales.

**Propuesta:** Estandarizar códigos de error, correlación, límites, versiones, reintentos, revocación y manejo de indisponibilidad. Definir cola/bandeja de operaciones detenidas y reconciliación. Evaluar notificaciones a sistemas terceros solo si el caso lo necesita, sin hacer obligatorio un webhook para toda integración.

**Ejemplo:** Un certificado fiscal vence o cambia el formato del archivo: se identifica la integración afectada sin marcar como erróneos todos los socios.

**Criterio de aceptación:** Existe estado observable por conector y tenant, causa accionable y mecanismo de recuperación; los errores públicos no revelan secretos ni detalles internos. Puede evaluarse RFC 9457 como formato [R3].

#### AGR-022 — Contrato semántico para dashboards y BI

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 30, 54–55, 59, 75.

**Qué falta concretar y por qué:** La exposición de datos está cubierta, pero no todas las métricas tienen una definición única de fecha, universo y granularidad.

**Propuesta:** Crear un catálogo de indicadores con fórmula, nivel —persona, contrato, factura, pago—, fecha de corte, estado incluido y actualización. Definir exportaciones consistentes y separación real/simulado. Explicar qué significa Facturado, Cobrado, Acreditado y Saldo.

**Ejemplo:** Sumar un resumen de cuenta y sus facturas duplica la deuda; sumar filas por concepto puede duplicar el total de una factura.

**Criterio de aceptación:** El dashboard interno y BI reconcilian para el mismo universo y corte; un conjunto de datos indica granularidad y no mezcla simulaciones sin identificarlas.

#### AGR-023 — Expediente documental y conservación de evidencia

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 3, 17, 43, 47, 54, 61, 73, 90–91.

**Qué falta concretar y por qué:** Hay documentos, fotos y firma, pero falta un ciclo transversal de expediente, versión, sustitución, retención y descarga autorizada.

**Propuesta:** Clasificar documentos por finalidad y sensibilidad, relacionarlos con su operación, conservar versión aceptada y determinar quién puede verlos o sustituirlos. Definir retención y archivo según el marco que se releve, sin inventar plazos universales. Proteger descargas fuera de sesión y referencias compartidas.

**Ejemplo:** La foto de una instalación o la firma no debe seguir accesible mediante un enlace antiguo después de revocar una autorización.

**Criterio de aceptación:** Se identifica qué versión de documento respalda una acción y quién la consultó cuando ese acceso sea auditable; no se sustituyen evidencias históricas silenciosamente.

#### AGR-024 — Comunicaciones, entrega y constancias

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 26, 43, 47, 50, 52–54, 73.

**Qué falta concretar y por qué:** Se registra el resultado de mensajes, pero falta concretar cuándo una comunicación satisface un hito del proceso y qué hacer si falla.

**Propuesta:** Diferenciar creado, encolado, aceptado por proveedor, entregado y evidencia requerida. Definir destinatario verificado, versión de plantilla, reintento, alternativa de canal y revisión. Separar avisos comerciales, operativos y constancias reguladas; no declarar equivalencia legal de cualquier email.

**Ejemplo:** Una intimación o constancia de baja no se considera cumplida solo porque el proveedor de correo aceptó una solicitud.

**Criterio de aceptación:** El caso conserva contenido, destinatario, fechas y evidencia; un fallo de entrega produce acción y no queda oculto tras Mensaje enviado.

#### AGR-025 — Visitas y operación sin conexión con conflictos

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 8, 17, 50, 73, 77.

**Qué falta concretar y por qué:** El trabajo offline y las reservas están mencionados, pero falta resolver reservas simultáneas y cambios del servidor mientras el técnico está desconectado.

**Propuesta:** Definir reserva temporal y confirmada, capacidad del recurso, expiración, reprogramación y asignación. Versionar la tarea descargada y tratar conflictos al sincronizar. Registrar fecha real de intervención y fecha de recepción; no sobrescribir equipos o titulares ya modificados sin revisión.

**Ejemplo:** Un técnico instala un equipo offline mientras la orden fue cancelada en administración: se recibe la evidencia y se revisa el conflicto, en vez de borrar lo realizado o activar sin control.

**Criterio de aceptación:** No hay doble asignación del mismo equipo/turno por carrera; el conflicto conserva ambas evidencias y tiene un responsable de resolución.

#### AGR-026 — Valorización, activos y reparación de equipos

**Prioridad:** P1. **Diagnóstico:** Pendiente ya identificado. **Base:** secciones 7, 18, 20, 55, 73, 75, 78.

**Qué falta concretar y por qué:** La custodia física está bien desarrollada. Sigue pendiente la relación entre cantidad, costo, activo propio, bien vendido, depreciación y reparación.

**Propuesta:** Definir categorías de material/activo, método de valoración aprobado, costos de ingreso y series/lotes. Gestionar reparación, garantía, reemplazo, baja técnica y disposición. Si hay activo fijo, acordar amortización y su relación contable; no activar ese alcance por inferencia para todo artículo.

**Ejemplo:** Un módem propio en casa del socio no desaparece del patrimonio por salir del depósito; si se vende, su tratamiento comercial/contable es diferente.

**Criterio de aceptación:** Existencias, custodia y valoración pueden conciliarse; el traslado físico no duplica un gasto ni una venta y una sustitución conserva historia.

#### AGR-027 — Control de compra, recepción y factura de proveedor

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 19–21, 61, 75, 78.

**Qué falta concretar y por qué:** La vinculación compra-recepción-factura existe, pero faltan tolerancias, excepciones y autorización de diferencias.

**Propuesta:** Comparar cantidades y condiciones de orden, recepción y factura; definir entregas parciales, excesos, devolución, factura anticipada y servicios sin recepción material. Separar quién compra, recibe y aprueba pago y registrar el tratamiento de compras sin orden previa.

**Ejemplo:** Se pidieron diez medidores, llegaron seis y se facturaron diez: el sistema no paga automáticamente como si se hubieran recibido todos.

**Criterio de aceptación:** Cada diferencia está aprobada o pendiente con causa; el pago respeta lo autorizado y los movimientos de stock representan lo físicamente recibido.

#### AGR-028 — Presupuestos y compromisos de fondos

**Prioridad:** P2. **Diagnóstico:** Pendiente ya identificado. **Base:** secciones 19, 21–22, 55, 75.

**Qué falta concretar y por qué:** Hay proyección y se menciona presupuesto como extensión, pero no se distingue todavía crédito presupuestario, compromiso, obligación y pago.

**Propuesta:** Si el alcance ERP lo requiere, definir presupuestos por servicio/centro, versiones, compromisos de compra y comparación con devengado/pagado. Establecer límites de autorización, excepciones y liberación de compromisos al cancelar. Mantener este alcance como decisión explícita.

**Ejemplo:** Una compra aprobada compromete fondos aunque todavía no exista factura; al cancelarla se libera ese compromiso sin inventar un ingreso.

**Criterio de aceptación:** Los informes distinguen presupuesto, comprometido, devengado y pagado y no suman esos estados como gastos independientes.

#### AGR-029 — Capital y relación institucional del asociado

**Prioridad:** P1. **Diagnóstico:** Pendiente ya identificado. **Base:** secciones 3, 27, 75, 83.

**Qué falta concretar y por qué:** El módulo institucional menciona aportes, pero el detalle está muy por debajo del de servicios. Puede ser relevante para una cooperativa real.

**Propuesta:** Relevar suscripción/integración de capital, cuotas/aportes, estado institucional, documentación, egreso y eventual devolución según estatuto y marco aplicable. Mantener auxiliar institucional distinto de la deuda por servicios; no inventar obligaciones universales para todas las cooperativas.

**Ejemplo:** Dar de baja Internet no produce automáticamente egreso como asociado ni devolución de capital; cobrar un aporte no lo convierte en ingreso por consumo.

**Criterio de aceptación:** La cooperativa puede explicar relación institucional, capital y servicios por separado; las reglas económicas concretas tienen respaldo y validación contable.

#### AGR-030 — Gobierno de la IA y verificación de sus resultados

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 47, 54, 60, 65, 73, 91.

**Qué falta concretar y por qué:** La IA tiene límites bien señalados, pero faltan responsables, versiones, evaluación, evidencia y comportamiento ante falta de disponibilidad.

**Propuesta:** Registrar función permitida, fuente, ámbito de tenant, versión y resultado. Definir cuándo confirma una persona, cómo se corrige y cómo se atiende sin IA. Tratar mensajes y adjuntos como datos que no pueden cambiar permisos ni instrucciones del sistema. Evaluar errores por servicio y derivar casos sensibles.

**Ejemplo:** Una foto o mensaje que pida ignorar instrucciones no habilita al bot a consultar otro tenant; una clasificación incierta deja el caso para supervisión.

**Criterio de aceptación:** Se puede reconstruir qué sugirió la IA y qué decidió el operador; un fallo o respuesta insegura no bloquea la recepción del reclamo ni ejecuta cobros o decisiones clínicas.

#### AGR-031 — Moderación y ciclo de vida de la comunidad

**Prioridad:** P2. **Diagnóstico:** No explicitado. **Base:** secciones 26, 46, 65, 82.

**Qué falta concretar y por qué:** La publicación de noticias existe, pero falta definir participación, moderación y tratamiento de contenido denunciado si se habilitan comentarios o aportes.

**Propuesta:** Precisar si el muro es solo editorial o también participativo. Si hay participación, definir quién publica, audiencias, denuncia, ocultamiento, revisión, conservación y respuesta. Distinguir borrar contenido visible de eliminar evidencia; revisar datos personales en fotos y mensajes.

**Ejemplo:** Una publicación dirigida a empleados no se vuelve pública al copiar una plantilla o cambiar el perfil del autor.

**Criterio de aceptación:** No se habilitan comentarios solo por reutilizar Connectyx; las interacciones permitidas y la moderación tienen alcance y responsables definidos.

#### AGR-032 — Accesibilidad y autogestión tolerante a errores

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 25, 43, 50, 60, 65, 67, 73.

**Qué falta concretar y por qué:** La personalización visual y de términos no incluye todavía un objetivo verificable de accesibilidad y resolución de formularios incompletos.

**Propuesta:** Proponer WCAG 2.2 nivel AA como objetivo a validar [R1], junto con recorridos simples, teclado, foco, contraste, etiquetas, mensajes claros y alternativas al mapa. Guardar borradores y recuperar carga interrumpida. Validar que los colores del tenant y textos largos no rompan accesibilidad.

**Ejemplo:** Una persona puede solicitar un servicio o pagar sin operar un mapa; un error conserva los datos y señala qué falta sin perder todo el trámite.

**Criterio de aceptación:** Los recorridos esenciales se prueban con teclado y ayudas de acceso; existe alternativa al gesto táctil o componente inaccesible y no se afirma conformidad sin verificación.

#### AGR-033 — Ciclo de privacidad, conservación y salida de datos

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 29, 54, 59–60, 64, 77, 83, 90–91.

**Qué falta concretar y por qué:** Se protege el acceso, pero falta un ciclo transversal de finalidad, conservación, solicitudes de personas y salida de la cooperativa.

**Propuesta:** Inventariar categorías de datos, finalidad, responsables, acceso y plazo a validar. Diferenciar corrección de identidad, baja de usuario, archivo contractual y eliminación cuando proceda. Definir exportación de salida y tratamiento de copias/adjuntos; consultar el marco aplicable antes de fijar plazos o excepciones.

**Ejemplo:** Eliminar una cuenta de acceso no puede destruir una factura válida ni el registro de una inhumación; tampoco justifica conservar indefinidamente todo comentario sin criterio.

**Criterio de aceptación:** Existe una decisión documentada por categoría y un procedimiento de atención; las APIs de BI no exponen por defecto información sanitaria o documentos innecesarios.

#### AGR-034 — Soporte con acceso temporal y responsabilidad

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 42, 54, 60, 64.

**Qué falta concretar y por qué:** El soporte es un diferencial esperado, pero falta definir cómo interviene en datos de una cooperativa y cómo se controla esa capacidad.

**Propuesta:** Establecer solicitud, alcance mínimo, justificación, autorización cuando corresponda, vencimiento, registro y revocación. Diferenciar observar de operar; cualquier acción debe conservar identidad del agente de soporte y del tenant. No resolver mediante compartir contraseñas o impersonación sin rastro.

**Ejemplo:** Para corregir una configuración se habilita una intervención acotada al caso; no se concede a todo soporte acceso permanente a todas las cooperativas.

**Criterio de aceptación:** Cada intervención sensible tiene expediente, alcance y evidencia; vencida la autorización, el agente deja de acceder y el tenant puede consultar las actuaciones permitidas.

#### AGR-035 — Entornos, pruebas y evidencias antes de cada entrega

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 34, 39–40, 54–55, 60, 69, 73.

**Qué falta concretar y por qué:** Existen escenarios de prueba, pero no una política de entornos ni una matriz de verificación contra requisitos, versiones y riesgos.

**Propuesta:** Separar desarrollo, prueba y producción; identificar datos ficticios y bloquear emisiones/cobros reales desde pruebas. Crear un juego canónico de datos para dos tenants, titulares con domicilio compartido y casos de excepción. Vincular pruebas con requisitos, integraciones y versión liberada.

**Ejemplo:** Una simulación fiscal no utiliza credenciales productivas; actualizar la app no puede sustituir el precio de un contrato por un valor del ejemplo documental.

**Criterio de aceptación:** Cada entrega del piloto tiene evidencia de recorridos críticos, permisos negativos, conciliación e interrupción/reintento; un fallo relevante impide promover la versión hasta resolverlo.

#### AGR-036 — Plan de entrega y aceptación de la cooperativa piloto

**Prioridad:** P0. **Diagnóstico:** Pendiente ya identificado. **Base:** secciones 35, 37, 58, 64, 95.

**Qué falta concretar y por qué:** La visión abarca seis dominios y un ERP/CRM completos, pero falta convertirla en entregas aceptables sin intentar desarrollar todo simultáneamente.

**Propuesta:** Definir el alcance final y un piloto de una prestación concreta con una cooperativa real, sin retirar el resto del catálogo objetivo. Incluir plataforma básica, dos tenants de prueba para aislamiento y el recorrido completo elegido. Acordar responsables, documentación, capacitación, soporte de arranque y aceptación por rol.

**Ejemplo:** Un piloto de Internet debe completar contratación, visita, equipo, factura, pago y reclamo; un conjunto de pantallas sin ese ciclo no equivale a un servicio operativo.

**Criterio de aceptación:** Hay una matriz de capacidades incluidas/excluidas por entrega y criterios de aceptación firmables; ninguna fecha o presupuesto se estima como compromiso sin dimensionar el alcance.

### 102.5. Decisiones de diseño que recomiendo adoptar como hipótesis iniciales

Estas elecciones son propuestas razonadas para contrastar en arquitectura, no decisiones ya tomadas ni instrucciones para implementar un stack particular.

#### 102.5.1. Diseñar módulos con responsabilidades claras antes de distribuirlos

Usaría como punto de partida un diseño modular con interfaces explícitas y procesos de fondo, y compararía su implementación como aplicación modular o componentes separados según volumen, equipo, reutilización de Connectyx y operación. La existencia de ERP, CRM y comunidad no obliga por sí sola a desplegar muchos microservicios.

Una separación temprana que sí considero necesaria es la de responsabilidades: contratación decide sobre contratos; operación confirma actuaciones técnicas; facturación emite documentos; cuenta corriente aplica movimientos; pagos confirma transacciones; contabilidad registra su efecto; CRM coordina expedientes. Separación lógica no significa necesariamente bases o servidores diferentes.

#### 102.5.2. Identidad de acceso y relación de negocio separadas

Evaluaría identidad de acceso común con pertenencias a tenants y perfiles/roles recalculados al seleccionar ámbito. Los registros de personas/asociados de cada cooperativa permanecen privados y no se fusionan por correo o DNI sin una acción autorizada. Esta hipótesis facilita el caso de persona empleada en una cooperativa y socia de otra, sin otorgar acceso cruzado.

#### 102.5.3. Un auxiliar comercial trazable y resúmenes derivados

Mantendría movimientos e imputaciones como fuente del saldo comercial, con integridad definida. Las cuentas por servicio, la vista unificada y el resumen se generan desde esos registros. No guardaría totales editables independientes en cada pantalla que luego deban mantenerse iguales mediante parches.

Los planes contables y escenarios alternativos consumen operaciones identificadas y mantienen su ámbito. No es necesario adoptar una arquitectura completa de event sourcing para lograr esta trazabilidad: debe elegirse el mecanismo más sencillo que conserve integridad, historia y corrección.

#### 102.5.4. Configuración por versiones publicadas, no campos sueltos

Productos, conceptos, reglas, formularios y calendarios deben poder revisarse juntos cuando sus dependencias lo requieran. Copiar configuración entre tenants crea un borrador con correspondencias y validaciones; no un enlace vivo a las condiciones comerciales de la cooperativa origen. Los cambios menores de texto pueden tener un circuito más simple que los tarifarios.

#### 102.5.5. Automatización con estados observables

Mantendría explícitos Pendiente, Confirmado, Fallido y Resultado incierto para integraciones y actuaciones relevantes, con variantes según dominio. Una cola técnica no debería ser la única explicación de por qué un asociado sigue sin servicio o una factura parece impaga.

#### 102.5.6. Autogestión con una tarea principal clara por pantalla

El socio necesita entender qué tiene contratado, cuánto debe, qué está en trámite y qué puede hacer. Priorizaría Mis servicios, Mis facturas y pagos, Mis gestiones y Noticias; los nombres concretos se resuelven mediante el diccionario del tenant. Mostraría estados del trámite y del servicio por separado, y conservaría la alternativa pública de baja cuando corresponda al flujo ya definido.

El empleado necesita una bandeja con siguiente acción, responsable y contexto, no solo una lista de casos con estados. El supervisor necesita pendientes sin asignar y excepciones; el administrador, configuración y control. La jerarquía de navegación debe responder a esas tareas y luego aplicar el perfil de pantallas.

### 102.6. Cinco escenarios que conviene usar para verificar el diseño

#### ESC-01 — Pago excedente de un hermano

Dos hermanos tienen Internet en el mismo domicilio. A debe ARS 13.000 y paga ARS 15.000; B tiene deuda propia. Se confirman ARS 13.000 contra A y quedan ARS 2.000 a favor o pendientes de aplicación según la política aprobada. No se paga la deuda de B automáticamente. Cada movimiento se concilia con fondos e imputación. **Propuestas relacionadas:** AGR-006, 007, 011 y 012.

#### ESC-02 — Corrección recibida después de emitir

Se emitió una obligación por ARS 12.000 y después llega evidencia que requiere recalcularla en ARS 15.000. El sistema simula la diferencia de ARS 3.000, solicita el circuito de aprobación y documentación aplicable y conserva el original. No edita su total histórico ni crea otra obligación completa de ARS 15.000 sin resolver la primera. **Relacionadas:** AGR-009, 010, 011, 013 y 015.

#### ESC-03 — Instalación offline en conflicto

Una orden se modifica mientras el instalador está sin conexión. Este realizó una intervención y capturó firma/equipo. Al sincronizar se conserva la evidencia y se detecta el conflicto; se decide la situación contractual y financiera con responsabilidad explícita. No se duplica salida de equipo ni se borra lo realizado para igualar estados. **Relacionadas:** AGR-003, 010, 016, 023 y 025.

#### ESC-04 — Recuperación con operaciones externas posteriores a la copia

Se restaura información anterior a una confirmación de pago o emisión fiscal. El sistema recupera y concilia identificadores externos, controla sus efectos y reanuda lo pendiente; no envía otra emisión o cobro por considerar que el registro local faltante nunca existió. **Relacionadas:** AGR-011, 016, 018, 019 y 021.

#### ESC-05 — Cambio de condiciones en un período parcialmente procesado

Hay un ciclo con documentos ya emitidos, otros pendientes y una modificación tarifaria propuesta. El sistema mantiene el universo y versiones aplicadas, determina el efecto de vigencia sobre pendientes y conserva una explicación de ajustes. Las promociones y simulaciones no reescriben contratos o documentos por el hecho de volver a ejecutar el lote. **Relacionadas:** AGR-009, 010, 015, 017 y 035.

Los importes son ficticios y omiten tributos; las correcciones fiscales concretas se validan con el régimen ya previsto en la base.

### 102.7. Orden recomendado de trabajo

| Etapa | Trabajo concreto | Salida verificable | Condición para avanzar |
|---|---|---|---|
| A. Consolidación | Catálogo vigente, alcance final/piloto y decisiones abiertas | Requisitos y responsables con trazabilidad | No hay contradicciones bloqueantes sin dueño |
| B. Arquitectura funcional | Identidad, dominios, estados, datos y transacciones | Mapa de responsabilidades y contratos de interacción | Se pueden explicar fallos y recuperación del ciclo |
| C. Núcleo configurable | Tenant, seguridad, catálogo, diccionario y publicación | Dos tenants de prueba con aislamiento y configuración propia | No se mezclan datos ni se publican condiciones incompletas |
| D. Ciclo de servicio piloto | Contratación, actuación técnica, equipo y activación | Recorrido extremo a extremo con excepciones | El estado visible corresponde al hecho real |
| E. Circuito económico | Liquidación, emisión, saldo, cobro, ajustes y conciliación | Control de integridad y cierre de ciclo | Dinero y documentos cuadran por contrato/servicio |
| F. Preparación operativa | Migración, carga, seguridad, recuperación y capacitación | Ensayo de puesta en marcha y acta de aceptación | Se cumplen los criterios acordados y hay soporte de arranque |
| G. Extensión | Otros dominios, capacidades ERP y evolución | Incorporación por servicio con su evidencia | No se copia una regla sin validar su significado y ámbito |

No se asignan semanas, presupuesto, cantidad de desarrolladores ni stack porque no están dimensionados. Las etapas pueden solaparse cuando sus dependencias estén resueltas. El alcance final mantiene los servicios y módulos requeridos; la secuencia evita confundir visión completa con construcción simultánea.

### 102.8. Agenda de relevamiento para cerrar los faltantes

| Responsable a convocar | Decisiones a resolver | Material útil |
|---|---|---|
| Dirección de producto/plataforma | Alcance SaaS, responsabilidad operativa y entregas | Acuerdos comerciales y objetivos de servicio |
| Administrador del tenant | Roles/perfiles, configuración y circuitos | Organigrama, autorizaciones y casos reales |
| Comercial/atención | Contratación, representaciones y excepciones | Formularios, contratos y reclamos reales anonimizados |
| Facturación/contador | Fechas, reglas, documentos, ajustes y cierres | Cuadros, comprobantes, conciliaciones y criterios de registración |
| Caja/tesorería | Excedentes, no identificados, devoluciones y fondos | Rendiciones, extractos y procedimientos de arqueo |
| Operación técnica/depósito | Agenda, equipos, conflictos y devoluciones | Órdenes, inventario y actuaciones con contingencias |
| Secretaría institucional | Asociación, capital y egreso | Estatuto, registros y documentación validada |
| Soporte/seguridad | Recuperación, acceso de soporte e incidentes | Procedimientos y evidencia de pruebas |
| Responsables por servicio | Reglas específicas y documentos regulatorios | Los insumos ya identificados en la sección 95 de la base |

### 102.9. Cómo incorporar estas propuestas sin perder control del alcance

1. Revisar las AGR con los responsables de la cooperativa piloto y del producto.
2. Marcar cada propuesta como Aprobada, Ajustar, Diferida o No aplica, con motivo.
3. Para las aprobadas, escribir el requisito canónico y sus criterios en la especificación vigente, manteniendo el ID AGR como origen.
4. Asignar versión de entrega y dependencia; no convertir P0 en una promesa de entregar todo primero.
5. Actualizar modelos de datos, pantallas y pruebas afectados antes de programar el flujo.
6. Mantener el anexo de mensajes originales como evidencia y no sobrescribirlo con redacción interpretada.

#### Plantilla de decisión

| Campo | Contenido a completar |
|---|---|
| Propuesta | AGR-XXX |
| Decisión | Aprobada / Ajustar / Diferida / No aplica |
| Redacción acordada | Regla precisa y límite |
| Responsable | Rol y persona que valida |
| Servicio/tenant | Ámbito donde aplica |
| Dependencias | Otras decisiones o componentes |
| Aceptación | Ejemplo verificable y evidencia |
| Entrega | Versión o hito acordado |
| Fecha y motivo | Registro de decisión |

### 102.10. Referencias y límites de este análisis

La fuente principal es el documento base completo v0.14. Las referencias numéricas de cada AGR permiten ubicar lo ya existente. Este complemento no vuelve a afirmar vigencia de todas las normas de la base ni modifica sus fuentes: la configuración productiva sigue requiriendo los documentos específicos de cada cooperativa.

Se consultaron tres referencias primarias complementarias el 3 de noviembre de 2026:

- **[R1] W3C, WCAG 2.2:** https://www.w3.org/TR/WCAG22/ — referencia para proponer un objetivo verificable de accesibilidad; no se afirma conformidad del producto.
- **[R2] OWASP, Multi-Tenant Security Cheat Sheet:** https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html — referencia de revisión para extender el aislamiento a todos los componentes y probar límites; no impone una implementación concreta de base de datos.
- **[R3] IETF, RFC 9457, Problem Details for HTTP APIs:** https://www.rfc-editor.org/rfc/rfc9457.html — posible formato uniforme de errores; no es un sustituto del control interno ni una herramienta para publicar detalles sensibles de depuración.

Las propuestas se apoyan en análisis funcional y diseño del alcance recibido. No se ha inspeccionado el código local de Connectyx, una instalación de ProCoop ni una cooperativa piloto en funcionamiento. Se mantiene la diferencia entre hipótesis de diseño, ejemplos ficticios y decisiones aprobadas.

### 102.11. Control de la revisión

| Elemento | Resultado |
|---|---|
| Base examinada | Versión 0.14; 96 secciones y 20 mensajes originales |
| Extensión de la base | 52,960 palabras, aproximadamente; no es una estimación de esfuerzo |
| Propuestas | 36 fichas con trazabilidad, prioridad, ejemplo y aceptación |
| P0 / P1 / P2 | 17 / 16 / 3 |
| No explicitado / Detalle insuficiente / Pendiente ya identificado | 2 / 25 / 9 |
| Documento original | Conservado sin modificaciones |
| Estado del complemento | Versión 0.1, pendiente de validación |

La priorización ayuda a decidir qué cerrar y cuándo; no implica agregar todos los elementos a un presupuesto o entrega sin validar su necesidad.

## 103. Factura multiservicio y grupos de facturación — decisión de la versión 0.17

### 103.1. Decisión del solicitante y evidencia

El 3 de noviembre de 2026 el solicitante pidió mantener como válida la práctica del mercado de emitir varios servicios en un mismo comprobante. Se verificó en las fuentes publicadas:

| Sistema | Evidencia | Fuente |
|---|---|---|
| ProCoop | La jerarquía Persona–Titular–Cuenta–Grupo Factura–Servicio agrupa servicios en un mismo comprobante "97 - LIQ. DE SERV. B". | Relevamiento DEMO local, `procoop-relevamiento/README.md` |
| GSP (Solsoft) | "Se puede configurar la forma de liquidar los servicios en forma individual o agrupados en una misma factura armando grupos de liquidación […] y desarmándolos en el momento que la Cooperativa lo desee"; cada grupo puede tener talonario propio o numeración general. | [MER6] |
| Scapin | "Emisión en Lote por la Energía Eléctrica, los demás servicios que se incluyan en la misma factura (Internet, Cable TV, etc.)", más comprobantes individuales por servicios puntuales y agrupamiento de varios medidores en un titular. | [MER8] |

**Decisión:** el sistema admite dos modalidades de emisión, las dos válidas y configurables por cooperativa:

- **Separada:** un comprobante por servicio. Es la modalidad de FAC-002.
- **Agrupada:** un comprobante con varios servicios, mediante un grupo de facturación.

Esta sección **prevalece** sobre las frases anteriores que excluían una factura multiservicio, en las secciones 2, 10, 25, 44, 49, 51, 96, 97.10 y 99.4. FAC-002 se conserva como la modalidad separada. La cuenta corriente agrupada y el resumen de la sección 44 siguen disponibles en ambas modalidades.

### 103.2. Objetivo

Permitir que cada cooperativa siga facturando como está acostumbrada, ya sea con servicios agrupados en una factura o con facturas separadas. En los dos casos se conservan el detalle, el saldo y las protecciones de cada servicio.

### 103.3. Límite

- El grupo de facturación agrupa la **presentación fiscal y comercial**. No fusiona contratos, deudas ni protecciones de cada prestación. La mora, la suspensión y el corte se siguen evaluando por servicio, según la sección 68.
- No agrupa servicios de distintos titulares, CUIT o DNI, ni de distintos tenants.
- Si una norma, el regulador o la regla del propio servicio exige documento independiente, el servicio no puede incluirse en un grupo. Ejemplos: un concepto que no puede facturarse junto con la energía, o una prestación de otra razón social. El sistema lo bloquea al configurar el grupo y explica el motivo.
- La validez fiscal de cada combinación se confirma con el contador de la cooperativa y, cuando corresponda, con ARCA y el ente regulador. Incluye tipo de comprobante, punto de venta, alícuotas, percepciones y detalle exigido por RG 5746/2025.

### 103.4. Requisitos

| ID | Requisito | Criterio de aceptación |
|---|---|---|
| FAC-005 | El tenant configura la modalidad por defecto (separada o agrupada) y puede definir excepciones por servicio, cuenta o titular. | Dos tenants con modalidades distintas no se afectan entre sí; el cambio rige desde un período, sin alterar comprobantes emitidos. |
| FAC-006 | Grupo de facturación: titular, servicios y contratos incluidos, domicilio postal y de reparto, punto de venta o talonario propio o general, periodicidad común, trama de vencimientos y canal de entrega. | Un grupo se arma, modifica y desarma con vigencia y auditoría; desarmarlo no reabre períodos cerrados. |
| FAC-007 | Cada renglón del comprobante identifica servicio, contrato o suministro, período, lecturas, conceptos y tributos propios, con subtotal por servicio. | Desde el comprobante se reconstruye el cálculo de cada servicio por separado, igual que si se hubiera emitido solo. |
| FAC-008 | El auxiliar comercial registra una obligación por servicio dentro del comprobante agrupado. Pagos parciales se imputan con regla explícita: por antigüedad, por prioridad de servicio o elegida por el socio, según la política del tenant. | El saldo de cada servicio cuadra con el total del comprobante; un pago parcial no deja saldos sin asignar (AGR-011, AGR-012). |
| FAC-009 | Notas de crédito, débito y anulaciones de un comprobante agrupado referencian el original e indican el servicio afectado. | Corregir un servicio no altera los renglones de los demás. |
| FAC-010 | Servicios de periodicidad distinta se resuelven con una regla configurable: emitir lo vencido en el próximo comprobante del grupo, emitir aparte o prorratear (AGR-017). | El lote informa qué servicios quedaron fuera del grupo y por qué. |
| FAC-011 | Las vistas del socio, la landing y las APIs muestran el comprobante agrupado con apertura por servicio. | El socio ve cuánto corresponde a cada servicio y qué pagó de cada uno. |
| FAC-012 | Migración: cada Grupo Factura de ProCoop se convierte en un grupo de facturación equivalente, con conciliación de saldos por servicio. | El ensayo de migración reproduce los comprobantes de un período de ProCoop con diferencias explicadas (97.10, AGR-018). |

### 103.5. Caso de uso — CU-103

**Actor:** responsable de facturación de una cooperativa eléctrica que factura energía, internet y una tasa por cuenta de terceros.

1. Configura un grupo de facturación para el titular con los tres conceptos y el punto de venta de servicios públicos.
2. El ciclo de lectura y liquidación calcula cada servicio según su motor y sus reglas.
3. El lote emite un comprobante con tres bloques y subtotales, código de pago y los vencimientos de la trama.
4. El socio paga una parte. La política del tenant imputa primero la tasa vencida y luego la energía, e internet queda con saldo.
5. La mora de internet sigue su propio circuito sin afectar la energía.

**Datos de ejemplo ficticios:** energía ARS 28.000, internet ARS 15.000, tasa de bomberos ARS 1.200; total ARS 44.200; pago ARS 30.000.

### 103.6. Relación con el cupón de pago único

El cupón de pago único de MER-019 se mantiene para la modalidad separada. Permite pagar en un acto varias facturas del resumen, con la misma regla de imputación de FAC-008.

## 104. Personal y liquidación de sueldos — incorporación al alcance

### 104.1. Decisión y referencia de mercado

El 3 de noviembre de 2026 el solicitante pidió incluir sueldos en el alcance, tomando como referencia a GLM. Esta sección **amplía la sección 28**, que lo dejaba como integración opcional. La liquidación de sueldos pasa a ser un módulo del ERP. La importación desde un sistema laboral externo (CU-28) se mantiene como alternativa para cooperativas que no quieran migrar su liquidación.

Referencias de mercado:

- **GLMSUIT RRHH (GLM S.A.)** publica administración y liquidación de la nómina; evaluaciones de desempeño con múltiples tipos y evaluadores y definición de objetivos; sanciones y sumarios administrativos; accidentes laborales; juicios laborales; y workflow con bandeja única e historial de autorizaciones [MER19].
- **ProCoop** muestra novedades laborales y contables en una presentación de Fecescor de 2026 [F5].

### 104.2. Objetivo

Liquidar los haberes del personal en relación de dependencia de cada cooperativa, cumplir las obligaciones laborales y de la seguridad social, y registrar su efecto en contabilidad, centros de costos, tesorería y presupuesto, sin depender de otro sistema.

### 104.3. Límite

- Las reglas de cálculo de convenio, adicionales y escalas se parametrizan por tenant y se versionan con vigencia. El sistema no interpreta un convenio sin la validación del responsable laboral o el contador de la cooperativa.
- Las tablas oficiales comunes a todos los tenants las mantiene la plataforma como capacidad compartida, con fuente y vigencia, y cada cooperativa las adopta. Ejemplos: topes de aportes, deducciones y escalas de Ganancias, y formatos de ARCA.
- Los asociados de una cooperativa de trabajo no se liquidan como empleados en relación de dependencia. Sus retiros a cuenta de excedentes quedan fuera del módulo salvo decisión posterior.
- Los honorarios de consejeros y síndicos, si la asamblea los aprueba, se registran como pagos institucionales vinculados a la sección 27, no como sueldo.
- El acceso a datos laborales y de salud del personal (licencias médicas, accidentes, embargos) es restringido y auditado, según 97.1 y AGR-033.

### 104.4. Alcance funcional

| ID | Función | Detalle mínimo |
|---|---|---|
| SUE-001 | Legajo del empleado | Datos personales, CUIL, fecha de ingreso, categoría, convenio, obra social, ART, modalidad de contratación, centro de costo, cuenta bancaria de acreditación, familiares a cargo y documentación. |
| SUE-002 | Estructura laboral | Convenios, categorías, escalas por vigencia, puestos, jornadas y turnos, guardias, áreas y su relación con centros de costos (sección 75). |
| SUE-003 | Novedades del período | Horas extra, guardias, ausencias, licencias, vacaciones, adelantos, embargos, cuotas alimentarias y préstamos. Pueden originarse en partes de cuadrilla, órdenes de trabajo o flota (17, 73, MER-015). |
| SUE-004 | Conceptos y fórmulas | Remunerativos, no remunerativos y descuentos; fórmulas versionadas con simulación antes de publicar (AGR-009). |
| SUE-005 | Liquidaciones | Mensual o quincenal, SAC en dos cuotas (Ley 23.041), vacaciones, final por egreso con indemnizaciones de la Ley de Contrato de Trabajo 20.744 y liquidaciones complementarias o rectificativas. |
| SUE-006 | Ganancias de cuarta categoría | Retención según el régimen vigente (RG AFIP 4003/2017 y modificatorias), lectura de deducciones informadas en SIRADIG (F.572 web) y liquidación anual y final. |
| SUE-007 | Seguridad social y presentaciones | Aportes y contribuciones, declaración jurada F.931, Libro de Sueldos Digital (RG AFIP 3781/2015) y archivos de exportación en los formatos de ARCA vigentes. |
| SUE-008 | Recibos y portal del empleado | Recibo de haberes con el contenido de la LCT, entrega digital con constancia de recepción y firma cuando la normativa lo admita. El empleado consulta recibos, saldos de vacaciones y solicita licencias. La identidad usa la misma cuenta de acceso que un socio, sin mezclar datos (AGR-006). |
| SUE-009 | Pago de haberes | Archivo de acreditación bancaria, órdenes de pago a tesorería y conciliación del pago (sección 21). |
| SUE-010 | Contabilización | Asiento de devengamiento y pago por centro de costo, servicio y plan de cuentas del tenant, incluidos planes y escenarios simulados (sección 55). |
| SUE-011 | Certificaciones y egreso | Certificado de trabajo y de servicios y remuneraciones (art. 80 LCT), constancias y baja registral. |
| SUE-012 | Gestión de RRHH (referencia GLM) | Evaluaciones de desempeño y objetivos; sanciones y sumarios; accidentes laborales vinculados a ART; juicios laborales vinculados a la gestión judicial (MER-006). |
| SUE-013 | Aprobaciones | Novedades, liquidaciones y pagos pasan por el workflow de MER-012 con la separación de funciones liquidador, aprobador y tesorero. |
| SUE-014 | Reportes | Costo laboral por servicio y centro de costo, ausentismo, horas extra y proyección presupuestaria (AGR-028). |

### 104.5. Caso de uso — CU-104

**Actor:** responsable de personal, contador y tesorero de una cooperativa eléctrica.

1. Las horas de guardia de las cuadrillas se importan desde las órdenes de trabajo cerradas del mes.
2. El liquidador revisa novedades, simula la liquidación y compara con el período anterior.
3. El contador aprueba. Se generan recibos, el asiento por centro de costo (distribución, administración, internet), el archivo bancario y los archivos para ARCA.
4. Tesorería confirma la acreditación. Los empleados reciben el recibo en su portal y confirman la recepción.

**Datos de ejemplo ficticios:** 18 empleados, 2 con embargos, 120 horas de guardia; costo laboral total del período ARS 41.500.000.

### 104.6. Prioridad

Para la cooperativa piloto se propone confirmar si reemplaza su sistema laboral en la primera entrega o en la siguiente. Mientras tanto, CU-28 permite importar la liquidación existente sin bloquear el resto del ERP. El diseño del modelo de datos debe incluir el módulo desde el inicio, por su impacto en centros de costos, tesorería, identidad y permisos.

## 105. Mapa de soluciones a diseñar y especificar

Este documento, con el complemento de la sección 102, es el insumo para diseñar y especificar una o varias soluciones. La tabla asigna a cada solución su objetivo, su límite y las secciones de donde tomar requisitos. Que se listen por separado **no decide** si se despliegan como un sistema o como varios. Esa decisión corresponde a la revisión de arquitectura de la sección 58 y a la hipótesis 102.5.1.

| Solución | Objetivo | Límite | Insumos en este documento |
|---|---|---|---|
| **1. ERP de gestión de cooperativas y sus servicios** | Gestionar asociados, contratos, servicios, medición, facturación, operación técnica, compras, stock, contabilidad, capital y personal. | Es dueño de contratos, documentos, saldos y asientos; los demás componentes le solicitan acciones (AGR-002). | 3–11, 17–24, 27, 28, 32, 51, 55, 66, 69, 72–78, 81, 83–95, 97.3–97.7, 103, 104; MER-001 a MER-011, MER-015, MER-017, MER-018, MER-020; AGR-002, 003, 009–017, 025–029 |
| **2. CRM** | Atender pedidos, reclamos, solicitudes de alta y baja, comunicaciones y campañas, con chat, bot, IA y supervisión. | Coordina expedientes y muestra su avance; no cambia por sí solo contratos ni deudas. | 15, 16, 26, 47, 48, 53, 63; MER-012, MER-016; AGR-003, 023, 024, 030 |
| **3. Landing page y autogestión de cada tenant** | Presentar la cooperativa con su marca, noticias y servicios; permitir registro, contratación, consulta, pago y gestiones del socio. | Usa el diccionario y la marca del tenant; consume datos y acciones del ERP, el CRM y la cobranza. | 25, 43, 46, 50, 65, 67, 82; MER-018 autolectura; AGR-031, 032; 103 vista por servicio |
| **4. Plataforma SaaS** | Alta y ciclo de vida de tenants, identidad, roles y perfiles, seguridad, diccionario, catálogo y copia de servicios, dashboards de plataforma, comercialización, ambientes y recuperación. | Comparte capacidades sin mezclar datos de tenants; el soporte accede de forma temporal y auditada. | 29, 42, 45, 54, 58, 60, 64–66, 81, 97.8, 97.9, 97.11; AGR-004–009, 019, 020, 033–035; [R2] |
| **5. Sistema de cobranza** | Cuenta corriente, cajas, cobradores, canales de cobro, imputación, mora, convenios, garantías, incobrables y gestión judicial. | Registra cobros e imputaciones; la emisión de documentos pertenece a facturación. | 11–14, 68, 69, 97.3, 97.6; MER-005, MER-006, MER-007, MER-019; AGR-011–014; 103 (FAC-008) |
| **6. Pasarelas de pago** | Integrar tarjetas, billeteras, QR, débito automático, transferencias y redes de cobranza extrabancaria, con confirmación y conciliación. | No guarda datos completos de tarjetas: usa la tokenización del proveedor. Un pago incierto no se reenvía sin conciliar. | 12, 13, 97.6; MER-019; AGR-012, 013, 016, 021; ESC-01, ESC-04 |
| **7. Liquidación de impuestos** | Calcular tributos de cada comprobante, operar como agente de retención y percepción, preparar libros de IVA, regímenes informativos, rendiciones a ARCA y tributos provinciales y municipales, y las obligaciones de sueldos. | El sistema calcula y prepara; la presentación y la responsabilidad son del contribuyente y su contador. Las tablas normativas se versionan con fuente y vigencia. | 52, 61, 70, 97.2, 97.4; MER-001 (RG 5746/2025), MER-002, MER-014; 103.3; 104 (SUE-006, SUE-007) |
| **8. Sistema de APIs** | Exponer datos y acciones a terceros, apps, BI y organismos con tokens, límites, versiones, errores uniformes y monitoreo; recibir integraciones de lecturas, cobros y servicios externos. | Respeta el responsable de cada dato y el aislamiento por tenant; no crea un camino que evite controles del ERP. | 31, 59, 61; MER-013, MER-020 portabilidad; AGR-016, 021, 022; [R3] RFC 9457 |

**Núcleo compartido por todas las soluciones:** tenant, identidad y pertenencias, diccionario, auditoría, catálogo y configuración versionada, auxiliar comercial y eventos entre componentes. Cada solución lo consume y no lo duplica (102.5.1 a 102.5.5).

**Entregables sugeridos por solución en la etapa de diseño:** especificación de requisitos con IDs vigentes (AGR-001), modelo de datos con responsables, tablas de estados, contratos de API y eventos, pantallas por perfil y criterios de aceptación con los escenarios de 102.6. El orden de trabajo de 102.7 sirve de secuencia.

## 106. Pendientes de la versión 0.17

- [ ] Revisar las 36 propuestas AGR con la plantilla de 102.9 y registrar el estado de cada una.
- [ ] Confirmar con el contador de la cooperativa piloto qué servicios pueden ir en un mismo comprobante y con qué tipo de comprobante y punto de venta (103.3).
- [ ] Definir la regla de imputación por defecto de pagos parciales en comprobantes agrupados (FAC-008).
- [ ] Definir el tratamiento de servicios con periodicidad distinta dentro de un grupo (FAC-010).
- [ ] Relevar convenios colectivos, conceptos y novedades de la cooperativa piloto y decidir en qué entrega se reemplaza su sistema laboral (104.6).
- [ ] Ver una demo de GLMSUIT RRHH y de la liquidación de ProCoop para contrastar la profundidad de 104.4.
- [ ] Decidir en la revisión de arquitectura si las soluciones de la sección 105 se despliegan como un sistema modular o como componentes separados.

**Fuente agregada:**

- **[MER19] GLMSUIT RRHH:** https://www.glmsa.com.ar/solucion-rrhh — consultada el 3 de noviembre de 2026.

## 107. Anexo A — Mensajes originales del solicitante en este hilo

### Finalidad y criterio de transcripción

Se conservan los **20 mensajes del solicitante de este hilo hasta la petición de este anexo**, en el orden en que fueron enviados. Incluyen aportes funcionales, consultas, instrucciones de trabajo y reiteraciones. Los textos de los bloques se mantienen como fueron escritos, con sus errores de tipeo, mayúsculas, puntuación y repeticiones; los títulos externos solo facilitan su localización.

No se incluyen respuestas del asistente ni metadatos técnicos de contexto de Page. No se asignan horas individuales porque no están disponibles en el contenido de la conversación. La numeración P-001 a P-020 expresa orden, no prioridad o grado de aprobación.

El anexo preserva el relato de origen. Las interpretaciones, precisiones regulatorias, propuestas y pendientes se encuentran en el cuerpo del documento. Conservar una afirmación original no la convierte en un hecho verificado ni reemplaza las validaciones posteriores, especialmente sobre el competidor, costos de baja, facturación o suspensión de servicios.

### Índice de mensajes

| Referencia | Tema de localización |
|---|---|
| P-001 | Consulta inicial sobre ProCoop |
| P-002 | Investigación funcional exhaustiva como referencia |
| P-003 | Creación del documento Markdown |
| P-004 | Objetivo, límite, alcance, casos de uso y ejemplos |
| P-005 | Multitenancy, cooperativas, usuarios y roles |
| P-006 | Marca, aplicaciones y landing por cooperativa |
| P-007 | Facturación separada y agrupación de cuenta corriente |
| P-008 | Reiteración de marca, aplicaciones y landing |
| P-009 | Roles, perfiles, noticias, CRM y solicitudes de servicios |
| P-010 | Self service, tarifas, ciclo de servicio, auditoría y ERP |
| P-011 | Arquitectura, APIs, seguridad y organismos gubernamentales |
| P-012 | Diagnóstico competitivo y objetivo SaaS |
| P-013 | Diccionario de términos y etiquetas de interfaz |
| P-014 | Catálogo por tenant, registro, mora y facturación batch |
| P-015 | Productos, conceptos e instalación integral |
| P-016 | Centros de costos y circuito contable del ERP |
| P-017 | Calles, geolocalización, compras, stock y tesorería |
| P-018 | Copia de configuración y referencia de Connectyx |
| P-019 | Titularidad e investigación de particularidades por servicio |
| P-020 | Solicitud del presente anexo |

### P-001 — Consulta inicial sobre ProCoop

```text
el sistema procoop para que es?
```

### P-002 — Investigación funcional exhaustiva como referencia

```text
si esa, quieor saber muy exhaustivamente tdas sus funciones de manera detalalda, modulos, funciones etc porque quieor copiar ese sstema para hecer uno para mi
```

### P-003 — Creación del documento Markdown

```text
pongalo en un md asi vamos trabajano sobr eetsi
```

### P-004 — Objetivo, límite, alcance, casos de uso y ejemplos

```text
perfecto voy a empezar a darle info que me dieron, apr que vaya adecuando , lo premro que me pidiron es una descipcion de objetivo, limite y aclance de cada modulo y un ejemplo de caso de uso y ejemplo de por ejemplo servicios  ejemlo de cosas que menciona, precomoeltado de vaore sy cobos
```

### P-005 — Multitenancy, cooperativas, usuarios y roles

```text
seguire dandole info que me dieron apra completar este documento . me mencionaron lo siguiente alguans cosas obvas pero queor pnerla sene l docuemnto.   qUIEREN TENER UNA APLCIAICIO  QUE PERMITA TENER ROLES Y SUAURIOS ROLES COO ADMINSITRADOR DE LA PLATAFORMA Y CADA COOPERATIVA DEBE SER UN TENANT  QUE DBE TENER SU PROPIOS ASOCIADOS  POR LO TANTO ES UNA SOLUCION MULTTENANT.  cADA TENANT TIENE SUS ROLES INTERNOS DESD EADMINSITARDOR FIANJCIER CONTABLE ETC... Y RAMBIE USUARIO /SOCIOS  Y empleados de la cooperativa tenant.    ingeste y y vaya comletando ya sigo
```

### P-006 — Marca, aplicaciones y landing por cooperativa

```text
al dar de alta una coperativa comoteant en els isteam no solo ese tenen pasa a tener una app de administracion de su cooperativa sio qe pued egestioanr ahi su amrca, coore logos  etc splash logo de app movi logo de desktop logo de appp de empleados logo de app de socios  y debe disponibilizarle una landing configurable apra qe el tenant pueda ya disponibiziar de una landing desd eonde el socio pueda consultar eingresar a laappp y acticar o desctiavr o cnusltar servicioos
```

### P-007 — Facturación separada y agrupación de cuenta corriente

```text
Claramente la cooperativa (cada tenant) brinda servcios cada serviciso  se fatcura por separadao a cada socio y puede o no segun deifnan el tenatn agruparse en una cuenta corrienta aociado a un resumen d cuentaa
```

### P-008 — Reiteración de marca, aplicaciones y landing

```text
al dar de alta una coperativa comoteant en els isteam no solo ese tenen pasa a tener una app de administracion de su cooperativa sio qe pued egestioanr ahi su amrca, coore logos  etc splash logo de app movi logo de desktop logo de appp de empleados logo de app de socios  y debe disponibilizarle una landing configurable apra qe el tenant pueda ya disponibiziar de una landing desd eonde el socio pueda consultar eingresar a laappp y acticar o desctiavr o cnusltar servicioos
```

### P-009 — Roles, perfiles, noticias, CRM y solicitudes de servicios

```text
1 Claramente la cooperativa (cada tenant) brinda servcios cada serviciso  se fatcura por separadao a cada socio y puede o no segun deifnan el tenatn agruparse en una cuenta corrienta aociado a un resumen d cuentaa.  2-  Dbeemos tneer clarmanete uaurios roles  de usaurios para saber que funiones tiene periso sy perifles paa saber a que pantallas accede o no . El sistema dbee birndar la posibilad de mostrar oticas por la landingg y por la app del socio o del empleado como en connextyx en un muro de noticias.  3- el sistema debe contar con un CRM completo para que los socios o asociados puedan hacer pedidos o relcamos sobre sus sevricos con posibilidad de chat y bot y tambien con posibilidad de recibir un ticket que del otro lado empelados de la coperativa puedan resoler esos casos  esos casos debe poder gestionar con claridad el servicio la cuenta, el reaclmo ayduado por ia la foto y generar pedidos reclamos o oo que sea que entan a una bandeja de supervisores que luegod erivan a las areas correspondientes del aldo del empelado de la copeprativa.    4- el sistema debe permiti solcitiar el alta y baja de cualquiera de los servicios
```

### P-010 — Self service, tarifas, ciclo de servicio, auditoría y ERP

```text
1 Esperan que el sistema sea SELF SERVICE y que la cooperativa se pueda autogestioanr usando el sisteam y que los asociados puedan pedir internet (por ejmplo comos evriico) concertar visitas por la app, recibri a vsta , recibir el servicio controlar sus consumso su factura pagarla y hacer eclamos y dar de baja , todo el clcio. 2 es muy importante que el sisteam permita facturar el pxq del servio pero ademas tenga reglas de excepcion por grupos o por planes de manera talq ue podamos tener pwrsonas subisidcadas, personas con bonificaciones con descuentos con argos extras con impuestos expeciale sdle gobierno etc, todo cogiguranle para mmercadoa rgentino. averigue bien eso antes de redactarlo   3- el sistema debe permitir al suaurio realziara baja supspenison y reactiacion del sevico con ysin costo    4- el skstema debe tener un dashboar para el admin de latadorma y admin el tenan y alerta y posibiliadd de auditoria de cada cambio ene l siteama.   5- Se espera que el sistema actue como un completo ERP con planes de cuentas varios pr cooperativa para permitir simulaicones. .
```

### P-011 — Arquitectura, APIs, seguridad y organismos gubernamentales

```text
1 como vemos estamos esperando tener un sisteam de sgesiton de cooperativas con un erp un crm, entre otras. ponga eso como algo importante a reveer cuando definamos la qrquitectura (escriba especiaete esto)  2- el sstema debe contar con una API o varias APIS tokenizadas que emritan obtener informacón a las copperativas para sus dashbiard o herramientas de BI o para lo que quisieran.   (sus asociados y su info son de ellos)   3- el sitema debe teer los ultios estandares de seguriad infrmatica para evitar robo de informacion o acceso indebidos como doble factir de acute itacion, autenticacion via google y cambio d econtrasela, recuperacion de contraseña via 2FA  4- el sistem dbee tener un modulo (y aca vamos con otro sisteam) que permita interactuar con entes gubernamentales ya que actualcomo agete de retencion impositiva
```

### P-012 — Diagnóstico competitivo y objetivo SaaS

```text
Procoop es un super sisteam medio viejo y obsoleto que tien algunas fallas pero lo usa medio argentina. entonces es un competidor resptabel con debilidades. sus debildiad es son se instala e una maquina no esta en la nuve y jkosotros ebenos hacer un sisteam multitenta tn la nube.  Oblga a alas copperativa  poenr suspropios servidores yd ebemos hacer un sisteam SAAS. No tiene Api, no tiene una app para los socios o es muuuy pobre, la app no tiene la identidad d ela cooperativa , tiene fallas de seguriad y presenta mucha inifernfeic a ala hora de soporte. . Todo eso es su debidlaid sin embargo es nuestro objetivo tener todo eso en nuesto sisteam solucionado. escriba bien eso
```

### P-013 — Diccionario de términos y etiquetas de interfaz

```text
Un tea importannte desde el pricnipi del dearollo es que elsisteam tenga un diccioanrio de terminos aporeque cada cooperativa tien elenguaje diferente entonces no solo ditnificacion de marca con paleta de colores brnadin  y logos sino tambien labels el ui propios del tenant configurables
```

### P-014 — Catálogo por tenant, registro, mora y facturación batch

```text
1 Yengo al sisteam de gestion al idea es tener servicios disponibles como sisteam spropios par aofecer esos servicos a las cooperativas y poder prender y apagar servicoos . Por ejmplo la copperativa A tiene serico de agua , luz y cnetrio aprque mientras que ela coperativa B tiene servco de luz y gas pero no de agua ni cmenterio aprque y eso cnfigurable sobre la comunidad de usaurios . 2 Cualquier perosna puede darse de alta en el sistea como user de manera snecilla y contratar serviico disponble 3- Por ley cada servico se factura de manera seprada sin emabgo y opcional cada copperativa puede tener cuanta coriente separada por servico o cuenta corriente unidcfada par atoods los sevrico ys aber que cuando esta unficada y deja de apgar el kinimo se le caen todo los servicios (se bajan) y se cobra o no reactivacion. todo eso deb ser hiperconfigurale   4- Cada servicio deb tener uno o mas fechas d corte para uiversos de clientes y poder egenar rfacturas en forma bacth dejando aquelos qu e tenga n probelasm para ser facturados calramente camrcado (ekjmplo pide factura A pero no tiene CUIT)
```

### P-015 — Productos, conceptos e instalación integral

```text
1 Cada servicio debe manejar costos  derl servicio apra diferentes planes y productos . por ejempo si el ervicio es de inteneer debe haber elementos facturable so subservcios como costo de instalacion , fee mensual, bonificacion  por x meses, intereses de fiannciacion, subsidios , reglas etc. 2-Cuando se hace una ijnstalacion del srvicio puee implicar pa quien ahcer el sevcio concertar cita , msotar en la app del suer que ta yendo el sistalador, e, isataldor isnatalr y hacer firmar la isntalacion , descontar de stock el modem previamet easigando a ese instaladro, entregar una eneusta de satisfaccion al saociado y recibir ympsotprocear la encuesta de satifaccion y lanzar el servico desde ese dia con cobro prorrateado o no del servco d eamera adealntada o no
```

### P-016 — Centros de costos y circuito contable del ERP

```text
Como cualquier ERP debemos manejar centros d ecostos cuentas contable reale sy de simulacio  y todo lo relacionado a poder gestionar contable y poder facturar cobrar y dar seguineto las cuentas corrientes d elos asociados en sus diferentes servicios contratados
```

### P-017 — Calles, geolocalización, compras, stock y tesorería

```text
1 Un ñpunto que mencionaros es poder contar en el ssteam con el slstado de calles de todo el pais y que pueda verse la direcicon donde se brida elservicio con geolocalizacon y y con mapa de google map 2-El siteam ERP debe manejar ordenes de comora stock asocaidos a servicos  3- el ero debe manera cuenta corriente y facturas  cobranza y tesoreria
```

### P-018 — Copia de configuración y referencia de Connectyx

```text
1 entonces qued claro que los servicios de cada tenant se configuran por sepaarado y podriamos decidir copiar la configuracion del servicio 1 del tenant A e el servicio  1 del tenant B asi el tenantB  lanza ese servicio (lo disponobilzia a users de sus comunidad).   2- dado que hya muhco del concepto de comunidad quisiera que copie mucho de COnnextyx eso pogalo informando que se eneunctra en C:\Users\lenovo\Documents\CONNECTYX\connectia
```

### P-019 — Titularidad e investigación de particularidades por servicio

```text
1 Un servicio se asocia siempre a un dni o cuit pero un mismo seviio puede estar apra dos ndi o cuit en un mismo docimcilio ( dos hermanos contratan2 conexiones d einternert en la isma casa9 yc asa uno paga el suyo. . 2 Cada servicoltiee sus particularidades, aca le pido que me ayude nevstigando las particularidad de servicios de internt agua , luz en cordoba regulados pro ersep y epec, cementerios parque y otros que trnag las coperativas. espero aqui que haag un investigacion profunda y comelte con elllo el md 3- cada servicio tiene sus propias reglas de negocio , lista de prwcios bonificaciones descentos recargos , intereses etc. facturas, cuenta corriente parilar y genaral , cada servico tien e su porceos de soiitud y alta y proceos de baja y todos sus procesos iterno,   4- servicios que mencioanron electrico baco de sangre, agua, gas , cemeterio parque
```

### P-020 — Solicitud del presente anexo

```text
en este hilo del chat hubo muchos pormt con imoramcion tal cual e escuchi del suaurio, pdoriamos armar un aenxo que los inclouya a tods? (dentro del md) al final)
```
