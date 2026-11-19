# Carátula, control de versiones y aprobaciones — GoodApps Cooperativas

Artefacto 1.1 del índice de entregables ([`00-INDICE.md`](00-INDICE.md)). Este documento identifica el entregable de análisis y diseño, enumera los documentos que lo componen, registra su historial y define cómo se revisa, aprueba y cambia. Deriva de la especificación vigente (`docs/especificacion/`); ante cualquier diferencia prevalece la especificación (maestra `00`, anexos y registro de decisiones `01`), según la jerarquía de la maestra §2.2.

---

## 1. Carátula

| Campo | Valor |
|---|---|
| Proyecto | Reemplazo de ProCoop por una plataforma SaaS para cooperativas de servicios públicos de Argentina |
| Producto | **GoodApps Cooperativas**: plataforma SaaS multitenant, web y PWA (ERP + CRM + landing y autogestión + plataforma + cobranza y pasarelas + liquidación de impuestos + APIs; maestra §1.2) |
| Cliente | `[Cooperativa]` (cooperativa piloto de los entregables: Laguna Larga, `LAG`; ver supuesto transversal del índice y DEC-088) |
| Tipo de documento | Entregable de análisis y diseño detallado (conjunto de artefactos derivados de la especificación funcional y técnica) |
| Versión del entregable | 1.0 |
| Fecha | 05-11-2026 |
| Estado | Borrador para revisión (pendiente de las aprobaciones de la sección 4) |
| Clasificación | **Confidencial — uso restringido al proyecto** (ver sección 1.1) |
| Documento rector | `docs/especificacion/00-ESPECIFICACION-MAESTRA.md` (versión 1.0, borrador consolidado) |
| Elaborado por | `[Nombre y apellido]` — Analista funcional; `[Nombre y apellido]` — Arquitecto |
| Aprobado por | Ver sección 4 |

### 1.1 Clasificación de confidencialidad

| Nivel | Alcance | Aplica a |
|---|---|---|
| Público | Puede difundirse sin restricción | — (ningún documento del entregable) |
| Interno | Equipo del proveedor y de la cooperativa | Índice y carátula, una vez aprobados |
| **Confidencial** | Personas designadas por el proveedor y por la cooperativa; no se distribuye a terceros sin autorización escrita del patrocinador | **Todo el entregable en su versión 1.0**: contiene arquitectura, modelo de seguridad, modelo de datos y configuraciones relevadas de la base de referencia |
| Restringido | Acceso nominal y registrado | No aplica: el entregable no contiene secretos, credenciales ni datos personales |

Reglas de manejo:

- El entregable **no contiene datos personales reales**: las personas se nombran con marcadores `[Nombre y apellido]`. De la base relevada `PR_LAG_DEMO` solo se toma configuración, nunca datos personales (DEC-088).
- El entregable **no contiene secretos**: credenciales, claves y certificados viven en la bóveda por tenant y nunca se transcriben (DEC-074, maestra §5.1).
- GoodApps actúa como prestador de servicios de tratamiento por cuenta de la cooperativa (Ley 25.326, art. 25; DEC-076); este documento no altera ese encuadre.

---

## 2. Documentos que componen el entregable

### 2.1 Especificación vigente (fuente normativa)

Versión y estado tomados del encabezado de cada archivo al 05-11-2026. Cuando el archivo no tiene campo de versión se indica la última actualización que consta en su contenido.

| Documento | Contenido | Versión | Estado declarado en el archivo |
|---|---|---|---|
| `00-ESPECIFICACION-MAESTRA.md` | Documento rector: visión, decisiones, arquitectura, roles, mapa del sitio, módulos, olas, glosario general | 1.0 (borrador consolidado), fecha 04-11-2026 | Especificación consolidada al 04-11-2026: 31 anexos completos, cuestionario cerrado (DEC-011 a DEC-087), plan de olas, matriz y registro de huecos |
| `01-registro-decisiones.md` | Decisiones DEC-001 a DEC-088 con fecha, fundamento y estado | Sin campo de versión | Última decisión registrada: DEC-088 (05-11-2026), que reemplaza a DEC-081 |
| `02-preguntas-abiertas.md` | Preguntas abiertas (PA) consolidadas con opción recomendada y estado | Sin campo de versión | Cuestionario cerrado: 516 preguntas, 93 respondidas y 423 asumidas con la recomendada (maestra §18; DEC-047, DEC-072) |
| `03-plan-de-olas-y-prompts.md` | Plan de construcción por olas O0–O11 y prompts para Cursor IA | 1.1, fecha 05-11-2026 (reemplaza la 1.0 del 04-11-2026) | Plan consolidado |
| `04-matriz-trazabilidad.md` | Trazabilidad fuente → anexo/ID | 1.1, fecha 05-11-2026 (reemplaza la 1.0 del 04-11-2026) | Regenerada por script; siguen abiertas las brechas de fuente de su §4 y las citas de decisiones de su §5.3 |
| `05-registro-huecos.md` | Huecos de cobertura detectados por las fichas verticales (T12) | Sin campo de versión | Estado final 05-11-2026: 77 huecos únicos, 71 corregidos en anexo y 6 pasados a decisión; 0 abiertos |
| `_GUIA-REDACCION-ANEXOS.md` | Convenciones y plantilla de los anexos | Sin campo de versión | Documento de referencia (maestra §13) |

