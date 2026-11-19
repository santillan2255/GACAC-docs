# 29b — Casos de prueba de aceptación: olas O4 a O7

| Campo | Valor |
|---|---|
| Documento | 29b — Casos de prueba de aceptación y criterios por ola (parte 2 de 4) |
| Portada | [`29-criterios-y-casos-aceptacion-por-ola.md`](29-criterios-y-casos-aceptacion-por-ola.md) |
| Artefactos | 9.2 Casos de prueba de aceptación; 9.3 Criterios de aceptación por ola |
| Versión | 1.0 |
| Fecha | 05-11-2026 |
| Contenido | Sección 2.5 (O4), 2.6 (O5), 2.7 (O6) y 2.8 (O7, con los casos que habilitan la migración de LAG) |

Datos ficticios del juego canónico. Los importes del piloto Internet salen del *seed* único de M02 §18 y del ejemplo M04 §9.3.9 (HUE-SRV-05): INT-100 con abono ARS 15.000, PROMO-INT-50x3 e instalación ARS 20.000; activación el 21-11-2026; primer comprobante de diciembre ARS 30.000,00 neto. La diferencia con los valores que todavía figuran en ESC-SRV-INT-01 está registrada en la portada (observación OBS-25-04).

---

## 2.5 O4 — Tarifas, facturación, ARCA e impuestos básicos

### 2.5.1 Criterios de aceptación de O4

| ID | Condición de salida de O4 | Fuente |
|---|---|---|
| CS-O4-01 | Con el contrato de Ana activo, el cuadro tarifario publicado y el cargo de instalación, el lote del ciclo genera la prefactura; el operador compara contra el período anterior, resuelve excepciones, aprueba y emite. | `03` §8.2 |
| CS-O4-02 | El comprobante obtiene CAE en homologación (o simulador), el PDF con QR fiscal y código de barras se publica en el portal y se envía por correo simulado. | `03` §8.2 |
| CS-O4-03 | La explicación de cálculo es consultable desde el comprobante. | `03` §8.2 |
| CS-O4-04 | AC-01 (completo), AC-05 y AC-06 de `07` §15.1 aprobados. | `07` §15.1 |
| CS-O4-05 | Carga del lote de 20.000 contratos (PRO-O4-16) y prueba de capacidad del tenant grande (RNF-NFR-024) en `staging`. | `03` §8.8; `07` §11.3 |
| CS-O4-06 | Cero comprobantes duplicados y numeración fiscal sin huecos en todas las pruebas de la ola (defecto S1 si falla). | `07` §5.2, §12.1 |
| CS-O4-07 | Los 424 RF de O4 en `Implementado` o `Parcial`, `trace:check` sin faltantes, evidencia en `docs/evidencias/O4/` y casos P1 de CPA-O4 aprobados. | `03` R20 |

### 2.5.2 Casos de prueba de O4

#### CPA-O4-001 — Primer comprobante de Internet de Ana con CAE

| Campo | Valor |
|---|---|
| Cubre | CS-O4-01..03; ESC-SRV-INT-01; ESC-TAR-03, ESC-TAR-07; AC-01 y AC-05 de `07` |
| Precondiciones | Contrato de Ana activo desde el 21-11-2026 (CPA-O3-007); cuadro de INT-100 publicado; simulador de ARCA en homologación. |
| Datos ficticios | Abono ARS 15.000; PROMO-INT-50x3; instalación ARS 20.000; ciclo de diciembre de 2026 con fracción de noviembre (PRM-TAR-012). |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo (`@O4`, `@piloto-internet`) · `staging` |

```gherkin
Escenario: CPA-O4-001 Ana recibe su primera factura de Internet
  Dado el contrato de Ana activo desde el 21-11-2026 con INT-100 y PROMO-INT-50x3
  Cuando se prefactura, aprueba y emite el lote de diciembre
  Entonces el comprobante tiene neto ARS 30.000,00: fracción de noviembre 5.000,00 menos 2.500,00, diciembre 15.000,00 menos 7.500,00 e instalación 20.000,00
  Y la instalación aparece una sola vez
  Y el comprobante obtiene CAE y el PDF con QR fiscal y código de barras queda publicado en el portal de Ana
  Y Ana recibe el correo simulado con el comprobante
  Y la explicación de cálculo muestra versión del cuadro, regla de proporcional y promoción aplicadas
  Y el cuarto ciclo se calcula en ARS 15.000 sin promoción
```

#### CPA-O4-002 — Lote con excepciones, revisión y aprobación con segregación

| Campo | Valor |
|---|---|
| Cubre | CS-O4-01; M05 §17 criterios 1 y 9 |
| Precondiciones | Lote ficticio `LOTE-AG-DEMO-001` de 100 casos preparado. |
| Datos ficticios | `ITEM-099` (factura A sin CUIT) e `ITEM-100` (lectura inconsistente). |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O4-002 el lote emite los aptos y deja las excepciones a cargo
  Dado el lote "LOTE-AG-DEMO-001" con 100 casos
  Cuando se prefactura
  Entonces 98 casos quedan aptos y ITEM-099 e ITEM-100 quedan en la bandeja con responsable y próxima acción
  Cuando el preparador del lote intenta aprobarlo
  Entonces recibe 403 por segregación de funciones aunque tenga el permiso
  Cuando lo aprueba otro usuario y se emite
  Entonces el lote queda "issuedWithPending" con 98 emitidos y el cuadre muestra 100 = 98 + 2
```

#### CPA-O4-003 — Autorización masiva, correlatividad e idempotencia ante ARCA

| Campo | Valor |
|---|---|
| Cubre | M06 §17 escenarios 1, 7, 35, 36, 37; M05 §17 criterio 6 |
| Precondiciones | Punto de venta ficticio 0001 de LE-01 en homologación. |
| Datos ficticios | 100 comprobantes B ficticios del mismo punto y tipo. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Contrato e integración · `staging` |

```gherkin
Escenario: CPA-O4-003 autorizar 100 comprobantes sin huecos ni duplicados
  Dado 100 comprobantes B del mismo punto de venta y tipo
  Cuando se envían a autorizar
  Entonces se obtienen 100 CAE con numeración correlativa
  Y las observaciones de ARCA quedan en el comprobante que las recibió, no en la tanda
  Cuando dos workers toman el mismo punto y tipo
  Entonces el segundo espera el bloqueo
  Cuando un worker cae después de emitir un bloque y el job se reintenta
  Entonces no se crean comprobantes duplicados y la numeración no tiene huecos
  Y la conciliación diaria con un CAE distinto en ARCA abre una incidencia "toReconcile"
```

#### CPA-O4-004 — Respuesta incierta de ARCA

| Campo | Valor |
|---|---|
| Cubre | M06 §17 escenario 32; M05 §17 criterio 8; AC-06 de `07`; RNF-NFR-221 |
| Precondiciones | Simulador de ARCA configurado para cortar la respuesta después de recibir. |
| Datos ficticios | Comprobante ficticio FAC-DEMO-001. |
| Prioridad · Tipo | P1 · No funcional (confiabilidad) |
| Nivel · Ambiente | Contrato · `staging` |

```gherkin
Escenario: CPA-O4-004 un timeout después de enviar no duplica
  Dado FAC-DEMO-001 enviado a ARCA
  Cuando la respuesta no llega por timeout
  Entonces el comprobante queda "uncertain"
  Y se consulta el último autorizado antes de reintentar
  Y si coincide queda "authorized" con su CAE; si no, vuelve a la cola con el mismo número
  Y hay 0 duplicados
```

#### CPA-O4-005 — ARCA no disponible y certificado vencido

| Campo | Valor |
|---|---|
| Cubre | ESC-INT-01; M06 §17 escenarios 33, 34; M05 §17 criterio 7 |
| Precondiciones | Lote en emisión. |
| Datos ficticios | Certificado ficticio vencido de LE-01. |
| Prioridad · Tipo | P1 · No funcional (resiliencia) |
| Nivel · Ambiente | Contrato · `staging` |

```gherkin
Escenario: CPA-O4-005 un fallo sistémico pausa el lote sin culpar a los socios
  Dado un lote en emisión
  Cuando ARCA no está disponible y se agotan los reintentos
  Entonces se publica la falla global y el lote pasa a "paused" sin abrir excepciones por cliente
  Cuando el certificado está vencido
  Entonces no se envía nada, el tablero queda en rojo y ningún comprobante cambia de estado
  Cuando se restablece el servicio y se reanuda
  Entonces el lote continúa desde el bloque siguiente
```

#### CPA-O4-006 — Prevalidación fiscal

| Campo | Valor |
|---|---|
| Cubre | M06 §17 escenarios 2, 3, 4, 5, 6, 10, 12, 18, 19 |
| Precondiciones | Tablas normativas adoptadas por TEN-001. |
| Datos ficticios | Receptor ficticio sin CUIT para factura A; total de prueba ARS 0,02. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O4-006 lo que ARCA rechazaría se detiene antes
  Dado un comprobante A para un receptor sin CUIT
  Cuando se prevalida
  Entonces queda detenido y no se cambia a B ni a consumidor final
  Y una alícuota no mapeada detiene el comprobante en lugar de descartarse
  Y un padrón de IIBB vencido con el bloqueo activo impide calcular
  Y una tabla normativa publicada y no adoptada no se aplica en producción
  Y el libro IVA incluye las notas de crédito con signo negativo
```

#### CPA-O4-007 — CAEA en el día de vencimiento

| Campo | Valor |
|---|---|
| Cubre | M06 §17 escenario 8 |
| Precondiciones | CAEA ficticio vigente. |
| Datos ficticios | CAEA con vencimiento ficticio 30-11-2026. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O4-007 el CAEA vale hasta el fin del día de vencimiento
  Dado un CAEA que vence el 30-11-2026
  Cuando se usa el 30-11-2026 a las 23:00 y luego el 01-12-2026
  Entonces el primer uso es válido y el segundo se rechaza
```

#### CPA-O4-008 — Explicabilidad, determinismo, inmutabilidad y doble firma del motor tarifario

| Campo | Valor |
|---|---|
| Cubre | ESC-TAR-12, ESC-TAR-13, ESC-TAR-17, ESC-TAR-18, ESC-TAR-19 |
| Precondiciones | 1.000 cálculos emitidos en `staging`. |
| Datos ficticios | Cuadros ficticios de TEN-001. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración y propiedades · `ci` |

```gherkin
Escenario: CPA-O4-008 el cálculo es reproducible y las versiones no se editan
  Dado 1.000 cálculos emitidos
  Cuando se reproducen
  Entonces todos devuelven el mismo "resultHash" y la explicación coincide con el comprobante
  Cuando se intenta editar una versión activa o una regla publicada
  Entonces se rechaza con "TAR-E-IMMUTABLE" y solo se puede copiar a borrador
  Cuando el autor intenta aprobar su propio envío
  Entonces se rechaza y la segunda firma del mismo usuario no cuenta
  Y el redondeo con arrastre se confirma solo al emitir y se revierte al anular
