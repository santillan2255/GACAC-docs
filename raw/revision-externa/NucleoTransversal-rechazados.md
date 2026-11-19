# Propuestas rechazadas del documento externo "NucleoTransversal-Modelo"

| Campo | Valor |
|---|---|
| Documento revisado | `NucleoTransversal-Modelo.md` (autor externo, 6-11-2026) |
| Informe completo | `NucleoTransversal-contraste.md`, sección 4.1; evidencia por capítulo en `_trabajo/contraste-*.md` |
| Fecha | 10-11-2026 |
| Estado | Para comentar. Ninguna de estas propuestas se aplicó a la especificación. |

## Cómo usar este documento

Son 14 propuestas del documento externo que chocan con decisiones ya tomadas en nuestra especificación. El informe cuenta 15 contradicciones porque algunas filas se repiten (por ejemplo, GestionApps aparece dos veces); los temas distintos son 14.

En varios casos se rechaza el **medio** que propone el documento, pero su **objetivo** ya está cubierto de otra forma; eso se indica en cada punto.

Debajo de cada propuesta hay un campo **Comentario** para que escribas tu opinión. Si querés revertir algún rechazo, indicá "Revisar" y se convierte en una decisión nueva.

## Resultado de la revisión del solicitante (10-11-2026)

El solicitante revisó las 14 de a una. Se mantienen 10 rechazos sin cambios (1, 3, 5, 6, 7, 10, 11, 12, 13 y 14). Las otras cuatro quedaron así:

- **2. GestionApps:** no se incluye ahora porque no hay información de ese sistema; queda como posible fuente a analizar en el futuro (DEC-108).
- **4. Fórmulas en tarifas:** se mantiene el rechazo y se suma la política de preferir reglas declarativas, con justificación obligatoria de cada fórmula y un informe de cuántas reglas usan fórmula (DEC-105).
- **8. Vencimientos:** de 1 a 4 por defecto, con el tope como parámetro del tenant validado contra los formatos de los entes de cobro (DEC-106).
- **9. Factura rechazada por ARCA:** **se adopta la propuesta del documento externo**: vuelve a borrador y libera su número. Reemplaza DEC-035 en ese punto (DEC-107).

---

## Arquitectura

### 1. Instalación aislada por cooperativa

- **Qué propone el documento:** cada cooperativa tiene su propia instalación y su propia base de datos (DD-08, capítulos 2.1 y 15).
- **Qué decidimos nosotros:** una base única compartida, con cada dato marcado con su cooperativa (`tenantId`, DEC-002).
- **Por qué se rechaza:** es la base del modelo SaaS. Una base por cooperativa es justamente la deuda de ProCoop que reemplazamos.

**Comentario:**

&nbsp;

### 2. GestionApps como sistema base

- **Qué propone el documento:** tomar GestionApps como base funcional y ProCoop como referencia de lo cooperativo (DD-01).
- **Qué decidimos nosotros:** stack propio basado en Connectia (DEC-001) y alcance "todo lo que hace ProCoop" (DEC-007).
- **Por qué se rechaza:** GestionApps no es una de nuestras fuentes. Lo que el documento le atribuye (multiempresa, bloqueo por período, saldos calculados, impuestos) ya está cubierto en nuestros anexos.

**Comentario:**

&nbsp;

### 3. Claves foráneas declaradas en la base

- **Qué propone el documento:** declarar en la base de datos una clave foránea para cada relación (capítulo 13.10).
- **Qué decidimos nosotros:** MongoDB, que no tiene claves foráneas (DEC-001).
- **Por qué se rechaza:** el medio no aplica a nuestro stack. **El objetivo sí se adopta**, con medios propios: cada módulo valida sus referencias, lo emitido guarda una foto de los datos y ahora se suma un verificador nocturno de referencias (DEC-100).

**Comentario:**

&nbsp;

---

## Tarifas y comprobantes

### 4. Prohibir las fórmulas en las tarifas

- **Qué propone el documento:** cargos, recargos y descuentos armados solo con reglas, sin fórmulas libres (capítulo 5.6).
- **Qué decidimos nosotros:** primero reglas declarativas y, si no alcanzan, fórmulas en un entorno aislado y seguro (RF-TAR-067, RF-TAR-068).
- **Por qué se rechaza:** sin fórmulas no se pueden migrar los cargos reales de ProCoop, como tasas, subsidios y PIST/VAD. Del documento se puede tomar la política de preferir reglas y justificar cada fórmula (mejora de prioridad media, no aplicada).

**Comentario:**

&nbsp;

### 5. Un solo catálogo de ventas y compras, con la cuenta contable en cada concepto

- **Qué propone el documento:** un único catálogo por empresa en el que cada concepto lleva su cuenta contable de venta y de compra (capítulo 5.2).
- **Qué decidimos nosotros:** cada catálogo tiene su módulo dueño, y las cuentas las asigna contabilidad (M15, AGR-002).
- **Por qué se rechaza:** el módulo que vende no debe decidir la contabilidad. Un solo dueño del plan de cuentas permite cambiar la imputación sin tocar los catálogos.