Anexos (`anexos/`). Todos declaran versión **1.0**.

| Anexo | Nombre | Estado declarado |
|---|---|---|
| M01 PER | Personas, titulares, asociados, cuentas, inmuebles y domicilios | Especificación consolidada — pendiente de validar preguntas abiertas |
| M02 CAT | Catálogo de servicios, productos, planes, categorías y contrato de servicio | Ídem |
| M03 MED | Medidores, lecturas, consumos, telemedición y prepago | Ídem |
| M04 TAR | Tarifas y motor de cálculo | Ídem |
| M05 FAC | Facturación: ciclos, lotes y comprobantes | Ídem |
| M06 FIS | Fiscal e impuestos | Ídem |
| M07 COB | Cuenta corriente, cobranza, cajas, entes, débitos, pasarelas y conciliación | Ídem |
| M08 MOR | Mora, intereses, suspensión, corte, reconexión, financiación y convenios | Ídem |
| M09 CRM | CRM y atención | Ídem |
| M10 TEC | Técnica, campo, GIS/redes, obras, aprovisionamiento y telefonía | Ídem |
| M11 VEN | Ventas, presupuestos y punto de venta | Ídem |
| M12 CMP | Compras y proveedores | Ídem |
| M13 STK | Stock, equipos serializados, bienes de uso, RMA y fabricación | Ídem |
| M14 TES | Tesorería y bancos | Ídem |
| M15 CON | Contabilidad | Ídem |
| M16 SUE | Personal y sueldos | Ídem |
| M17 INS | Gestión institucional | Ídem |
| M18 SOC | Servicios sociales, otros servicios y flota | Ídem |
| M19 POR | Landing, portal y app del socio | Ídem |
| T01 PLA | Plataforma SaaS | Ídem |
| T02 IAM | Identidad, autenticación, roles, perfiles, alcance y auditoría | Ídem |
| T03 UXD | Experiencia, design system, marca, diccionario, layouts y mapa del sitio | Ídem |
| T04 CFG | Configuración versionada, parámetros, tablas maestras y geografía | Ídem |
| T04b CFG (partes 1 a 4) | Catálogo de los 1.536 parámetros de ProCoop | Ídem (las cuatro partes) |
| T05 DAT | Modelo de datos canónico consolidado | Especificación consolidada, actualizada con la fase 1 de huecos, DEC-085 a DEC-087 y el barrido final |
| T06 INT | Integraciones externas | Especificación consolidada — pendiente de validar preguntas abiertas |
| T07 MIG | Migración desde ProCoop, convivencia, corrida paralela y by-pass | Ídem |
| T08 NFR | Requisitos no funcionales, seguridad, privacidad, observabilidad y calidad | Ídem |
| T09 COM | Comunidad y comunicaciones | Ídem |
| T10 BIA | Reportes, BI, tableros, exportaciones y APIs | Ídem |
| T11 WFL | Workflow, eventos, tareas, aprobaciones y documentos | Ídem |
| T12 SRV parte 1 | Fichas verticales: INT, TEL, TV, ELE, AG, CLO, GAS, ALU | Borrador para revisión funcional (control de cobertura, DEC-073), fecha 04-11-2026 |
| T12 SRV parte 2 | Fichas verticales: OBR, SEP, CEM, SAN, SAL, VIV, TAS, CAP, OTR | Borrador para revisión (no crea requisitos nuevos) |

### 2.2 Documentos de la carpeta de entregables

Situación de la carpeta `docs/entregables-analisis-diseno/` al 05-11-2026. Los documentos en elaboración se listan sin afirmar su contenido; su descripción es la que figura en el índice.