```

#### CPA-O4-009 — Corrección posterior a la emisión (ESC-02)

| Campo | Valor |
|---|---|
| Cubre | ESC-02 (T08 §17.1); ESC-TAR-22; ESC-02 de M06 §17.5 |
| Precondiciones | Comprobante ficticio emitido por ARS 12.000 con CAE. |
| Datos ficticios | Versión corregida con vigencia pasada que lleva el importe a ARS 15.000. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O4-009 corregir una tarifa ya facturada
  Dado un comprobante emitido por ARS 12.000 con CAE
  Cuando se publica una versión corregida con vigencia pasada que da ARS 15.000
  Entonces las diferencias se simulan y la corrección requiere aprobación con documentación
  Y el comprobante original queda intacto
  Y el ajuste se emite como nota de débito por ARS 3.000
```

#### CPA-O4-010 — Cambio en un período parcialmente procesado (ESC-05)

| Campo | Valor |
|---|---|
| Cubre | ESC-05 (T08 §17.1); ESC-TAR-23, ESC-TAR-24; ESC-05 de M06 §17.5; M05 §17 criterio 4 |
| Precondiciones | Lote a mitad del cálculo. |
| Datos ficticios | Lote ficticio de 100 casos; versión nueva del cuadro publicada a mitad. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración · `staging` |

```gherkin
Escenario: CPA-O4-010 publicar una versión con un lote a medio procesar
  Dado un lote con parte de las cuentas ya calculadas
  Cuando se publica una nueva versión del cuadro
  Entonces las cuentas calculadas conservan su versión y las pendientes usan la nueva solo si su fecha de referencia lo indica
  Y reejecutar no reescribe documentos ni promociones
  Cuando se agrega una cuenta y se excluye otra
  Entonces se congela la versión 2 del universo, la diferencia muestra +1/−1 y solo esos casos se prefacturan
  Cuando el worker cae a mitad del lote
  Entonces se reanudan solo las cuentas pendientes
```

#### CPA-O4-011 — Errores de fórmula, conflictos y sandbox seguro

| Campo | Valor |
|---|---|
| Cubre | ESC-TAR-14, ESC-TAR-15, ESC-TAR-16, ESC-TAR-25 |
| Precondiciones | Reglas de prueba en borrador. |
| Datos ficticios | Regla con división por cero; fórmula con `__proto__`; dos descuentos excluyentes de igual prioridad. |
| Prioridad · Tipo | P1 · No funcional (seguridad y robustez) |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O4-011 una fórmula mala no rompe el lote ni el servidor
  Dado una regla con división por cero
  Cuando corre el lote
  Entonces esa cuenta se excluye con "TAR-E-FORMULA" y el lote continúa
  Y si los errores superan el porcentaje configurado el lote se detiene
  Y fórmulas con "constructor", "__proto__", "process" o "eval(" se rechazan o se cortan por límites sin ejecutar código
  Y dos descuentos excluyentes de igual prioridad dan "TAR-E-RULE-CONFLICT"
  Y una regla "una vez por cuenta en el lote" se aplica solo en el primer comprobante
```

#### CPA-O4-012 — Vencimientos, recargos, anulación y código de barras

| Campo | Valor |
|---|---|
| Cubre | M05 §17 criterios 5, 11, 12, 13, 15 |
| Precondiciones | Formato de código de barras publicado con vectores de prueba. |
| Datos ficticios | Total ARS 13.000 con trama de recargo 3 %; feriado ficticio de Córdoba. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O4-012 vencimientos y recargos impresos coinciden con el código
  Dado un total de ARS 13.000 con recargo fijo del 3 %
  Cuando se emite
  Entonces el segundo vencimiento es ARS 13.390 más el IVA del interés que calcula M06
  Y los importes impresos coinciden con los del código de barras
  Y un segundo vencimiento en domingo o feriado se rechaza con sugerencia del próximo hábil
  Y un comprobante autorizado no se anula: se sugiere nota de crédito
  Y un período ya facturado no se vuelve a facturar en otro lote
  Y un importe que no entra en el ancho del código usa el formato alternativo o una excepción, nunca un código truncado
```

#### CPA-O4-013 — Representación, distribución y portal

| Campo | Valor |
|---|---|
| Cubre | CS-O4-02; M05 §17 criterio 16; ESC-COM-22, ESC-COM-24, ESC-COM-38, ESC-COM-40, ESC-COM-76; PR-POR-23 |
| Precondiciones | Preferencias de entrega de Ana: correo y portal. |
| Datos ficticios | Correo rebotado ficticio `rebote@example.com`. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O4-013 el comprobante se publica solo cuando está autorizado
  Dado un comprobante en cola de autorización
  Cuando aún no tiene CAE
  Entonces no se envía ni se publica
  Cuando obtiene CAE
  Entonces se envía por correo y se publica en el portal según las preferencias del socio
  Y un correo rebotado genera la entrega en papel
```

#### CPA-O4-014 — Cuadre y cierre del ciclo

| Campo | Valor |
|---|---|
| Cubre | M05 §17 criterios 14, 17; ESC-TAR-29 |
| Precondiciones | Lote emitido y autorizado. |
| Datos ficticios | Lote ficticio del ciclo de diciembre de 2026. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración · `staging` |

```gherkin
Escenario: CPA-O4-014 cerrar el ciclo con cuadre exacto
  Dado el lote emitido
  Cuando se propone el acta de cierre
  Entonces la suma de obligaciones de cada comprobante es igual a su total
  Y la suma de renglones calculados es igual a la suma de comprobantes por concepto y alícuota
  Y un acta no balanceada no se puede enviar
  Y reabrir genera una versión 2 sin modificar la 1
```

#### CPA-O4-015 — Permisos y aislamiento de tarifas, facturación y fiscal

| Campo | Valor |
|---|---|
| Cubre | M05 §17 criterios 9, 10; ESC-TAR-20, ESC-TAR-21; M06 §17 escenarios 21 a 31 |
| Precondiciones | Usuarios de TEN-001 y TEN-002 con distintos permisos. |
| Datos ficticios | Lotes y comprobantes ficticios de ambos tenants con el mismo punto de venta 0001. |
| Prioridad · Tipo | P1 · No funcional (seguridad) |
| Nivel · Ambiente | Integración (`test:isolation`) · `ci` |

```gherkin
Escenario: CPA-O4-015 nadie factura, autoriza ni ve lo ajeno
  Dado un usuario de TEN-002
  Cuando consulta lotes, comprobantes, autorizaciones o cuadros de TEN-001 por ID
  Entonces recibe 404 sin revelar existencia
  Y los numeradores de ambos tenants son independientes aunque usen el mismo punto de venta
  Y la caché del ticket de acceso de ARCA nunca se comparte entre tenants
  Y un operador sin permiso de subir certificado, publicar cuadros o aprobar lotes recibe 403 auditado
  Y un tenant demo no puede operar contra producción
```

#### CPA-O4-016 — Baja sin cargo y equipo no devuelto

| Campo | Valor |
|---|---|
| Cubre | ESC-TAR-26, ESC-TAR-31 |
| Precondiciones | Contrato INT-100 ficticio dado de baja con ONT-DEMO-0003 no devuelta. |
| Datos ficticios | PRM-CAT-094 = 15 días; PRM-TAR-169 en `false` y luego `true` con regla aprobada. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O4-016 la baja no genera cargos indebidos
  Dado una regla cuyo disparador es la solicitud de baja
  Cuando se intenta crear el cargo
  Entonces la validación lo rechaza y solo se liquidan prestaciones devengadas hasta la baja
  Dado la ONT-DEMO-0003 no devuelta a los 15 días con el cargo por equipo apagado
  Entonces el evento de equipo no devuelto no genera cargo
  Dado el cargo habilitado con regla aprobada
  Entonces se genera un único cargo precargado, que se cancela si el equipo se devuelve antes de facturar
```

#### CPA-O4-017 — Entidades jurídicas, clases de ítem y aporte de capital en el comprobante

| Campo | Valor |
|---|---|
| Cubre | M05 §17 criterios 21, 22; M06 §17 escenarios 40, 46, 47, 48 |
| Precondiciones | TEN-001 con LE-01 y LE-02 (DEC-064). |
| Datos ficticios | Titular ficticio con ELE de LE-01 e Internet de LE-02; aporte de capital ARS 1.500; depósito en garantía ARS 50.000. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración · `staging` |

```gherkin
Escenario: CPA-O4-017 cada entidad emite lo suyo
  Dado un titular con servicios de LE-01 y LE-02 en modalidad agrupada
  Cuando se emite
  Entonces hay dos comprobantes con los numeradores de cada entidad y dos obligaciones
  Y un comprobante de LE-02 con punto de venta de LE-01 queda detenido con "legalEntityMismatch"
  Y el depósito en garantía sale en su bloque sin IVA ni percepciones
  Y el aporte de capital viaja como importe no gravado o fuera del comprobante según PRM-FIS-122
```

#### CPA-O4-018 — Carga del lote de facturación

| Campo | Valor |
|---|---|
| Cubre | CS-O4-05; ESC-TAR-30; RNF-NFR-010, RNF-NFR-024, RNF-NFR-145 |
| Precondiciones | `staging` con 20.000 contratos sintéticos (PRO-O4-16) y escenario de 50.000 cuentas para ESC-TAR-30. |
| Datos ficticios | Contratos sintéticos de TEN-001 con 2 servicios y 10 reglas. |
| Prioridad · Tipo | P1 · No funcional (rendimiento) |
| Nivel · Ambiente | Carga · `staging` |

```gherkin
Escenario: CPA-O4-018 el lote masivo cumple la ventana
  Dado 20.000 contratos sintéticos listos para facturar
  Cuando se ejecuta el lote completo
  Entonces se cumplen las metas de T08 para facturación masiva
  Y el cálculo de 50.000 cuentas con 2 servicios y 10 reglas no supera 2 s por cuenta en p95 con escalado horizontal
```

#### CPA-O4-019 — Factura agrupada con titulares distintos en la migración