**Comentario:**

&nbsp;

### 6. Todos los comprobantes en una sola colección

- **Qué propone el documento:** todo comprobante, de cualquier clase, con la misma cabecera y en la misma estructura (capítulo 6.3).
- **Qué decidimos nosotros:** compartimos la estructura de la cabecera como tipo común, pero cada módulo guarda sus propios documentos (facturas en M05, recibos en M07, órdenes de pago en M12, etc.).
- **Por qué se rechaza:** respeta la regla de que cada módulo es dueño de sus datos (RN-DAT-003).

**Comentario:**

&nbsp;

### 7. La letra del comprobante derivada dentro de un tipo genérico

- **Qué propone el documento:** la letra (A, B, C) no es un tipo distinto, sino un dato que se deriva de las condiciones fiscales (capítulo 6.1).
- **Qué decidimos nosotros:** cada letra es un tipo de comprobante con su código ARCA, y una matriz elige el correcto según la condición fiscal.
- **Por qué se rechaza:** ARCA codifica por tipo y letra, así que el modelo sigue esa estructura.

**Comentario:**

&nbsp;

### 8. Vencimientos sin tope

- **Qué propone el documento:** vencimientos y talones de pago como filas, sin cantidad máxima (capítulo 6.5).
- **Qué decidimos nosotros:** de 1 a 4 vencimientos por comprobante (RF-FAC-086).
- **Por qué se rechaza:** es lo que aceptan ARCA, los códigos de barras y los entes recaudadores. Como el modelo ya guarda los vencimientos como lista, subir el tope sería un cambio de parámetro, no de estructura.

**Comentario:**

&nbsp;

### 9. Que un comprobante no autorizado vuelva a borrador

- **Qué propone el documento:** si ARCA no autoriza un comprobante numerado, vuelve a borrador (capítulo 7.2).
- **Qué decidimos nosotros:** el número se asigna al emitir y, si ARCA rechaza, se reenvía con el mismo número (DEC-035).
- **Por qué se rechaza:** volver a borrador deja huecos en la numeración u obliga a renumerar.

**Comentario:**

&nbsp;

---

## Contabilidad y compras

### 10. Impedir registrar un comprobante sin cuenta contable

- **Qué propone el documento:** no se puede registrar ningún comprobante con renglones sin cuenta contable (capítulo 9.3).
- **Qué decidimos nosotros:** el asiento queda pendiente y se bloquea el cierre contable hasta resolverlo (PA-CON-02).
- **Por qué se rechaza:** frenaría la facturación masiva por un problema de configuración contable.

**Comentario:**

&nbsp;

### 11. Todo el circuito de compras como un único documento que avanza por estados

- **Qué propone el documento:** un solo documento de compra que pasa por solicitud, cotización, pedido, orden, recepción y factura (capítulo 10.1).
- **Qué decidimos nosotros:** documentos separados, vinculados ítem a ítem con sus pendientes (M12).
- **Por qué se rechaza:** cada documento tiene efectos distintos: la recepción mueve stock, la factura tiene efectos fiscales y contables. En el circuito, los estados y el vínculo ítem a ítem sí coincidimos.

**Comentario:**

&nbsp;

---

## Seguridad y acceso

### 12. El usuario es una persona del padrón y las contraseñas se migran con cambio obligatorio

- **Qué propone el documento:** el usuario es una persona del padrón; al migrar, las contraseñas se conservan y se obliga a cambiarlas en el primer ingreso (DD-07, capítulo 12.1).
- **Qué decidimos nosotros:** la identidad es global y no se vincula directamente con la persona; las contraseñas no se migran y se envía una invitación de activación (PA-MIG-07, RN-MIG-013).
- **Por qué se rechaza:**
  - por privacidad entre cooperativas, ya que una misma identidad puede operar en varias;
  - ProCoop guarda las contraseñas con cifrado reversible, así que migrarlas arrastraría el riesgo.

**Comentario:**

&nbsp;

### 13. Secretos "fuera de la base"

- **Qué propone el documento:** guardar credenciales y secretos fuera de la base de datos (principios del documento).
- **Qué decidimos nosotros:** cifrados en MongoDB, con la clave maestra en un servicio de claves externo y fuera de las colecciones de negocio (DEC-074).
- **Por qué se rechaza:** más que un rechazo, es una precisión: el objetivo coincide y el medio es distinto.

**Comentario:**

&nbsp;

### 14. Elegir la empresa al iniciar sesión

- **Qué propone el documento:** el usuario elige con qué empresa trabaja al ingresar (capítulo 2.6).
- **Qué decidimos nosotros:** la entidad jurídica se resuelve según cada documento (RF-CFG-137).
- **Por qué se rechaza:** así un usuario opera varias entidades sin cambiar de sesión.

**Comentario:**

&nbsp;

---

## Comentario general

&nbsp;