| Archivo | Artefacto(s) | Estado al 05-11-2026 |
|---|---|---|
| `00-INDICE.md` | Índice de artefactos | v1.0 (05-11-2026) |
| `01-resumen-ejecutivo-vision.md` | 1.3 Visión y alcance | v1.0 según el índice |
| `02-arquitectura-c4.md` | 5.1, 5.2, 5.5 Arquitectura C4, contexto y despliegue | En elaboración (encabezado: 1.0, borrador para revisión) |
| `03a-er-plataforma-personas-catalogo.md`, `03b-er-medicion-tarifas-facturacion.md`, `03c-er-cobranza-mora-crm-tecnica.md`, `03d-er-erp-administrativo.md` | Partes A a D del 6.1 Modelo entidad-relación | En elaboración; el documento que las agrupa (`03-modelo-entidad-relacion.md`) todavía no existe en la carpeta |
| `04-procesos-bpmn.md` | 2.1 Procesos de negocio | Previsto en el índice; no existe al momento |
| `05-wireframes-pantallas-piloto.md` | 4.2 Wireframes | En elaboración |
| `06-secuencias-y-estados.md` | 7.3, 7.4 Secuencias y estados | Previsto en el índice; no existe al momento |
| `07-estrategia-pruebas.md` | 9.1, 9.4 Estrategia y plan de pruebas | En elaboración |
| `08-plan-puesta-en-marcha.md` | 8.3, 8.4 Puesta en marcha y capacitación | En elaboración |
| `09-riesgos-y-raci.md` | 1.4, 1.5 Interesados, RACI y riesgos | En elaboración (encabezado: 1.0, borrador para revisión) |
| `10-caratula-control-versiones.md` | 1.1 Carátula, control de versiones y aprobaciones | Este documento, v1.0 |
| `11-glosario-negocio.md` | 1.2 Glosario de negocio unificado | v1.0 (05-11-2026) |

Los artefactos con estado "Existente" o "Derivable" en el índice se entregan por referencia a la especificación hasta que se desarrollen en esta carpeta.

---

## 3. Historial de versiones

### 3.1 Hitos de la especificación (insumo del entregable)

Reconstruidos a partir de la maestra (encabezado, §3, §15, §18 y §19), del registro `01`, de los encabezados de `03` y `04` y del estado final de `05`. No se registran hitos que no consten en esos documentos.

| Versión | Fecha | Autor | Descripción |
|---|---|---|---|
| Decisiones rectoras | 04-11-2026 | Solicitante (`[Nombre y apellido]`, Patrocinador) | DEC-001 a DEC-010: stack Connectia, base única multitenant, monolito modular, Docker agnóstico, piloto Internet, olas sin fechas, todo ProCoop en alcance, muro editorial, contabilidad temprana y formato del entregable (maestra §3) |
| Cuestionario cerrado | 04-11-2026 | Solicitante; equipo de análisis (`[Nombre y apellido]`) | DEC-011 a DEC-087: 516 preguntas, 93 respondidas por el solicitante y 423 asumidas con la opción recomendada (DEC-047, DEC-072, DEC-087; maestra §3.1 y §18) |
| Maestra 1.0 (borrador consolidado) + anexos 1.0 + plan 1.0 + matriz 1.0 | 04-11-2026 | Equipo de análisis y arquitectura (`[Nombre y apellido]`) | Consolidación: 31 anexos completos (M01–M19, T01–T12; T04b en 4 partes y T12 en 2), plan de olas, matriz de trazabilidad y registro de huecos (maestra, encabezado). Matriz 1.0: 2.201 unidades de fuente, 97,9 % con destino (maestra §19) |
| Procesamiento de huecos (fases 1 a 3) | 05-11-2026 | Equipo de análisis (`[Nombre y apellido]`) | 77 huecos únicos cerrados: 71 corregidos en anexo (8 con parámetro de default propuesto que requiere validación legal) y 6 pasados a decisión; 0 abiertos (`05`, estado final). Se incorporan DEC-082 a DEC-087 a los anexos |
| Plan de olas 1.1 | 05-11-2026 | Equipo de análisis (`[Nombre y apellido]`) | Incorpora los 83 RF nuevos de las fases 1 a 3 de huecos, DEC-082 a DEC-087 y los cambios de ola; 172 prompts (más 3 generales) que cubren 4.203 RF y 292 RNF (`03` §21; maestra §15) |
| Matriz de trazabilidad 1.1 | 05-11-2026 | Equipo de análisis (`[Nombre y apellido]`) | Regenerada por script sobre los anexos del 05-11-2026: 1.661 unidades cubiertas directamente, 98,0 % de cobertura; 26 brechas sin cambios (`04` §20) |
| DEC-088 | 05-11-2026 | Solicitante (`[Nombre y apellido]`, Patrocinador) | La cooperativa piloto, comercial y de migración, es Laguna Larga (`LAG`); reemplaza a DEC-081 (`01`) |