| Campo | Valor |
|---|---|
| Cubre | ESC-MIG-02 (T07 §17.3) |
| Precondiciones | Snapshot MIG-DEMO-001 con un grupo de facturación que mezcla titulares. |
| Datos ficticios | Grupo ficticio con dos titulares distintos. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · ambiente aislado de migración |

```gherkin
Escenario: CPA-O4-019 no se migra un agrupamiento fiscalmente inválido
  Dado un grupo de facturación del origen con servicios de dos titulares
  Cuando corre el cargador de facturación
  Entonces el registro se rechaza con motivo fiscal y queda en el informe de rechazos
```

---

## 2.6 O5 — Cuenta corriente, cobranza, pasarelas, tesorería básica y núcleo contable

### 2.6.1 Criterios de aceptación de O5

| ID | Condición de salida de O5 | Fuente |
|---|---|---|
| CS-O5-01 | Ana paga su factura desde la PWA con la pasarela en modo prueba; el webhook firmado imputa el pago y emite el recibo. | `03` §9.2 |
| CS-O5-02 | La caja online se rinde a tesorería, se concilia con un extracto ficticio y se generan los asientos de facturación, cobranza y rendición en un plan de cuentas no oficial (DEC-069). | `03` §9.2 |
| CS-O5-03 | Un pago presencial en caja con recargo por mora calculado al cobrar; un cobro por ente recaudador con archivo ficticio. | `03` §9.2 |
| CS-O5-04 | Factura del SaaS emitida a la cooperativa (DEC-065). | `03` §9.2 |
| CS-O5-05 | AC-07, AC-08 y AC-15 de `07` §15.1 aprobados. | `07` §15.1 |
| CS-O5-06 | Conciliación diaria (JOB-NFR-06) sin diferencias en el dataset canónico tras el recorrido de la ola (criterio común 4 de `07` §11.2, aplicable desde O5). | `07` §11.2 |
| CS-O5-07 | Carga k6 de webhooks a 500/min (PRO-O5-14) y prueba de capacidad del tenant grande. | `03` §9.8; RNF-NFR-024 |
| CS-O5-08 | Los 468 RF de O5 en `Implementado` o `Parcial`, `trace:check` sin faltantes, evidencia en `docs/evidencias/O5/` y casos P1 de CPA-O5 aprobados. | `03` R20 |

### 2.6.2 Casos de prueba de O5

#### CPA-O5-001 — Pago online de Ana con webhook firmado

| Campo | Valor |
|---|---|
| Cubre | CS-O5-01; ESC-COB-R01, ESC-COB-R02, ESC-COB-R03; ESC-01 y ESC-04 de M07 §17.6; PR-POR-04, PR-POR-05; CA-INT-10; AC-07 de `07` |
| Precondiciones | Factura de Ana emitida (CPA-O4-001); pasarela simulada en modo prueba. |
| Datos ficticios | Pago de ARS 30.000 de Ana; intención de pago ficticia. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo (`@O5`, `@piloto-internet`) · `staging` |

```gherkin
Escenario: CPA-O5-001 un pago online se registra una sola vez
  Dado la factura de Ana en su PWA
  Cuando Ana paga con la pasarela en modo prueba
  Entonces la intención de pago se crea con clave de idempotencia
  Cuando el webhook firmado llega tres veces
  Entonces hay un solo cobro, dos eventos "ignored", un recibo y la obligación imputada
  Y el webhook se reconsulta al proveedor antes de imputar
  Cuando la creación de la intención da timeout
  Entonces la intención queda "uncertain", no se crea otra y el portal muestra "pago en verificación"
  Cuando Ana paga una obligación ya cancelada por otro medio
  Entonces el importe queda como saldo a favor no aplicado automáticamente y se abre una excepción
```

#### CPA-O5-002 — Rendición de caja online, conciliación bancaria y asientos

| Campo | Valor |
|---|---|
| Cubre | CS-O5-02; T-TES-01..07, T-TES-33; ESC-COB-C01, ESC-COB-C02, ESC-COB-C04; ESC-CON-13, ESC-CON-18; CA-INT-11 |
| Precondiciones | Cobros del día en la caja virtual de la pasarela; extracto ficticio. |
| Datos ficticios | Extracto ficticio con saldo 107.840 y línea "a acreditar" 7.840 (CU-21 de M14). |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O5-002 del cobro al asiento
  Dado la caja online del día con sus cobros
  Cuando se cierra y se rinde a tesorería
  Entonces hay una sola rendición aunque el evento de cierre se reenvíe
  Y una aceptación que falla a mitad no deja nada parcial
  Cuando se importa el extracto ficticio dos veces
  Entonces la segunda importación no crea líneas nuevas
  Y un grupo de conciliación descuadrado en 0,01 se rechaza
  Y un pago en el proveedor sin webhook lo incorpora la conciliación diaria
  Y un pago externo sin intención de pago queda en revisión
  Y un neto acreditado distinto del esperado queda en excepción y el día no se cierra sin comentario
  Y se generan los asientos de facturación, cobranza y rendición en el plan no oficial
  Y el auxiliar de deudores por servicio coincide con su cuenta de control
```

#### CPA-O5-003 — Cobro presencial con recargo por mora calculado al cobrar

| Campo | Valor |
|---|---|
| Cubre | CS-O5-03; ESC-MOR-08, ESC-MOR-12, ESC-MOR-14; ESC-COB-R05, ESC-COB-R08; ESC-COB-P01, ESC-COB-P02, ESC-COB-P07; ESC-UXD-18 |
| Precondiciones | Caja presencial con sesión abierta; obligación vencida de un socio ficticio. |
| Datos ficticios | Cajero `cajero.centro@example.com`; obligación vencida de ARS 10.000. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O5-003 la caja cobra con el recargo del momento
  Dado una obligación vencida
  Cuando el cajero la busca
  Entonces el sistema cotiza el recargo a la fecha de cobro y el importe coincide con la PWA y la consulta en ese instante
  Y un cajero sin permiso de cambiar recargo o de cobrar parcial recibe 403
  Y una dispensa del recargo exige aprobación del supervisor
  Y cobrar sin sesión abierta da 409
  Cuando el cajero hace doble clic en Confirmar
  Entonces hay un solo recibo
  Cuando dos cajeros cobran la misma obligación a la vez
  Entonces uno confirma y el otro recibe 409 y recotiza
```

#### CPA-O5-004 — Cobro por ente recaudador con archivo ficticio

| Campo | Valor |
|---|---|
| Cubre | CS-O5-03; ESC-COB-R04, ESC-COB-R07, ESC-COB-C03, ESC-COB-T03; ESC-INT-03; ESC-MOR-11 |
| Precondiciones | Ente ficticio con layout publicado. |
| Datos ficticios | Archivo de rendición ficticio de 1.000 líneas. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O5-004 una rendición de ente se aplica una vez
  Dado un archivo de rendición de 1.000 líneas
  Cuando el worker cae a mitad de la confirmación
  Entonces al reanudar se aplican solo las líneas no aplicadas
  Cuando se carga el mismo archivo con otro nombre
  Entonces se rechaza como duplicado
  Y un pie con cantidad distinta da advertencia o rechazo según el layout
  Y un archivo de otro tenant se rechaza por convenio
  Y un ente con "cobro al VTO1" no aplica recargo entre vencimientos
```

#### CPA-O5-005 — Pago excedente de un hermano (ESC-01)

| Campo | Valor |
|---|---|
| Cubre | ESC-01 (T08 §17.1); ESC-01 de M01 §17.5; ESC-01 de M06 §17.5; ESC-01 de M15 §17; T-TES-34; PR-POR-02; AC-08 de `07` |
| Precondiciones | Hermano A con deuda de ARS 13.000; Hermano B con deuda propia. |
| Datos ficticios | Hermano A, Hermano B, DIR-CASA-001; pago de ARS 15.000. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O5-005 el excedente no se aplica a otra persona
  Dado Hermano A con deuda de ARS 13.000 y Hermano B con deuda propia en el mismo domicilio
  Cuando Hermano A paga ARS 15.000
  Entonces se imputan 13.000 a sus obligaciones
  Y 2.000 quedan a favor o pendientes de aplicación en su cuenta
  Y nada se aplica a Hermano B
  Y contablemente el excedente es anticipo, nunca ingreso
  Y si se reintegra, tesorería lo ejecuta una sola vez
```

#### CPA-O5-006 — Restauración con operaciones externas posteriores (ESC-04)

| Campo | Valor |
|---|---|
| Cubre | ESC-04 (T01 §17.6; T08 §17.1); T-TES-35; AC-15 de `07`; RNF-NFR-037 |
| Precondiciones | Punto de restauración de TEN-001 a las 10:00. |
| Datos ficticios | Pago confirmado de ARS 15.000 y CAE obtenido a las 10:20; restauración a las 10:40. |
| Prioridad · Tipo | P1 · No funcional (respaldo y consistencia) |
| Nivel · Ambiente | Simulacro · `staging` |

```gherkin
Escenario: CPA-O5-006 restaurar no duplica cobros ni emisiones
  Dado un punto de restauración de las 10:00
  Y un pago de ARS 15.000 y un CAE obtenidos a las 10:20
  Cuando se restaura TEN-001 a las 10:40
  Entonces se concilian los identificadores externos del pago y del CAE
  Y no hay emisiones ni cobros duplicados
  Y un archivo bancario ya transmitido no se reenvía
```

#### CPA-O5-007 — Invariantes de la cuenta corriente

| Campo | Valor |
|---|---|
| Cubre | M07 §17.1 criterios 1 a 6; ESC-COB-R09; RNF-NFR-204, RNF-NFR-211 |
| Precondiciones | Juego canónico con cuentas, obligaciones y cobros. |
| Datos ficticios | Cuentas ficticias de TEN-001. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración y propiedades (≥ 10.000 casos) · `ci` |

```gherkin
Escenario: CPA-O5-007 el saldo siempre se deriva de los movimientos
  Dado cualquier secuencia generada de facturas, cobros, anulaciones y notas de crédito
  Cuando se recalcula el saldo
  Entonces coincide con la suma de movimientos e imputaciones y nunca se edita directamente
  Y cada peso cobrado queda como cancelación, crédito o pendiente
  Y un recibo que necesita CAE y no lo recibe queda "pendingFiscal" y el job lo completa
```

#### CPA-O5-008 — Asientos automáticos idempotentes y período cerrado

| Campo | Valor |
|---|---|
| Cubre | ESC-02 y ESC-03 de M15 §17; ESC-CON-06, ESC-CON-07, ESC-CON-08, ESC-CON-09, ESC-CON-10, ESC-CON-11, ESC-CON-12, ESC-CON-19, ESC-CON-20, ESC-CON-22 |
| Precondiciones | Reglas de asiento del plan no oficial publicadas. |
| Datos ficticios | Evento económico ficticio reenviado; diferencia de redondeo de 0,03. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O5-008 un evento genera un asiento y solo uno
  Dado un evento económico de cobranza
  Cuando el outbox lo reenvía
  Entonces existe un solo asiento
  Y un concepto sin cuenta deja el evento "pendingConfiguration" y bloquea el cierre del período
  Y un asiento automático no se edita: solo se revierte y reprocesa
  Y un asiento manual en período cerrado da 409
  Y la anulación de una factura de período cerrado genera contraasiento en el período abierto
  Y una diferencia de 0,03 va a la cuenta de redondeo y 0,06 con tolerancia 0,05 deja el evento en error
```

#### CPA-O5-009 — Permisos y aislamiento de cobranza, tesorería y contabilidad

| Campo | Valor |
|---|---|
| Cubre | ESC-COB-P03, ESC-COB-P04, ESC-COB-P05, ESC-COB-P06, ESC-COB-P08; ESC-COB-T01, ESC-COB-T02, ESC-COB-T04, ESC-COB-T05; T-TES-25, T-TES-27, T-TES-28, T-TES-29, T-TES-30; ESC-04 y ESC-05 de M15 §17; PR-POR-22 |
| Precondiciones | Usuarios con distintos permisos en TEN-001 y TEN-002. |
| Datos ficticios | Obligaciones, cuentas bancarias y asientos ficticios de ambos tenants. |
| Prioridad · Tipo | P1 · No funcional (seguridad) |
| Nivel · Ambiente | Integración (`test:isolation`) · `ci` |

```gherkin
Escenario: CPA-O5-009 nadie cobra, concilia ni contabiliza fuera de su permiso
  Dado usuarios de TEN-001 con permisos parciales y un usuario de TEN-002
  Cuando el usuario de TEN-002 consulta obligaciones, cuentas o asientos de TEN-001 por ID
  Entonces recibe 404
  Y un webhook con el slug de TEN-001 y la firma del conector de TEN-002 da 401
  Y quien solicitó una devolución no puede aprobarla
  Y un contador no puede imputar y un auxiliar no puede cerrar la conciliación
  Y un movimiento con fecha en período cerrado de tesorería se rechaza
  Y un layout de plataforma modificado por un tenant crea una copia del tenant
```

#### CPA-O5-010 — Motor de interés y recargos con conjunto dorado

| Campo | Valor |
|---|---|
| Cubre | ESC-MOR-01, ESC-MOR-02, ESC-MOR-03, ESC-MOR-04, ESC-MOR-05, ESC-MOR-06, ESC-MOR-07, ESC-MOR-09, ESC-MOR-10 |
| Precondiciones | Tablas de tasas ficticias publicadas. |
| Datos ficticios | Base ARS 10.000 con los parámetros de cada escenario de M08 §17. |
| Prioridad · Tipo | P1 · Funcional (regresión de cálculo) |
| Nivel · Ambiente | Unitarias y propiedades · `ci` |

```gherkin
Escenario: CPA-O5-010 el interés coincide con el conjunto dorado
  Dado una base de ARS 10.000 con tasa fija diaria del 0,1 % durante 30 días
  Cuando se calcula el interés
  Entonces el neto es ARS 300, el IVA ARS 63 para responsable inscripto y el total ARS 363
  Y los demás casos de ESC-MOR-02 a ESC-MOR-10 dan exactamente sus importes esperados
  Y falta de índice produce error de configuración sin valor por defecto
```

#### CPA-O5-011 — Cobro único con deuda de dos entidades jurídicas

| Campo | Valor |
|---|---|
| Cubre | ESC-COB-E01, ESC-COB-E02, ESC-COB-E03, ESC-COB-E06, ESC-COB-E07; ESC-CON-28, ESC-CON-29; M05 §17 criterio 24 |
| Precondiciones | Titular ficticio con ELE de LE-01 e Internet de LE-02. |
| Datos ficticios | Cobro de ARS 13.000: ARS 8.000 de LE-01 y ARS 5.000 de LE-02, con efectivo y tarjeta. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O5-011 un cobro, dos entidades, dos recibos
  Dado un titular con deuda de LE-01 por ARS 8.000 y de LE-02 por ARS 5.000
  Cuando paga ARS 13.000 en una sola operación de caja
  Entonces se emiten dos recibos, uno por entidad, con su propio numerador
  Y la suma de recibos es 13.000
  Y anular la operación anula los dos recibos
  Y cada entidad balancea su asiento por separado usando la cuenta entre entidades
  Y ningún saldo a favor de LE-01 se aplica a LE-02
```

#### CPA-O5-012 — Cambio de titularidad con deuda en la caja

| Campo | Valor |
|---|---|
| Cubre | ESC-COB-E04 |
| Precondiciones | Suministro ficticio con ARS 20.000 vencidos del titular saliente. |
| Datos ficticios | Titular saliente "Beto Demo" y entrante "Carla Demo". |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O5-012 la deuda queda con quien la generó
  Dado ARS 20.000 vencidos del titular saliente
  Cuando se da de alta el titular entrante
  Entonces la deuda queda en la cuenta del saliente y la cuenta del entrante empieza en 0
  Y la caja muestra la advertencia de deuda previa sin bloquear
```

#### CPA-O5-013 — Capital social integrado en la factura

| Campo | Valor |
|---|---|
| Cubre | ESC-INS-03, ESC-INS-04, ESC-INS-05, ESC-INS-22; ESC-T12-CAP-01, ESC-T12-CAP-02, ESC-T12-CAP-03, ESC-T12-CAP-04, ESC-T12-CAP-05 |
| Precondiciones | PRM-INS-017 = `inServiceInvoice`; concepto capitalizable de ARS 1.000. |
| Datos ficticios | Factura ficticia de ARS 20.000 con ARS 1.000 de cuota social. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración · `staging` |

```gherkin
Escenario: CPA-O5-013 el capital se integra en proporción al pago
  Dado una factura de ARS 20.000 con ARS 1.000 de cuota social
  Cuando se pagan ARS 8.000
  Entonces se integran ARS 400 y al pagar el saldo el total integrado es ARS 1.000 exactos
  Y si la factura se anula se crean contramovimientos y nada se borra
  Y un evento de emisión entregado dos veces genera un solo movimiento
  Y mientras corre la registración de capital sobre un universo, un lote sobre ese universo se bloquea
```

#### CPA-O5-014 — Claves heredadas de ProCoop en caja y entes (preparación de LAG)

| Campo | Valor |
|---|---|
| Cubre | ESC-MIG-05, ESC-MIG-06; CU-MIG-08, CU-MIG-09; RF-MIG-047, RF-MIG-083, RF-MIG-084 |
| Precondiciones | Alias heredados cargados desde el snapshot MIG-DEMO-001. |
| Datos ficticios | Alias A-000123 (T07 §18) y un código SIRO ficticio de 56 dígitos. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración · ambiente aislado de migración |

```gherkin
Escenario: CPA-O5-014 un pago con clave vieja encuentra su obligación
  Dado el alias heredado A-000123
  Cuando llega un pago por caja o por ente con esa clave
  Entonces el resolutor de claves heredadas lo asigna a la obligación correcta
  Cuando la clave es ambigua
  Entonces el pago queda no identificado con candidatos y no se elige uno al azar
```

#### CPA-O5-015 — Cobro y rendición de terceros

| Campo | Valor |
|---|---|
| Cubre | M06 §17 escenarios 16, 39; ESC-T12-TAS-02, ESC-T12-TAS-04, ESC-T12-TAS-05 |
| Precondiciones | Convenio ficticio "Municipalidad Demo — Tasa hospital". |
| Datos ficticios | Factura de ARS 21.000 con ARS 1.000 de terceros; pago de ARS 10.500; cobros del período ARS 50.000 y comisión 2 %. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · `staging` |

```gherkin
Escenario: CPA-O5-015 al tercero se le rinde solo lo cobrado
  Dado una factura de ARS 21.000 con ARS 1.000 de terceros
  Cuando el socio paga ARS 10.500
  Entonces se imputan ARS 500 al tercero por prorrata
  Cuando se aprueba la rendición del período con cobros por ARS 50.000 y comisión 2 %
  Entonces el neto a rendir es ARS 49.000 y tesorería recibe la orden de pago
  Y una rendición aprobada no se recalcula y un cobro ya rendido no se anula en caja
```

#### CPA-O5-016 — Factura del servicio SaaS a la cooperativa

| Campo | Valor |
|---|---|
| Cubre | CS-O5-04; DEC-065; RF-PLA-040 |
| Precondiciones | Contrato de licencia de TEN-001 con PLAN-ESTANDAR. |
| Datos ficticios | Período de licencia ficticio de diciembre de 2026. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O5-016 la plataforma factura su servicio con el mismo motor
  Dado la licencia de TEN-001 del período
  Cuando corre la facturación del SaaS
  Entonces se emite el comprobante a la cooperativa con el motor de facturación (DEC-065)
```

#### CPA-O5-017 — Carga de webhooks y caja concurrente

| Campo | Valor |
|---|---|
| Cubre | CS-O5-07; RNF-NFR-005, RNF-NFR-018, RNF-NFR-024, RNF-NFR-224 |
| Precondiciones | `staging` con volumen sintético. |
| Datos ficticios | Webhooks ficticios firmados con la clave de prueba. |
| Prioridad · Tipo | P1 · No funcional (rendimiento) |
| Nivel · Ambiente | Carga k6 · `staging` |

```gherkin
Escenario: CPA-O5-017 la cobranza soporta picos
  Dado el escenario k6 de webhooks de PRO-O5-14
  Cuando se envían 500 webhooks por minuto con repeticiones
  Entonces se cumplen las metas de T08 y no hay cobros duplicados
```

#### CPA-O5-018 — Pagar desde la PWA con accesibilidad

| Campo | Valor |
|---|---|
| Cubre | ESC-UXD-19; PR-POR-03, PR-POR-06; RNF-NFR-155 |
| Precondiciones | Ana con factura impaga. |
| Datos ficticios | Ana Demo. |
| Prioridad · Tipo | P2 · No funcional (accesibilidad) |
| Nivel · Ambiente | Extremo a extremo con axe · `staging` |

```gherkin
Escenario: CPA-O5-018 el recorrido de pago es accesible
  Dado Ana en la PWA con lector de pantalla
  Cuando consulta su deuda y paga
  Entonces el recorrido completo no tiene violaciones "serious" ni "critical"
```