### 3.2 Historial del entregable

| Versión | Fecha | Autor | Descripción |
|---|---|---|---|
| 1.0 | 05-11-2026 | `[Nombre y apellido]` — Analista funcional; `[Nombre y apellido]` — Arquitecto | Primera emisión del entregable de análisis y diseño sobre la especificación al 05-11-2026: índice, carátula, glosario y los documentos de la sección 2.2. Borrador para revisión |

---

## 4. Roles de elaboración, revisión y aprobación

Los nombres se completan al circular el entregable. La firma puede ser manuscrita sobre la versión impresa o firma electrónica con OTP según la política de firma del proyecto (DEC-078 aplica al producto; su uso para este entregable lo decide el patrocinador).

| Rol | Responsabilidad sobre el entregable | Nombre y apellido | Organización | Firma | Fecha |
|---|---|---|---|---|---|
| Analista funcional | Elabora los artefactos funcionales (glosario, procesos, wireframes, casos de uso) y mantiene la trazabilidad con la especificación | `[Nombre y apellido]` | `[Proveedor]` | | |
| Arquitecto | Elabora los artefactos de arquitectura, datos, integración y no funcionales; revisa la coherencia técnica | `[Nombre y apellido]` | `[Proveedor]` | | |
| Referente de la cooperativa | Revisa que procesos, vocabulario y configuraciones reflejen la operación de la cooperativa piloto; canaliza las preguntas dirigidas a ella (DEC-088) | `[Nombre y apellido]` | `[Cooperativa]` | | |
| Contador | Revisa los artefactos con efecto contable, fiscal y de capital social (M05, M06, M07, M15, M17); valida los parámetros con default propuesto de encuadre fiscal (`05`, HUECO-CAP-04) | `[Nombre y apellido]` | `[Cooperativa]` | | |
| Asesor legal | Revisa privacidad, plazos de prescripción, firma y parámetros que requieren validación legal antes de producción (DEC-052, DEC-076, `05`) | `[Nombre y apellido]` | `[Cooperativa]` | | |
| Patrocinador | Aprueba el entregable, resuelve controversias de alcance y autoriza los cambios que afectan decisiones rectoras | `[Nombre y apellido]` | `[Cooperativa]` | | |

Circuito de aprobación de una versión:

1. **Elaboración**: Analista funcional y Arquitecto, cada uno sobre sus artefactos.
2. **Revisión cruzada**: el Arquitecto revisa los artefactos funcionales y el Analista los técnicos.
3. **Revisión de la cooperativa**: Referente (operación), Contador (contable y fiscal) y Asesor legal (normativo), cada uno sobre los artefactos de su competencia.
4. **Aprobación**: Patrocinador, una vez cerradas o aceptadas las observaciones.

---

## 5. Procedimiento de control de cambios del entregable

### 5.1 Qué se considera un cambio

- **Corrección editorial**: redacción, formato, enlaces o numeración, sin efecto sobre el contenido.
- **Corrección de derivación**: el entregable no refleja fielmente la especificación. Se corrige el entregable, porque la especificación prevalece.
- **Cambio de contenido**: se modifica una regla, un alcance, un dato o un criterio. Siempre nace en la especificación y luego se propaga al entregable.

### 5.2 Cómo se pide un cambio

Toda solicitud se registra con un identificador `SC-ENT-NNN` (convención propuesta por este documento) y los siguientes datos:

| Campo | Contenido |
|---|---|
| Solicitante y rol | `[Nombre y apellido]`, rol de la sección 4 |
| Artefacto y sección afectados | Número del índice (por ejemplo, 2.1) y sección |
| Descripción | Qué debe cambiar y por qué |
| Fuente | Sección de la maestra, anexo e ID (RF, RN, PAN, DEC, PA, HUE) que respalda o contradice el cambio |
| Tipo | Editorial / derivación / contenido |
| Impacto | Artefactos, anexos y olas afectados |

### 5.3 Tratamiento según el tipo