---

## 2.7 O6 — Mora, corte, reconexión y convenios: cierre del piloto Internet

### 2.7.1 Criterios de aceptación de O6

| ID | Condición de salida de O6 | Fuente |
|---|---|---|
| CS-O6-01 | El piloto Internet completo de punta a punta (DEC-005) corre en un solo recorrido con ESC-SRV-INT-01..07. | `03` §10.2; `07` §11.3 |
| CS-O6-02 | La regresión extremo a extremo de O0 a O5 está verde. | `03` §10.8 |
| CS-O6-03 | AC-09 a AC-13 de `07` §15.1 aprobados. | `07` §15.1 |
| CS-O6-04 | Carga de la corrida de mora sobre 20.000 cuentas (PRO-O6-11) y prueba de capacidad del tenant grande. | `03` §10.8; RNF-NFR-024 |
| CS-O6-05 | Acta de aceptación de usuario del piloto Internet en `sandbox` con el tenant gemelo (RF-PLA-111). | `07` §4.2 |
| CS-O6-06 | Los 244 RF de O6 en `Implementado` o `Parcial`, `trace:check` sin faltantes, evidencia en `docs/evidencias/O6/` y casos P1 de CPA-O6 aprobados. | `03` R20 |

### 2.7.2 Casos de prueba de O6

#### CPA-O6-001 — Recorrido piloto Internet de punta a punta

| Campo | Valor |
|---|---|
| Cubre | CS-O6-01; ESC-SRV-INT-01 a ESC-SRV-INT-07 en un solo recorrido; PR-POR-01 |
| Precondiciones | Ambiente limpio con el juego canónico; integraciones en homologación o simulador. |
| Datos ficticios | Ana Demo, INT-100, INT-300, ONT-DEMO-0001..0010, Hermano A/B, BAJA-DEMO, SUS-DEMO-GRATIS, REACT-DEMO-GRATIS. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo (`@piloto-internet`) y aceptación de usuario · `staging` y `sandbox` |

```gherkin
Escenario: CPA-O6-001 el piloto Internet completo
  Dado el juego canónico cargado
  Cuando Ana solicita INT-100, se instala la ONT-DEMO-0001 y SmartOLT confirma la activación
  Entonces el contrato queda activo y el primer comprobante obtiene CAE (ESC-SRV-INT-01)
  Y un aprovisionamiento con timeout no activa ni factura (ESC-SRV-INT-02)
  Y un servicio suspendido por deuda se reconecta solo al confirmarse el pago (ESC-SRV-INT-03)
  Y la baja por el botón público no exige pago ni crea cargo (ESC-SRV-INT-04)
  Y el cambio a INT-300 rige desde el ciclo siguiente (ESC-SRV-INT-05)
  Y un operador de TEN-002 no ve el contrato ni la ONT (ESC-SRV-INT-06)
  Y la deuda de Hermano A no bloquea a Hermano B (ESC-SRV-INT-07)
```

#### CPA-O6-002 — Corrida de mora con evidencias y protecciones

| Campo | Valor |
|---|---|
| Cubre | ESC-MOR-13, ESC-MOR-15, ESC-MOR-16, ESC-MOR-17, ESC-MOR-18, ESC-MOR-23, ESC-MOR-24, ESC-MOR-25; ESC-COM-33 |
| Precondiciones | Política de mora publicada; 1.000 documentos vencidos ficticios. |
| Datos ficticios | Cuenta unificada con agua ARS 13.000, electricidad ARS 20.000 y cementerio ARS 7.000; pago ARS 8.000. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración y extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O6-002 la mora decide por servicio y respeta protecciones
  Dado 1.000 documentos vencidos con 2 destildados
  Cuando se genera la corrida
  Entonces hay cargos para 998 y reejecutar no duplica
  Y la deuda de cementerio no habilita suspender agua ni electricidad
  Y sin evidencia de intimación no hay suspensión y se crea una tarea de canal alternativo
  Y un suministro electrodependiente queda "blocked" y ningún rol puede crear el caso
  Y una entidad pública queda pendiente de aprobación
  Y un documento con reclamo de facturación abierto queda excluido
```

#### CPA-O6-003 — Ventana de ejecución y pago antes de ejecutar

| Campo | Valor |
|---|---|
| Cubre | ESC-MOR-19, ESC-MOR-20 |
| Precondiciones | Caso de mora aprobado. |
| Datos ficticios | Caso aprobado un viernes a las 16:00. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O6-003 no se corta fuera de horario ni después de pagar
  Dado un caso aprobado un viernes a las 16:00
  Cuando se programa
  Entonces queda para el lunes hábil dentro del horario
  Cuando el socio paga el total antes de ejecutar
  Entonces el caso se cancela, la OT se cancela y el contrato sigue activo
```

#### CPA-O6-004 — Suspensión restringida y reconexión automática

| Campo | Valor |
|---|---|
| Cubre | ESC-SRV-INT-03; ESC-MOR-21, ESC-MOR-22, ESC-MOR-26; ESC-CRM-06, ESC-CRM-07; ESC-05 de M02 §17.5; PR-POR-11; ESC-INT-05; AC-09 y AC-10 de `07` |
| Precondiciones | Servicio de Internet suspendido en modo `restricted` por deuda vencida. |
| Datos ficticios | SUS-DEMO-GRATIS, REACT-DEMO-GRATIS y REACT-DEMO-ARANCEL (deshabilitada). |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo (`@piloto-internet`) · `staging` |

```gherkin
Escenario: CPA-O6-004 pagar reconecta sin cargo
  Dado un servicio suspendido en modo "restricted"
  Cuando se confirma el pago de la deuda
  Entonces la reconexión es automática y sin cargo, vinculada al caso
  Cuando la integración remota responde error
  Entonces el caso queda "executionFailed" con reintentos y alerta, y el contrato sigue suspendido hasta el éxito
  Y con REACT-DEMO-ARANCEL deshabilitada solo se ofrece la reactivación gratuita
  Y el caso CRM no pasa a "reactivado" hasta que contratos confirma
```

#### CPA-O6-005 — Baja sin trabas por el botón público

| Campo | Valor |
|---|---|
| Cubre | ESC-SRV-INT-04; ESC-CRM-04, ESC-CRM-05; ESC-MOR-27; ESC-04 de M02 §17.5; PR-POR-07, PR-POR-08, PR-POR-20; ESC-STK-17, ESC-STK-18; NEG-CRM-07; AC-11 de `07` |
| Precondiciones | Ana con deuda vencida de ARS 12.500. |
| Datos ficticios | BAJA-DEMO; ONT-DEMO-0001. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo (`@piloto-internet`) · `staging` |

```gherkin
Escenario: CPA-O6-005 darse de baja no exige pagar
  Dado Ana con deuda vencida de ARS 12.500
  Cuando pide la baja de Internet por el formulario público sin iniciar sesión
  Entonces recibe un código en menos de 24 h
  Y no se le exige pagar ni se crea un cargo
  Y se genera la OT de retiro de la ONT
  Y la deuda sigue en cuenta corriente
  Y con solo el número de la baja un anónimo ve el estado general, nunca deuda ni datos del contrato
  Cuando el contrato se celebró por la app
  Entonces la baja también está en la app y la constancia llega por el mismo medio en 72 h o menos
```

#### CPA-O6-006 — Cambio de plan

| Campo | Valor |
|---|---|
| Cubre | ESC-SRV-INT-05; AC-12 de `07` |
| Precondiciones | Ana con INT-100 en ciclo mensual. |
| Datos ficticios | INT-300 "Fibra 300" ARS 22.000. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo (`@piloto-internet`) · `staging` |

```gherkin
Escenario: CPA-O6-006 el cambio de plan rige desde el ciclo siguiente
  Dado Ana con INT-100
  Cuando pide el cambio a INT-300 a mitad de mes
  Entonces el cambio rige desde el ciclo siguiente
  Y cada mes se factura con su plan
```

#### CPA-O6-007 — Convenio de pago desde la PWA con anticipo

| Campo | Valor |
|---|---|
| Cubre | ESC-MOR-29, ESC-MOR-30, ESC-MOR-35, ESC-MOR-36, ESC-MOR-37, ESC-MOR-38, ESC-MOR-46, ESC-MOR-47 |
| Precondiciones | Plan de financiación ficticio publicado. |
| Datos ficticios | ACU-001: ARS 60.000, anticipo 15.000, 3 cuotas de 15.000, 0 %. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O6-007 un convenio se activa con el anticipo
  Dado el convenio ACU-001 propuesto
  Cuando se paga el anticipo
  Entonces el convenio se activa, el origen queda sustituido y cuotas más anticipo suman 60.000
  Y un evento de pago entregado dos veces activa el convenio una sola vez
  Y un reintento con la misma clave devuelve el mismo convenio
  Cuando el anticipo no se paga en 3 días
  Entonces el convenio caduca y las obligaciones se restituyen sin intereses de financiación
  Y un documento ya incluido en otro convenio no se puede seleccionar
```

#### CPA-O6-008 — Sistemas de amortización, cancelación anticipada y caducidad

| Campo | Valor |
|---|---|
| Cubre | ESC-MOR-31, ESC-MOR-32, ESC-MOR-33, ESC-MOR-34 |
| Precondiciones | Planes francés y alemán ficticios. |
| Datos ficticios | Capital 100.000; TNA 60 % (5 % mensual); 6 cuotas. |
| Prioridad · Tipo | P1 · Funcional (regresión de cálculo) |
| Nivel · Ambiente | Unitarias y propiedades · `ci` |

```gherkin
Escenario: CPA-O6-008 las cuotas coinciden con el conjunto dorado
  Dado capital 100.000 al 5 % mensual en 6 cuotas
  Cuando se calcula con sistema francés
  Entonces la cuota es 19.701,75 y la última ajusta el redondeo
  Y con sistema alemán el capital por cuota es 16.666,67 y la última 16.666,65
  Y la cancelación tras 2 cuotas da saldo de capital 69.861,41 sin interés futuro
  Y 3 cuotas consecutivas impagas llevan a "defaulted" sin revivir la deuda original
```

#### CPA-O6-009 — Incobrables, prescripción y garantías

| Campo | Valor |
|---|---|
| Cubre | ESC-MOR-39, ESC-MOR-40, ESC-MOR-41 |
| Precondiciones | Regla de prescripción con plazo por defecto sin validación legal. |
| Datos ficticios | Deuda ficticia antigua; depósito en garantía de un contrato dado de baja. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O6-009 castigar deuda exige controles
  Dado una propuesta de incobrable
  Cuando la aprueba un solo usuario
  Entonces no se confirma; con doble control queda castigada y visible
  Y una corrida de prescripción no se aprueba hasta validar la regla
  Y el depósito en garantía se aplica a la deuda con aprobación y el remanente se devuelve
```

#### CPA-O6-010 — IA supervisada y bot de atención

| Campo | Valor |
|---|---|
| Cubre | ESC-CRM-12, ESC-CRM-13, ESC-CRM-14, ESC-CRM-15; NEG-CRM-09; TEN-CRM-04; escenario 34 de BASE (T08 §17.2) |
| Precondiciones | IA habilitada en TEN-001 con proveedor simulado. |
| Datos ficticios | Caso ficticio marcado sensible; teléfono ficticio no vinculado. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración y extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O6-010 la IA sugiere y la persona decide
  Dado la IA habilitada
  Cuando propone un subtipo con confianza 0,82
  Entonces se muestra como sugerencia y el caso no cambia hasta que el agente acepta
  Y un caso sensible no se envía al proveedor de IA
  Y el bot no muestra saldos a un teléfono no vinculado sin OTP
  Y el pedido de hablar con una persona pasa a la bandeja con la transcripción
  Y el contexto enviado a la IA contiene solo datos del tenant del caso
```

#### CPA-O6-011 — Atención omnicanal por WhatsApp

| Campo | Valor |
|---|---|
| Cubre | ESC-CRM-11; ESC-INT-04; RET-CRM-02; TEN-CRM-02; ESC-05 de M09 §17.5 |
| Precondiciones | Conector de WhatsApp simulado por número de cada tenant. |
| Datos ficticios | Mensaje ficticio con `externalMessageId` repetido. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Contrato · `staging` |

```gherkin
Escenario: CPA-O6-011 los mensajes llegan al tenant correcto una vez
  Dado un webhook de WhatsApp duplicado con el mismo "externalMessageId"
  Cuando se procesa
  Entonces se registra un solo mensaje
  Y un mensaje de un número de TEN-002 nunca crea casos en TEN-001
  Y un aviso rechazado queda "fallido" y se reintenta por canal alternativo
```

#### CPA-O6-012 — Permisos y aislamiento de mora y financiación

| Campo | Valor |
|---|---|
| Cubre | ESC-MOR-28, ESC-MOR-42, ESC-MOR-43, ESC-MOR-44, ESC-MOR-45 |
| Precondiciones | Usuarios con permisos parciales en TEN-001 y TEN-002. |
| Datos ficticios | Convenios ficticios de ambos tenants. |
| Prioridad · Tipo | P1 · No funcional (seguridad) |
| Nivel · Ambiente | Integración (`test:isolation`) · `ci` |

```gherkin
Escenario: CPA-O6-012 nadie aprueba cortes ni ve convenios ajenos
  Dado un cajero y un operador sin permiso de aprobar interrupciones
  Cuando intentan aprobar una corrida o un caso
  Entonces reciben 403 con detalle RFC 9457 y auditoría
  Y un socio que consulta un convenio ajeno recibe 404
  Y un tenant que edita una regla normativa recibe 403
```

#### CPA-O6-013 — Reintentos y conciliación de la mora

| Campo | Valor |
|---|---|
| Cubre | ESC-MOR-48, ESC-MOR-49, ESC-MOR-50; ESC-01 a ESC-05 de M08 §17.5 |
| Precondiciones | Corrida de mora en curso. |
| Datos ficticios | Resultado tardío de aprovisionamiento ficticio. |
| Prioridad · Tipo | P1 · No funcional (confiabilidad) |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O6-013 la mora se reanuda y concilia
  Dado JOB-MOR-01 en curso
  Cuando el worker cae
  Entonces reanuda por ítem sin cargos duplicados
  Y un resultado exitoso tardío después de cancelar el caso lo pasa a conflicto con ambas evidencias
  Y la conciliación diaria no tiene diferencias en el juego canónico y una diferencia forzada aparece en la bandeja
```

#### CPA-O6-014 — Convenios con varias entidades y cambio de titularidad

| Campo | Valor |
|---|---|
| Cubre | ESC-MOR-62, ESC-MOR-63 |
| Precondiciones | Socio con deuda de ELE (LE-01) e Internet (LE-02). |
| Datos ficticios | Deuda ficticia de ARS 20.000 del titular saliente. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O6-014 un convenio por entidad
  Dado deuda de dos entidades jurídicas
  Cuando se simula un convenio
  Entonces se propone uno por entidad y mezclar ambas falla con "mor/agreement-mixed-legal-entities"
  Y la deuda del titular saliente no genera mora al entrante salvo convenio firmado por este
```

#### CPA-O6-015 — Circular de deuda

| Campo | Valor |
|---|---|
| Cubre | ESC-CRM-23 |
| Precondiciones | Modelo de circular ficticio con mínimo ARS 20.000. |
| Datos ficticios | Cuentas ficticias con deudas de ARS 15.000 y ARS 25.000. |
| Prioridad · Tipo | P3 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O6-015 la circular incluye solo a quien supera el mínimo
  Dado un mínimo de ARS 20.000
  Cuando se genera la circular
  Entonces incluye la cuenta de ARS 25.000 y no la de ARS 15.000, con la deuda a la fecha de corte
```

#### CPA-O6-016 — Tablero de cierre del piloto y carga de la corrida de mora

| Campo | Valor |
|---|---|
| Cubre | CS-O6-04; tablero de cierre del piloto de T10 §17; RNF-NFR-016, RNF-NFR-024, RNF-NFR-145 |
| Precondiciones | `staging` con 20.000 cuentas sintéticas en mora. |
| Datos ficticios | Cuentas sintéticas de TEN-001. |
| Prioridad · Tipo | P1 · No funcional (rendimiento) |
| Nivel · Ambiente | Carga · `staging` |

```gherkin
Escenario: CPA-O6-016 la mora masiva cumple sus metas
  Dado 20.000 cuentas sintéticas en mora
  Cuando corre la evaluación y generación de mora
  Entonces se cumplen las metas de T08 aplicables
  Y el tablero de cierre del piloto muestra los indicadores del recorrido
```

#### CPA-O6-017 — Regresión de O0 a O5

| Campo | Valor |
|---|---|
| Cubre | CS-O6-02; todos los CPA de prioridad P1 de O0 a O5 |
| Precondiciones | Versión candidata de cierre de O6 desplegada en `staging`. |
| Datos ficticios | Juego canónico. |
| Prioridad · Tipo | P1 · Regresión |
| Nivel · Ambiente | Extremo a extremo (`@O0` a `@O5`) · `staging` |

```gherkin
Escenario: CPA-O6-017 lo anterior sigue funcionando
  Dado la versión candidata de O6
  Cuando corre la suite e2e con las etiquetas @O0 a @O5
  Entonces todos los casos P1 están verdes y no hay pruebas en cuarentena sin ticket
```

---

## 2.8 O7 — Servicios medidos (habilita la migración de LAG)

### 2.8.1 Criterios de aceptación de O7

| ID | Condición de salida de O7 | Fuente |
|---|---|---|
| CS-O7-01 | La ruta de lectura de energía se descarga en la app del lecturista; se toman lecturas sin conexión con foto y validación de rango; se sincroniza. | `03` §11.2 |
| CS-O7-02 | Los consumos se calculan y aprueban, con estimación para un medidor inaccesible. | `03` §11.2 |
| CS-O7-03 | El lote de energía factura con el cuadro medido con escalones. | `03` §11.2 |
| CS-O7-04 | Se genera el informe al regulador. | `03` §11.2 |
| CS-O7-05 | Una factura in situ se emite desde la app. | `03` §11.2 |
| CS-O7-06 | AC-16 (prepago), AC-17 (gas), AC-18 (Red Link) y AC-19 (SIRO) de `07` §15.2 aprobados en `staging` y en el ensayo E0 con la copia anonimizada de LAG. | `07` §15.2; `08` GO-22, GO-25, GO-27 |
| CS-O7-07 | Carga de 50.000 lecturas (PRO-O7-10) y prueba de capacidad del tenant grande. | `03` §11.8; RNF-NFR-024 |
| CS-O7-08 | Regresión del piloto Internet (`@piloto-internet`) verde sobre la versión de O7. | `07` §15.1 |
| CS-O7-09 | Los 298 RF de O7 (DEC-089; antes 274) en `Implementado` o `Parcial`, `trace:check` sin faltantes, evidencia en `docs/evidencias/O7/` y casos P1 de CPA-O7 aprobados. | `03` R20 |
| CS-O7-10 | Condición para iniciar el paralelo comercial de LAG (etapa E1, DEC-089): CS-O7-01 a CS-O7-09 cumplidos y los cargadores de O1 a O7 ejecutados en E0 con conciliación por dominio aprobada (T07 §17.2). El paralelo se acepta con la suite de la sección 3 (archivo `29c`). | DEC-089; T07 §9.6, §17.2, §17.4; `08` fases 3 y 4 |
| CS-O7-11 | Herramientas de migración comercial, paralelo y corte construidas en la ola (PRO-O7-11 y PRO-O7-12): los ciclos consecutivos de paralelo de energía y gas que pide PRM-MIG-041 (default 2) quedan aprobados sobre la base ficticia y el ensayo de corte comercial termina dentro de la ventana con conciliación de saldos y rollback probado (PRO-O7-10). | `03` §11.2 y §21.7; DEC-089 |

### 2.8.2 Casos de prueba de O7

#### CPA-O7-001 — Ruta de lectura de energía sin conexión con foto y rango

| Campo | Valor |
|---|---|
| Cubre | CS-O7-01; ESC-MED-03, ESC-MED-04, ESC-MED-05, ESC-MED-06, ESC-MED-07, ESC-MED-08, ESC-MED-35 |
| Precondiciones | Ruta ficticia de 30 suministros ELE-RES de TEN-001 generada; lecturista con la app instalada. |
| Datos ficticios | Lecturista `lecturista.a@example.com`; medidores ficticios con última lectura 10.000 kWh. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo (`@O7`) · `staging` |

```gherkin
Escenario: CPA-O7-001 tomar lecturas sin señal
  Dado la ruta descargada en la app del lecturista
  Cuando el lecturista pasa a modo sin conexión y toma las lecturas con foto
  Entonces cada lectura se valida contra el rango esperado en el dispositivo
  Y una lectura menor que la anterior abre la excepción bloqueante "lectura menor" sin consumo automático
  Y una lectura con fecha igual a la última validada se rechaza
  Y un medidor inaccesible genera la tarea "no leído" con motivo y nunca un consumo real 0
  Cuando sincroniza
  Entonces se registra cada lectura una sola vez y un reenvío responde "duplicate"
  Y una tarea reasignada mientras estaba sin conexión abre conflicto con ambas evidencias
```