| Tipo | Tratamiento | Registro en la especificación |
|---|---|---|
| Editorial | El autor del artefacto corrige y sube la versión menor del documento | Ninguno |
| Derivación | El autor corrige contra la fuente citada; el revisor del rol que detectó la diferencia verifica | Ninguno |
| Contenido que **cambia una decisión** | Se registra una nueva decisión en `01-registro-decisiones.md` (DEC-089 en adelante). La decisión anterior no se borra: se marca `Reemplazada por DEC-xxx` | `01` |
| Contenido que **requiere definir algo** | Se registra como pregunta en `02-preguntas-abiertas.md`. Mientras no se responde rige la opción recomendada y los requisitos quedan `A validar` (DEC-047, DEC-072; maestra §16, punto 5). Al responderse genera una DEC | `02`, luego `01` |
| Contenido que revela un **faltante o una contradicción entre anexos** | Se registra en `05-registro-huecos.md` con propuesta, anexo responsable y gravedad; se corrige en el anexo responsable o pasa a PA si requiere decisión | `05` |

Después de aplicar un cambio de contenido en la especificación:

1. Se actualiza el anexo dueño del dato (maestra §12 y T05) y, si corresponde, la maestra.
2. Se regenera la matriz de trazabilidad con el procedimiento de su §14 cuando el cambio es importante (maestra §19).
3. Si el cambio mueve requisitos de ola, se actualiza el plan de olas y su sección de cambios.
4. Se actualizan los artefactos del entregable afectados y se sube su versión (sección 6).
5. Se registra en el historial (sección 3.2) qué versión del entregable incorpora cada `SC-ENT`.

### 5.4 Reglas

- El entregable nunca introduce reglas que no estén en la especificación; si falta algo, se registra como PA (maestra §16, punto 6).
- El texto reemplazado se conserva como referencia ("Texto anterior" o "Reemplazado"), igual que en la especificación, para no perder trazabilidad.
- Un cambio que afecta una decisión rectora (DEC-001 a DEC-010) o el alcance requiere aprobación del Patrocinador antes de aplicarse.
- Los parámetros resueltos con un default propuesto que requiere validación legal (`05`, estado final) no se dan por aprobados hasta la firma del Asesor legal.

---

## 6. Convenciones de numeración de versiones

Se adopta el esquema `MAYOR.MENOR`, coherente con la especificación (`03` y `04` pasaron de 1.0 a 1.1 conservando una sección de cambios y el texto reemplazado).

| Cambio | Efecto en la versión | Ejemplo |
|---|---|---|
| Primera emisión consolidada | 1.0 | Este entregable al 05-11-2026 |
| Correcciones editoriales o de derivación, o incorporación de cambios de contenido que no alteran decisiones ni alcance | Sube la menor | 1.0 → 1.1 |
| Cambio de alcance, de una decisión rectora o reemisión completa tras una nueva consolidación de la especificación | Sube la mayor y la menor vuelve a 0 | 1.3 → 2.0 |

Reglas complementarias:

- Cada documento lleva su propia versión en el encabezado; la versión del entregable (carátula) sube cuando cambia al menos uno de sus documentos.
- El **estado** se informa aparte de la versión: `En elaboración` → `Borrador para revisión` → `Aprobado` → `Reemplazado por x.y`. La aprobación no cambia el número de versión; cualquier modificación posterior sí.
- Toda versión distinta de 1.0 incluye una sección "Cambios de la versión x.y" con lo modificado y el valor reemplazado, como `03` §21 y `04` §20.
- Las fechas se escriben `dd-mm-aaaa` (maestra §13).
- Los identificadores de la especificación (DEC, PA, RF, RN, CTR, HUE y demás) son estables y no se renumeran; un ID reemplazado se marca y no se reutiliza (`01`, encabezado).

---

## 7. Fuentes

- Maestra `00`: encabezado, §1.4, §2.2, §3, §3.1, §12, §13, §15, §16, §18, §19.
- `01-registro-decisiones.md`: DEC-047, DEC-052, DEC-072, DEC-074, DEC-076, DEC-078, DEC-081, DEC-088.
- `02-preguntas-abiertas.md` (encabezado y política vigente), `03-plan-de-olas-y-prompts.md` (encabezado y §21), `04-matriz-trazabilidad.md` (encabezado y §20), `05-registro-huecos.md` (estado final).
- Encabezados de los anexos M01–M19 y T01–T12.
- [`00-INDICE.md`](00-INDICE.md) de esta carpeta.