#### CPA-O7-002 — Cálculo y aprobación de consumos con estimación

| Campo | Valor |
|---|---|
| Cubre | CS-O7-02; ESC-MED-12, ESC-MED-13, ESC-MED-29, ESC-MED-30, ESC-MED-31, ESC-MED-32, ESC-MED-33, ESC-MED-34 |
| Precondiciones | Lecturas sincronizadas de la ruta (CPA-O7-001), con un medidor inaccesible. |
| Datos ficticios | Lecturas de 10.000 y 10.250 kWh; medidor inaccesible con historia de 13 períodos. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración y extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O7-002 aprobar consumos y estimar el inaccesible
  Dado las lecturas validadas del lote
  Cuando se calculan los consumos
  Entonces el consumo de 10.000 a 10.250 es 250 kWh
  Y el inaccesible se estima con la cadena de respaldo y nunca divide por cero
  Y una lectura de 45 días en un período de 30 se divide en tramos que suman el original
  Y un consumo en servicio desconectado abre excepción bloqueante
  Y la conciliación del lote cuadra: lecturas validadas = consumos + no leídos + rechazadas
  Y un consumo ya facturado no se modifica: solo se ajusta
```

#### CPA-O7-003 — Lote de energía con cuadro medido escalonado

| Campo | Valor |
|---|---|
| Cubre | CS-O7-03; ESC-SRV-ELE-01; ESC-TAR-04, ESC-TAR-05, ESC-TAR-06; M05 §17 criterios 2 y 3 |
| Precondiciones | Consumos aprobados (CPA-O7-002); cuadro ELE-RES tipo 2 publicado. |
| Datos ficticios | Cargo fijo ARS 3.000; 0–150 kWh a ARS 100; más de 150 kWh a ARS 120. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo (`@O7`) · `staging` |

```gherkin
Escenario: CPA-O7-003 facturar energía por escalones
  Dado un consumo aprobado de 250 kWh
  Cuando se emite el lote de energía
  Entonces el neto es ARS 3.000 + 15.000 + 12.000 = ARS 30.000 con versión del cuadro y tramos en la traza
  Y el comprobante obtiene CAE
  Y bloque frente a tramos, factor por días y prorrateo dan los importes de los ejemplos 9.3.1 a 9.3.3 de M04
  Y un titular con energía, Internet y tasa en modalidad agrupada recibe un comprobante con tres bloques y tres obligaciones
  Y en modalidad separada recibe tres comprobantes sin renglones cruzados
```

#### CPA-O7-004 — Informe al regulador

| Campo | Valor |
|---|---|
| Cubre | CS-O7-04; M06 §17 escenario 9; RF-FIS-144, RF-FIS-147 |
| Precondiciones | Lote de energía del período emitido. |
| Datos ficticios | Período ficticio de diciembre de 2026. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O7-004 generar el informe al regulador
  Dado el lote de energía emitido
  Cuando se genera el informe al regulador del período
  Entonces el archivo se genera con los datos del período y queda disponible por URL firmada
  Y un CESP nuevo contenido dentro de otro se rechaza
```

#### CPA-O7-005 — Factura in situ desde la app

| Campo | Valor |
|---|---|
| Cubre | CS-O7-05; RF-FAC-108 |
| Precondiciones | Ruta con suministros configurados para facturación in situ. |
| Datos ficticios | Suministro ficticio ELE-RES con lectura del día. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O7-005 el lecturista entrega la factura en el domicilio
  Dado un suministro habilitado para facturación in situ
  Cuando el lecturista toma la lectura y emite desde la app
  Entonces se genera el comprobante del suministro y queda sincronizado sin duplicar al recuperar señal
```

#### CPA-O7-006 — Instalación de medidores y lotes de lectura

| Campo | Valor |
|---|---|
| Cubre | ESC-MED-01, ESC-MED-02, ESC-MED-09, ESC-MED-10, ESC-MED-11 |
| Precondiciones | Medidores ficticios en stock. |
| Datos ficticios | Medidor ficticio MED-DEMO-0001. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O7-006 un medidor está en un solo punto
  Dado MED-DEMO-0001 instalado en un punto
  Cuando se intenta instalarlo en otro
  Entonces se rechaza con "med.meter.alreadyInstalled"
  Y un punto no puede estar en dos lotes abiertos del período
  Y confirmar el mismo lote dos veces en paralelo da el mismo resultado que una sola vez
```

#### CPA-O7-007 — Prepago de LAG: recarga, token, retención y falla del proveedor

| Campo | Valor |
|---|---|
| Cubre | ESC-MED-22; ESC-SRV-ELE-06; RF-COB-075; RF-MED-113, RF-MED-114, RF-MED-115; AC-16 de `07`; GO-25 de `08` |
| Precondiciones | Sistema de prepago simulado configurado (RF-MED-103) con credenciales en bóveda; medidor prepago con deuda vencida y retención del 10 %. |
| Datos ficticios | Medidor prepago ficticio MED-PRE-DEMO-01; recarga de ARS 5.000 desde la app. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` y ensayo E0 (ambiente aislado de migración) |

```gherkin
Escenario: CPA-O7-007 una recarga prepaga cobrada siempre se resuelve
  Dado un medidor prepago con deuda vencida y retención del 10 %
  Cuando el proveedor valida la preventa y el socio recarga ARS 5.000 desde la app
  Entonces se acreditan ARS 4.500 de crédito y ARS 500 a cuenta de la deuda
  Y se entrega el token y se emite la factura de autogestión
  Cuando el proveedor rechaza la preventa
  Entonces no se cobra y se informa el motivo
  Cuando el proveedor falla al pedir el crédito o token después de cobrar
  Entonces la recarga queda en la bandeja
  Y el reintento no genera un segundo token
  Y la devolución, si se decide, la hace cuenta corriente
```

#### CPA-O7-008 — Gas de LAG: corrección de volumen y factor faltante

| Campo | Valor |
|---|---|
| Cubre | ESC-TAR-38, ESC-TAR-10; ESC-SRV-GAS-01, ESC-SRV-GAS-02, ESC-SRV-GAS-07; ESC-MED-17; DEC-085; AC-17 de `07`; GO-22 de `08` |
| Precondiciones | Contrato GAS-RES; consumo medido entregado por medición. |
| Datos ficticios | 100 m³ medidos, coeficiente 1; presión 1,02, temperatura 0,98, calórico 9.300, óptimo 9.300 (ESC-TAR-38). |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración y extremo a extremo · `staging` y ensayo E0 |

```gherkin
Escenario: CPA-O7-008 el gas se corrige en tarifas
  Dado 100 m³ medidos con el factor del período cargado
  Cuando se calcula el comprobante de gas
  Entonces el volumen corregido es 99,96 y la cantidad redondeada 100 m³
  Y la traza guarda medido, factores y resultado
  Cuando falta el factor del período
  Entonces el consumo queda aprobado con su volumen medido
  Y la cuenta se excluye con "TAR-E-GAS-FACTOR" y el lote continúa
  Y TEN-002 nunca usa el factor de TEN-001
```

#### CPA-O7-009 — Gas: habilitación, rehabilitación, urgencias y precinto

| Campo | Valor |
|---|---|
| Cubre | ESC-SRV-GAS-03, ESC-SRV-GAS-04, ESC-SRV-GAS-05, ESC-SRV-GAS-06 |
| Precondiciones | PRM-CAT-096 = true. |
| Datos ficticios | Solicitud ficticia sin DDJJ de artefactos; contrato suspendido con deuda de ARS 45.000. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O7-009 el gas exige controles de seguridad
  Dado una solicitud con certificado del matriculado y sin DDJJ de artefactos
  Cuando se intenta habilitar el contrato
  Entonces se rechaza hasta cargar la DDJJ y aprobar la inspección
  Cuando un contrato suspendido paga los ARS 45.000
  Entonces queda "Rehabilitación en trámite" con OT de inspección y vuelve a activo solo con la inspección aprobada
  Y el mensaje "huele a gas en la cocina" al bot abre urgencia crítica sin instrucciones técnicas
  Y un precinto roto abre un caso "suspected" sin recupero automático
```

#### CPA-O7-010 — Generación distribuida e inyección

| Campo | Valor |
|---|---|
| Cubre | ESC-SRV-ELE-02, ESC-SRV-ELE-03; ESC-TAR-11; ESC-MED-18 |
| Precondiciones | Suministro con contrato de generación distribuida vigente y otro sin contrato. |
| Datos ficticios | Demanda 300 kWh; inyección 120 kWh; inyección de 40 kWh sin contrato. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · `staging` |

```gherkin
Escenario: CPA-O7-010 la inyección se factura aparte
  Dado un suministro con contrato de generación distribuida
  Cuando se aprueba el balance de 300 kWh de demanda y 120 kWh de inyección
  Entonces hay dos operaciones separadas con su IVA y, si el total es negativo, queda un crédito para la próxima factura
  Y una inyección sin contrato abre excepción bloqueante y el servicio no se emite hasta resolverla
```

#### CPA-O7-011 — Factor de potencia y revisión previa de grandes usuarios

| Campo | Valor |
|---|---|
| Cubre | ESC-SRV-ELE-05; ESC-TAR-08; M05 §17 criterio 19 |
| Precondiciones | Gran usuario ficticio con reactiva alta; PRM-FAC-161 = `largeUser`. |
| Datos ficticios | Ejemplo M04 §9.3.6; lote ELE-C1 con 2 grandes usuarios ficticios. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · `staging` |

```gherkin
Escenario: CPA-O7-011 grandes usuarios con revisión
  Dado un gran usuario con reactiva alta
  Cuando se calcula el período
  Entonces el recargo por factor de potencia es ARS 209.677,42 con método y tope en la traza
  Y sin reactiva no hay renglón
  Y los grandes usuarios del lote quedan en revisión previa y el preparador del lote no puede revisarlos
```

#### CPA-O7-012 — Telemedición: corte y reconexión remotos idempotentes

| Campo | Valor |
|---|---|
| Cubre | ESC-SRV-ELE-07; ESC-MED-19, ESC-MED-20, ESC-MED-21, ESC-MED-28 |
| Precondiciones | Suministro telemedido con caso de mora `scheduled` en ventana hábil; proveedor de telemedición simulado. |
| Datos ficticios | Clave de idempotencia ficticia `tm-demo-0001`. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Contrato y extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O7-012 el corte remoto se envía una vez
  Dado un caso de mora programado en ventana hábil
  Cuando se ejecuta el corte remoto y se repite el comando con la misma clave
  Entonces hay un solo envío al proveedor y la misma respuesta
  Y un comando de corte sin orden de origen no se envía
  Cuando se confirma el pago
  Entonces se envía la reconexión con su clave de idempotencia
  Cuando el proveedor está caído al cerrar la OT
  Entonces la operación remota queda pendiente con reintentos, la salud del conector figura "down" y los socios no quedan marcados con error
  Y el estado de la OT en este caso se verifica según la aclaración pedida en OBS-25-09
  Y una lectura telemedida duplicada de una manual queda "redundant" con un solo consumo
```

#### CPA-O7-013 — Electrodependientes, ventana del regulador y deuda de terceros

| Campo | Valor |
|---|---|
| Cubre | ESC-SRV-ELE-04; ESC-MOR-55, ESC-MOR-58 |
| Precondiciones | Plantilla de ventana del regulador adoptada y validada. |
| Datos ficticios | Suministro electrodependiente con deuda de ARS 90.000; socio al día con ELE y ARS 1.500 vencidos de tasa municipal; orden de corte aprobada un jueves víspera de feriado. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración · `staging` |

```gherkin
Escenario: CPA-O7-013 no se corta a quien no corresponde
  Dado un suministro electrodependiente con deuda vencida
  Cuando corre la evaluación de mora
  Entonces queda "blocked" y ningún rol puede crear el caso de interrupción
  Y una deuda solo de tasa municipal da saldo elegible ARS 0 y no habilita el corte de ELE
  Y una orden aprobada en víspera de feriado se reprograma al siguiente día hábil dentro del horario
  Y con la plantilla sin validar el caso queda en revisión
```

#### CPA-O7-014 — Rendición Red Link con el formato de LAG

| Campo | Valor |
|---|---|
| Cubre | ESC-COB-L01, ESC-COB-L02, ESC-COB-L03; ESC-MIG-04; AC-18 de `07`; GO-27 de `08` |
| Precondiciones | Formato de rendición Red Link de LAG configurado en el perfil del conector; obligaciones migradas en E0. |
| Datos ficticios | Línea ficticia con identificador de 10 dígitos, servicio 02 y concepto 002; dos obligaciones impagas ficticias con el mismo importe. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Contrato y extremo a extremo · `staging` y ensayo E0 |

```gherkin
Escenario: CPA-O7-014 Red Link resuelve la cuenta y el servicio de gas
  Dado el formato Red Link de LAG configurado
  Cuando se importa una línea con identificador de 10 dígitos, servicio 02 y concepto 002
  Entonces se resuelve a la cuenta y al servicio de gas correctos
  Cuando hay dos obligaciones impagas con el mismo importe
  Entonces la línea queda no identificada con candidatos y no se elige la más reciente
  Cuando el identificador está fuera del rango entero
  Entonces solo esa línea se rechaza
  Y una cuenta de 10 o más dígitos se maneja como texto sin desborde
```

#### CPA-O7-015 — SIRO para facturas de ARS 100.000 o más

| Campo | Valor |
|---|---|
| Cubre | ESC-COB-L04; AC-19 de `07`; GO-27 de `08`; PA-COB-16 |
| Precondiciones | Rama SIRO de LAG configurada. |
| Datos ficticios | Factura ficticia de ARS 100.000,00. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Contrato · `staging` y ensayo E0 |

```gherkin
Escenario: CPA-O7-015 nunca un código de barras vacío
  Dado la rama SIRO de LAG
  Cuando se emite una factura de ARS 100.000 o más
  Entonces se informa el error y se usa el formato extendido o QR
  Y el comprobante nunca sale con el código de barras vacío
```

#### CPA-O7-016 — Agua y cloacas medidas y no medidas

| Campo | Valor |
|---|---|
| Cubre | ESC-SRV-AG-01 a ESC-SRV-AG-07; ESC-SRV-CLO-01, ESC-SRV-CLO-02, ESC-SRV-CLO-04, ESC-SRV-CLO-05; ESC-TAR-01, ESC-TAR-09, ESC-TAR-32, ESC-TAR-36; ESC-MED-14, ESC-MED-15, ESC-MED-16, ESC-MED-36; M05 §17 criterios 20 y 23; ESC-MOR-53, ESC-MOR-54; PR-POR-12, PR-POR-18 |
| Precondiciones | TAR-AG-2026-11 publicado; contratos AG y CLO ficticios. |
| Datos ficticios | Cargo fijo ARS 3.000 y ARS 500 por m³; TBM 1.000, zonal 0,9, coeficiente 1,1, cuota 500; consorcio con medidor general de 100 m³ y 4 unidades al 0,25. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O7-016 agua y cloacas se facturan con sus reglas
  Dado un contrato AG medido con 20 m³ aprobados
  Cuando se calcula
  Entonces el neto es ARS 13.000,00 con versión, fila y cantidad en la traza
  Y un contrato no medido tipo 15 da ARS 1.340,00 y con TBM 0 se excluye con "TAR-E-WATER-TBM"
  Y el consorcio distribuye 25 m³ por unidad con traza al medidor general
  Y una distribución cuyos porcentajes no suman 100 se rechaza
  Y CLO se prefactura después de su AG y vale 1.000 + 20 × 200 = ARS 5.000,00
  Y una cuenta cuyo AG está dado de baja queda bloqueada con "RELATED_SERVICE_MISSING" y el resto se emite
  Y una política de mora que interrumpe agua donde la concesión solo permite restringir no se puede guardar
  Y la mora de cloacas no genera interrupción ni restricción
  Y una autolectura fuera de rango queda "En revisión" sin consumo aprobado
```

#### CPA-O7-017 — Red GIS, obras y cuotas de obra

| Campo | Valor |
|---|---|
| Cubre | ESC-TEC-17, ESC-TEC-18, ESC-TEC-19, ESC-TEC-20; ESC-T12-OBR-01 a ESC-T12-OBR-07 |
| Precondiciones | Obra ficticia OBR-DEMO-01 de ARS 1.000.000 con base aprobada. |
| Datos ficticios | Frentistas ficticios de 10, 20, 30 y 40 m. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O7-017 prorratear una obra y facturar sus cuotas
  Dado OBR-DEMO-01 con base aprobada
  Cuando se aprueba el prorrateo por metros de frente
  Entonces los importes son ARS 100.000, 200.000, 300.000 y 400.000 y suman exactamente ARS 1.000.000
  Y la factura lleva "Cuota 1/10" por ARS 20.000 y al anularla el plan vuelve a 0 cuotas
  Y la última cuota cobra el saldo exacto
  Y sin base aprobada el prorrateo devuelve 422 y no se crea ningún contrato de obra
  Y un usuario de TEN-002 no ve la obra
```

#### CPA-O7-018 — Permisos y aislamiento de medición

| Campo | Valor |
|---|---|
| Cubre | ESC-MED-23, ESC-MED-24, ESC-MED-25, ESC-MED-26, ESC-MED-27 |
| Precondiciones | Lecturistas y operadores con permisos parciales en TEN-001 y TEN-002. |
| Datos ficticios | Rutas y lecturas ficticias de ambos tenants. |
| Prioridad · Tipo | P1 · No funcional (seguridad) |
| Nivel · Ambiente | Integración (`test:isolation`) · `ci` |

```gherkin
Escenario: CPA-O7-018 cada uno ve y aprueba lo suyo
  Dado un lecturista de TEN-001
  Cuando consulta tareas de otro lecturista
  Entonces recibe 403
  Y un usuario de TEN-002 que consulta lecturas de TEN-001 recibe 404
  Y un operador sin permiso de aprobar consumos recibe 403
  Y quien creó un ajuste no puede aprobarlo con doble control activo
```

#### CPA-O7-019 — Carga de 50.000 lecturas

| Campo | Valor |
|---|---|
| Cubre | CS-O7-07; RNF-NFR-024, RNF-NFR-145 |
| Precondiciones | `staging` con 50.000 suministros sintéticos. |
| Datos ficticios | Lecturas sintéticas generadas por el seed de volumen. |
| Prioridad · Tipo | P1 · No funcional (rendimiento) |
| Nivel · Ambiente | Carga · `staging` |

```gherkin
Escenario: CPA-O7-019 la ingesta masiva de lecturas cumple sus metas
  Dado 50.000 lecturas sintéticas
  Cuando se ingieren y calculan los consumos
  Entonces se cumplen las metas de T08 aplicables y el informe queda en "docs/evidencias/O7/"
```

#### CPA-O7-020 — Regresión del piloto Internet sobre la versión de O7

| Campo | Valor |
|---|---|
| Cubre | CS-O7-08; CPA-O6-001 |
| Precondiciones | Versión candidata de cierre de O7 en `staging`. |
| Datos ficticios | Juego canónico. |
| Prioridad · Tipo | P1 · Regresión |
| Nivel · Ambiente | Extremo a extremo (`@piloto-internet`) · `staging` |

```gherkin
Escenario: CPA-O7-020 los servicios medidos no rompen el piloto Internet
  Dado la versión candidata de O7
  Cuando corre la suite "@piloto-internet"
  Entonces todos sus casos están verdes
```

#### CPA-O7-021 — Alumbrado vinculado a electricidad y tasas de terceros

| Campo | Valor |
|---|---|
| Cubre | ESC-SRV-ALU-01, ESC-SRV-ALU-02, ESC-SRV-ALU-03, ESC-SRV-ALU-04, ESC-SRV-ALU-06, ESC-SRV-ALU-07; ESC-TAR-13 (regresión) |
| Precondiciones | Regla ELE → ALU configurada con fundamento normativo ficticio (ordenanza 100/2026). |
| Datos ficticios | Contrato ELE-RES con 250 kWh; regla `tasa_alumbrado` = consumo × 0,85; beneficio social 50 %. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · `staging` |

```gherkin
Escenario: CPA-O7-021 el alumbrado acompaña a la electricidad
  Dado una regla ELE → ALU en modo "create" con fundamento normativo
  Cuando se da de alta un contrato ELE-RES en la localidad alcanzada
  Entonces se crea el contrato ALU vinculado y un reintento del evento no crea un segundo
  Y en modo "propose" solo queda una propuesta pendiente de consentimiento
  Y con 250 kWh la tasa es ARS 212,50 y la bonificación −ARS 106,25
  Y de un pago parcial se imputa al tercero su prorrata y la rendición con comisión genera la orden de pago
```
