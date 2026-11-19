# CoopApps — Lo nuevo, más aplicativos y más capacidad (vs ProCoop legacy)

**Uso:** copiar **todo** el bloque de la §A en Claude. **No hace falta adjuntar** otros archivos: el contenido de cada slide está en la §B (códigos **IMG-N00…N23**).

**Por slide (recomendado):** carpeta [`img-n-lotes/`](./img-n-lotes/README.md) — pegar una vez `PROMPT-A-pegar-primero.txt`, luego `Generá IMG-Nxx` con el `.md` del lote. Regenerar lotes: `python scripts/export_img_n_lotes.py`.

**Complementa** (no reemplaza) el comparativo menú a menú: [`comparativo-funcional-megaspec-unificado.md`](./comparativo-funcional-megaspec-unificado.md) + IMG-F.

**Códigos:** IMG-N00…N23 (25 diapositivas posibles).

| Dato | Valor |
|---|---|
| Fecha | 19-11-2026 |
| Enfoque | **Delta:** qué suma CoopApps que ProCoop no tiene o tiene acotado |
| Idioma slides | Español Argentina; **cero** códigos M01, T04, PC-, olas, SM- en tabla visible |
| Versión revisión | 1.1 — completitud marketing + honestidad (nov 2026) |

### Checklist de calidad (antes de presentar)

| Criterio | ¿Cumple? |
|---|---|
| Respeto a ProCoop (no “no tiene nada”) | Sí — N01, N21, tono del prompt |
| Número ancla 119/120 | Sí — N00, N01, N22 (no “120 sin matices”) |
| 8 aplicativos | Sí — N02, N20 |
| 17 familias de servicio | Sí — N12 + **N12b** (completa las 17) |
| API sin overselling | Sí — N13 ámbar, N21 |
| Dolores del relevamiento | Sí — N15 (7) + **N15b** (otros pedidos) |
| Inventario “plus” | Sí — N18–N19 (20 ítems verificados, no 40 inventados) |
| Por audiencia (marketing) | Sí — **N23** consejo / socio / operación |

---

## A. Bloque para copiar y pegar en Claude (primero)

```text
Sos diseñador de slides ejecutivas (1920×1080, HTML+SVG exportable a PNG) para cooperativas de servicios de Argentina.

TEMA DEL DECK: no es repetir el menú ProCoop función por función. Es mostrar QUÉ MÁS TRAE CoopApps:
- más aplicativos y canales,
- funciones nuevas o muy ampliadas,
- capacidades que ProCoop no tiene como producto unificado.

TONO: ProCoop es competidor respetable y cubre el negocio (119 de 120 ítems de menú tienen destino). Este deck muestra el **plus**, sin humillar al legacy.

AUDIENCIAS EN EL MISMO SLIDE:
- Gerencia lee “Por qué importa”.
- Operación lee “Hoy en ProCoop” y “Qué suma CoopApps”.
- Técnica: solo si pido pie con refs.

=== PROHIBIDO en texto visible grande ===
M01, T10, O11, PC-077, SM-, DFA, RF-, “equivalente en Mxx”.
Palabras vacías: revolucionario, disruptivo, líder, el mejor, sin ProCoop, reemplazo inmediato, API desde el día 1, mismas pantallas, tiempo real al milisegundo.

=== MARKETING SIN MENTIR (cada slide) ===
- Título = beneficio en lenguaje humano (no técnico).
- Opcional bajo el título: **Gancho** (1 frase ≤ 20 palabras) que responda “¿y eso qué me da?”.
- En tablas, si hay espacio: columna corta **Por qué importa** (1 línea; puede ir en verde tenue).
- Número protagonista solo si está en el catálogo (119/120, 8 apps, 17 servicios, 4.200+ requisitos, 71 trámites autogestión).

=== PERMITIDO (con honestidad) ===
“API abierta documentada” → decir “planificada para la etapa final del producto” si la fila lo indica.
“ProCoop sí tiene CoopOnline / P-Móvil” → el mensaje es calidad y modelo, no “no tienen app”.

=== PALETA ===
Títulos #2F343A; ProCoop/Hoy #6B7280 sobre #E5E7EB; CoopApps #1F2937 con acento #2E7D32 en lo nuevo; ámbar #B7791F solo para “planificado / a validar en calendario”.

=== LAYOUT POR TIPO ===
1) Tabla 3 columnas: Tema | Hoy en ProCoop | Qué suma CoopApps (+ etiqueta Nuevo | Ampliado | Modelo distinto)
2) Lista comparativa: máximo 7–9 filas por slide
3) Viñetas: máximo 6, una idea por línea
Pie fijo: "Fuente: especificación CoopApps + relevamiento ProCoop DEMO (nov 2026)"

=== CATÁLOGO (contenido en el mismo mensaje del usuario, sección B) ===
Cuando escriba "Generá IMG-N12", buscá el encabezado ## IMG-N12 más abajo en el documento pegado y renderizá TODO su contenido. Textos literales; no acortar con códigos.

Tras cada slide: 3 bullets para consejo + 3 para jefe de área (sin códigos).

Confirmá y esperá "Generá IMG-N00" o el código que pida.
```

**Después del bloque anterior**, en el **mismo chat**, pegá también la **§B completa** (desde `## B. Catálogo` hasta el final de este archivo), **o** adjuntá este archivo entero.

---

## B. Catálogo IMG-N00 … IMG-N23

---

## IMG-N00 — Portada del deck “lo nuevo”

**Título:** CoopApps: el mismo negocio, más plataforma  
**Subtítulo:** Más aplicativos · más canales · más capacidades — sin perder lo que hoy funciona  
**Gancho:** Lo que ProCoop hace en escritorio; lo que suma la nube, la marca y el socio en el circuito.  
**Centro (3 líneas):**
- Mismo alcance del menú relevado (119/120).
- Este material muestra el **plus**: nube, marca, campo, comunidad, institucional, datos.
**Pie:** No reemplaza el comparativo función por función (deck IMG-F).

---

## IMG-N01 — Mensaje honesto

**Título:** ProCoop hace el negocio. CoopApps suma plataforma.

| Idea | Texto |
|---|---|
| Reconocimiento | Facturación masiva, multiservicio, mora, compras, sueldos: ProCoop es profundo y conocido. |
| Alcance | **119 de 120** funciones del menú relevado con destino en CoopApps; cero ítems sin especificación. La restante es administrar la base local (pasa al proveedor en la nube). |
| Este deck | Explica qué **nuevo** o **muy ampliado** trae CoopApps respecto del escritorio + CoopOnline + P-Móvil. |

---

## IMG-N02 — Ocho aplicativos vs el modelo legacy

**Título:** Una cooperativa, ocho formas de trabajar (ProCoop concentraba casi todo en escritorio)

| Aplicación CoopApps | Hoy con ProCoop | Qué suma | Etiqueta |
|---|---|---|---|
| Gestión web para el personal | Programa instalado en cada PC | Misma versión para todos; navegador; sin parque local | Modelo distinto |
| Portal y app del socio | CoopOnline sobre copia; web genérica del proveedor | Mismo dato que caja; logo y colores propios; app instalable | Ampliado |
| Espacio del empleado | Recibos y consultas limitadas | Recibos, licencias y documentación sin mezclar al socio | Nuevo |
| App de campo (sin señal) | P-Móvil sobre copia de datos | Una sola app: técnico, lecturista, cobrador, inspector | Ampliado |
| Sitio público / landing | Web compartida entre cooperativas | Dominio propio; bloques; borrador y publicación | Nuevo |
| Tótem en sucursal | Solo parcial vía turnero | Modo tótem dedicado para autogestión | Ampliado |
| Consola del proveedor SaaS | No existe como producto | Operación de plataforma (no es el día a día de caja) | Nuevo |
| API para integradores de la cooperativa | Integra y exportaciones; sin API por recurso administrable | API versionada con permisos de la cooperativa (etapa final del plan) | Ampliado |

---

## IMG-N03 — Plataforma y operación sin servidor propio

**Título:** De “la PC del servidor y del Agente” a servicio en la nube

| Tema | Hoy en ProCoop | Qué suma CoopApps | Etiqueta |
|---|---|---|---|
| Instalación | En cada PC y servidor de la cooperativa | Acceso web y apps; el tenant no opera SQL Server | Modelo distinto |
| Actualizaciones | Actualizar equipo por equipo | Una versión para todas las sedes | Modelo distinto |
| Copia de seguridad | Menú que depende del usuario | Copia diaria automática; ensayos de restauración | Modelo distinto |
| Ambiente de prueba | Demo o copia manual | Sandbox por cooperativa para probar sin tocar producción | Nuevo |
| Soporte | Acceso remoto sin caso claro | Ticket numerado; acceso temporal revocable y auditado | Ampliado |
| Salud del servicio | Implícito | Tablero de salud del tenant para gerencia y TI | Nuevo |
| Si un día se va del proveedor | Backup SQL manual | Exportación completa de los datos de la cooperativa | Ampliado |

---

## IMG-N04 — Un solo dato (fin de la réplica)

**Título:** El socio, caja y facturación miran la misma cuenta

| Tema | Hoy en ProCoop | Qué suma CoopApps | Etiqueta |
|---|---|---|---|
| Portal del socio | Copia a base externa; puede desfasarse | Sin réplica intermedia: saldo portal = saldo caja | Ampliado |
| Pagos web | Confirmación indirecta vía sincronización | Cobro confirmado antes de imputar y reconectar | Ampliado |
| App móvil de campo | Trabaja sobre copia | Misma base operativa; conflictos supervisados al sincronizar | Ampliado |
| PDF y comprobantes | Rutas FTP/S3 y jobs locales | Generación y entrega desde la nube | Modelo distinto |
| Riesgo operativo | “Se cayó la PC del Agente” | Jobs en nube con reintentos | Modelo distinto |

---

## IMG-N05 — Sin botón equivalente en el menú escritorio

**Título:** Capacidades nuevas que no son un ítem del menú ProCoop

| Capacidad | Hoy en ProCoop | Qué suma CoopApps | Etiqueta |
|---|---|---|---|
| Sitio público por bloques | Web genérica del proveedor | Dominio propio; publicar borrador sin programar | Nuevo |
| Asamblea con quórum en vivo | Actas y listas manuales | Credencial y quórum en tiempo real | Nuevo |
| Incidente masivo (corte de zona) | Miles de reclamos iguales | Un incidente; muchos socios vinculados | Nuevo |
| Bóveda de credenciales | Claves en programa o tablas | Credenciales segregadas prueba/producción | Nuevo |
| Indicadores certificados | Excel distinto al tablero | Mismo número en portal, gerencia y reportes | Nuevo |
| Contabilidad en convivencia | Apagar un sistema o romper ejercicio | Contabilidad paralela hasta cerrar migración | Nuevo |
| Diccionario propio | Textos fijos del sistema | Socio/asociado/usuario según la cooperativa | Nuevo |
| Comunidad (muro, encuestas) | SMS aislado en Herramientas | Campañas, avisos por zona, eventos | Nuevo |

---

## IMG-N06 — Socio y autogestión (1/2)

**Título:** Más trámites digitales con marca de la cooperativa

| Capacidad | Hoy en ProCoop / CoopOnline | Qué suma CoopApps | Etiqueta |
|---|---|---|---|
| Ver facturas y PDF | Sí, sobre réplica | Sí, desde el origen operativo | Ampliado |
| Pagar y prepagar web | Sí, con sincronización indirecta | Pago con confirmación real antes de imputar | Ampliado |
| Contratación digital | Parcial | Ciclo con factibilidad, turno y seguimiento | Ampliado |
| Estado de visita técnica | Limitado | Estados visibles para el socio en portal/app | Ampliado |
| Baja de servicio | Variable por configuración | Plazos regulatorios explícitos (24/72 h según trámite) | Ampliado |
| Autolectura y prepago | Limitado | Foto, reglas y conciliación con facturación | Ampliado |
| Representantes y permisos | Básico | Quién puede hacer qué, por acción | Ampliado |
| Pago por un tercero | Riesgo de ver cuenta ajena | Pago sin exponer datos de otro titular | Ampliado |

---

## IMG-N07 — Socio y autogestión (2/2)

**Título:** Accesibilidad, filas y confianza

| Capacidad | Hoy en ProCoop / CoopOnline | Qué suma CoopApps | Etiqueta |
|---|---|---|---|
| Marca en app instalable | Portal compartido, poca identidad | Nombre, ícono y colores de la cooperativa | Ampliado |
| Empleado vs socio | Mezclado en canales | Espacio empleado separado del socio | Nuevo |
| Vincular cuentas al migrar | Depende de dueño de copia externa | Código corto; anti-enumeración | Ampliado |
| Consulta sin login completo | Poco formalizado | Consulta y pago con datos enmascarados | Ampliado |
| Accesibilidad | No verificada como estándar | Objetivo WCAG 2.2 AA en portal | Ampliado |
| Turno online | Turnero presencial fuerte | Reserva web + tótem + box | Ampliado |
| Avisos de corte | Masivos o genéricos | Solo a socios realmente afectados | Ampliado |
| Encuesta en factura (NPS) | No unificado | Medición post-gestión en canal digital | Nuevo |

> Referencia interna (no en slide): ~71 tipos de autogestión especificados en portal vs capacidades históricas de CoopOnline.

---

## IMG-N08 — Personal y gestión interna (1/2)

**Título:** Más control sin más menús opacos

| Capacidad | Hoy en ProCoop | Qué suma CoopApps | Etiqueta |
|---|---|---|---|
| Parámetros | Miles de claves numéricas | Nombre, tipo, vigencia e historial | Ampliado |
| Simular antes de publicar tarifa/parámetro | No formal | Vista previa antes de impactar producción | Nuevo |
| Aprobaciones | Autorización puntual de operación | Circuitos por monto, doble firma, bandeja única | Ampliado |
| Expediente digital | Reclamos y mesa dispersos | Trámite con documentos y plazos | Ampliado |
| Firma en gestiones | Limitada | Firma electrónica/digital con QR donde corresponde | Ampliado |
| Buscador de funciones | Menú fijo 9 pestañas | Búsqueda global estilo “como ProCoop pero en web” | Ampliado |
| Permisos | Perfil = menú + tablas | Rol por acción; plantillas ajustables | Modelo distinto |
| Auditoría | Login y algunos cambios | Cadena inmutable con valor anterior y nuevo | Ampliado |

---

## IMG-N09 — Personal y gestión interna (2/2)

**Título:** Compras, campo, institucional

| Capacidad | Hoy en ProCoop | Qué suma CoopApps | Etiqueta |
|---|---|---|---|
| Portal del proveedor | No como portal | El proveedor carga y consulta su circuito | Nuevo |
| Anti-fraude en CBU | Control manual | Alerta si cambia CBU antes del pago | Nuevo |
| Factura compra asistida | Carga manual | Sugerencia de borrador (la persona valida) | Ampliado |
| Stock por serie | Trazabilidad variable | Saber qué módem/ONU está en qué domicilio | Ampliado |
| Asistente WhatsApp en atención | No integrado | Con verificación; no reemplaza al operador | Nuevo |
| Incidente único masivo | Muchos tickets iguales | Un incidente, N socios | Nuevo |
| Asambleas | Tablas e informes | Quórum en vivo; credencial QR | Nuevo |
| Capital e institucional | Disperso en tablas | Asamblea, capital, actas integradas | Ampliado |

---

## IMG-N10 — Facturación, cobranza y mora (más allá de “igual”)

**Título:** Mismos comprobantes, más control

| Capacidad | Hoy en ProCoop | Qué suma CoopApps | Etiqueta |
|---|---|---|---|
| Emisión masiva | Muy capaz (DEMO ~12,5k comprobantes) | Lote con universo congelado; excepciones visibles | Ampliado |
| Prefactura y excepciones | Parcial | Quién no entra al lote y por qué | Ampliado |
| Explicar importe al socio | Saltos entre lectura y factura | Trazabilidad lectura → tarifa → renglón | Ampliado |
| Cobro sin guardar tarjeta | Riesgos en integraciones históricas | Medios mixtos y QR sin almacenar PAN | Ampliado |
| Intereses y mora | Varios cálculos dispersos | Un motor de intereses | Ampliado |
| Corte de servicio | Puede ejecutarse solo desde escritorio | Corte solo con confirmación en campo/red | Ampliado |
| Plan de financiación | Sí | Costo financiero total visible; firma en portal | Ampliado |
| Código de barras legacy en transición | N/A | Convive en migración sin rechazar pagos | Nuevo |

---

## IMG-N11 — Técnica, redes y campo

**Título:** Del turno a la conformidad en un flujo

| Capacidad | Hoy en ProCoop | Qué suma CoopApps | Etiqueta |
|---|---|---|---|
| Factibilidad | Operaciones > Técnica | Vigencia definida (ej. 90 días); cobertura de red | Ampliado |
| Orden de trabajo | Sí | Mapa; estado visible al socio | Ampliado |
| Instalación internet/TV/tel | Tablas + técnica | Aprovisionamiento de red en el mismo recorrido | Ampliado |
| Lectura en campo | P-Móvil / carga manual | Foto, offline, motivo de excepción | Ampliado |
| Tercer consumo estimado | Reglas locales | Dispara inspección automática | Ampliado |
| Conflictos al sincronizar campo | Poco supervisados | Resolución con supervisión | Ampliado |
| Electrodependencia y ventanas de corte | Parametría | Reglas normativas por tipo de servicio | Ampliado |

---

## IMG-N12 — Los 17 servicios con reglas escritas

**Título:** Electricidad, gas, agua… y también sepelio y vivienda

**Texto intro:** En ProCoop las reglas viven en tablas. En CoopApps cada familia de servicio tiene recorrido y controles explícitos.

| Servicio | Hoy en ProCoop | Qué suma CoopApps | Etiqueta |
|---|---|---|---|
| Electricidad | Sí (DEMO) | Electrodependencia, generación distribuida, ventanas de corte | Ampliado |
| Gas | Sí | Reconexión con inspección cuando corresponde | Ampliado |
| Agua | Sí | Mínimo vital | Ampliado |
| Cloacas | Sí | No asumir “agua = cloaca” | Ampliado |
| Internet / TV / Teléfono | Sí | Misma ficha + red | Ampliado |
| Sepelio | Tablas | Urgencia no bloqueada solo por deuda | Ampliado |
| Cementerio / parque | Tablas | Mora no libera unidad sin regla | Ampliado |
| Vivienda | Menú planes | Etapas, vales, seguimiento | Ampliado |
| Capital social | Tablas | Integrado al pagar en factura | Ampliado |

**Pie:** Principios comunes nuevos: alta provisoria, suspensión voluntaria, cambio de plan, protecciones normativas no apagables con un switch.

---

## IMG-N12b — Los 17 servicios (complemento)

**Título:** Todas las familias de servicio, con reglas explícitas (2/2)

| Servicio | Hoy en ProCoop | Qué suma CoopApps | Etiqueta |
|---|---|---|---|
| Alumbrado público | En factura | Bloque y rendición separados | Igual / más claro |
| Obras / contribución | Cuotas en factura | Cuotas con ajuste en la última | Igual / más claro |
| Banco de sangre | Tablas | Administración sin datos clínicos | Ampliado |
| Salud / ambulancias | Tablas | Gestión administrativa acotada | Ampliado |
| Tasas de terceros | En comprobante | Bloque separado y rendición al ente | Ampliado |
| Ortopedia y otros | Parcial | Configurable por familia sin programar | Ampliado |
| Telefonía (normas mora) | Parametría | Reglas de entrantes y emergencias | Ampliado |

**Por qué importa (gerencia):** Una sola cooperativa multiservicio no improvisa en sepelio lo mismo que en electricidad.

---

## IMG-N13 — Integraciones y datos de la cooperativa

**Título:** De credenciales en el programa a integración gobernada

| Capacidad | Hoy en ProCoop | Qué suma CoopApps | Etiqueta |
|---|---|---|---|
| Credenciales ARCA, pasarelas, correo | En programa o tablas | Bóveda; prueba y producción separadas | Ampliado |
| Probar conexión | Manual | Botón por integración con diagnóstico | Ampliado |
| Estado “incierto” fiscal/cobro | Reintentos opacos | Marcado antes de reintentar comprobante o cobro | Ampliado |
| Exportar a Excel / BI | Power BI e integra dispersos | Reportes + exportación; API documentada en etapa final del plan | Ampliado |
| Agente impresoras/lectores | Mezclado con Agente portal | Componente dedicado sin copiar socios | Ampliado |
| Tablas fiscales | Mantenimiento por cooperativa | Mantenimiento de catálogos fiscales por plataforma | Ampliado |
| Datos para tableros propios | “Los datos son suyos pero…” | Indicadores certificados mismos en todos los canales | Ampliado |

**Viñeta ámbar (opcional):** API OpenAPI administrada por la cooperativa — planificada para la última etapa del despliegue; antes: exportaciones y reportes programados.

---

## IMG-N14 — Seguridad y cumplimiento verificable

**Título:** Estándares actuales, no solo buenas intenciones

| Tema | Hoy en ProCoop (relevamiento) | Qué suma CoopApps | Etiqueta |
|---|---|---|---|
| Contraseñas | Patrones reversibles detectados en código | Política moderna; doble factor | Ampliado |
| Credenciales en cliente | Valores fijos en integraciones | Sin secretos embebidos en apps del socio | Modelo distinto |
| Aislamiento entre cooperativas | Multitenancy lógico en legacy | Aislamiento por tenant en nube | Modelo distinto |
| Ley de datos personales | Implícito | Diseño alineado a protección de datos | Ampliado |
| Pruebas de seguridad | Ad hoc | Referencia OWASP en especificación | Ampliado |
| Privacidad entre convivientes | Limitada | Dos titulares, un domicilio, datos separados | Ampliado |

---

## IMG-N15 — Los siete dolores del relevamiento (respuesta)

**Título:** Lo que pidieron en el primer relevamiento y cómo responde la especificación

| Dolor | Hoy | Respuesta CoopApps |
|---|---|---|
| D1 No está en la nube | Instalación local | SaaS multitenant |
| D2 Servidores propios | SQL y agente en la cooperativa | Sin operar servidores del tenant |
| D3 Sin API usable | Integra sin API por recurso | API tokenizada (calendario final) + exportaciones antes |
| D4 App del socio pobre | CoopOnline limitado | Portal/app marca propia; ciclo completo |
| D5 Sin identidad de marca | Web genérica | Logo, colores, dominio, PWAs |
| D6 Seguridad | Hallazgos en código relevado | 2FA, bóveda, auditoría, estándares |
| D7 Soporte ineficiente | Remoto sin caso | Ticket, estado, acceso temporal auditado |

---

## IMG-N15b — Otros pedidos del relevamiento (marketing con prueba)

**Título:** También respondimos lo que el mercado pidió aparte de los “siete dolores”

| Pedido | Hoy en ProCoop | Qué suma CoopApps | Por qué importa |
|---|---|---|---|
| Los datos son de la cooperativa (BI propio) | Exportaciones dispersas | Exportación tenant + indicadores certificados | Tableros sin pelearse con Excel |
| Diccionario (socio / asociado / usuario) | Textos fijos | Diccionario por cooperativa | La cooperativa habla como su consejo |
| Prender/apagar servicios sin programar | Tablas y consultoría | Catálogo versionado por familia | Habilitar sepelio o gas sin proyecto IT |
| Copiar config entre servicios/cooperativas | Manual | Asistido en catálogo | Menos meses de parametrización |
| Factura masiva con excepciones visibles | Emisión fuerte, excepciones opacas | Lote con universo y lista de “no entran” | Menos reproceso el día de emisión |
| Instalación punta a punta | Tramos en varios menús | Un recorrido: turno, visita, stock, encuesta | Menos fricción en venta de internet |
| Dos titulares, un domicilio | Difícil | Privacidad entre convivientes | Menos errores y reclamos |
| 2FA y login moderno | Básico | Doble factor en especificación | Menos cuentas comprometidas |

---

## IMG-N16 — Escala de la especificación (sin tecnicismos de implementación)

**Título:** No es “una pantalla nueva”: es un sistema completo especificado

| Concepto | ProCoop (relevamiento) | CoopApps (especificación) |
|---|---|---|
| Menú escritorio catalogado | 120 funciones, 9 pestañas | 119 con destino + reorganización en gestión web |
| Pantallas y menús en todas las apps | — | Más de 1.000 pantallas; menús reorganizados por proceso |
| Requisitos funcionales escritos | — | Más de 4.200 |
| Reglas de negocio documentadas | Extraídas del código | Más de 2.600 |
| Familias de servicio con ficha | Implícitas en tablas | 17 con recorrido controlado |
| Roles plantilla | Armados a mano | 40 perfiles de partida ajustables |
| Fichas de integración | ~23 bloques en relevamiento | Más de 100 integraciones documentadas |

**Por qué importa:** El “más” no es marketing: está escrito en requisitos y olas de construcción.

---

## IMG-N17 — Migración sin apagar un viernes

**Título:** Convivencia y cierre por etapas

| Idea | ProCoop típico | Qué suma CoopApps |
|---|---|---|
| Estrategia | Cambio big bang | Paralelo factura a factura |
| Contabilidad | Un solo libro | Libro paralelo hasta conciliar |
| Sueldos | Un solo motor | Hasta dos meses en paralelo si hace falta |
| Corte comercial | — | Piloto en etapa intermedia del plan |
| Apagado administrativo | — | Cuando dos ciclos concilien |
| Usuarios del portal | Re-registro | Vinculación cuando hay datos exportables |

---

## IMG-N18 — Matriz maestra “¿ProCoop lo tiene?” (20 ítems, parte 1)

**Título:** Inventario del plus (1/2) — 20 capacidades **Nuevo** o **muy Ampliado** (verificadas en especificación)

Use tabla 4 columnas: # | Capacidad | ¿ProCoop? | CoopApps

Filas 1–10 (texto literal):
1 Landing dominio propio | No como producto | Sí  
2 Sandbox por cooperativa | No | Sí  
3 Espacio empleado separado | No | Sí  
4 App campo unificada | Parcial P-Móvil | Sí  
5 Quórum asamblea en vivo | No | Sí  
6 Incidente masivo único | No | Sí  
7 Portal proveedor | No | Sí  
8 Anti-fraude CBU | No | Sí  
9 Bóveda credenciales | No | Sí  
10 Indicadores certificados | No | Sí  

---

## IMG-N19 — Matriz maestra (parte 2)

Filas 11–20:
11 Comunidad muro/encuestas | Solo SMS | Sí  
12 Diccionario por cooperativa | No | Sí  
13 Simulación publicación parámetros | No | Sí  
14 Expediente digital unificado | Parcial | Sí  
15 Trámites web con bandeja operador | Parcial WEB | Sí  
16 Autolectura con foto | Limitado | Sí  
17 Pago tercero sin ver cuenta ajena | No | Sí  
18 Libro sueldo digital habilitado | A veces apagado | Sí  
19 Contabilidad automática por operación | Parcial | Sí  
20 API administrada cooperativa | No documentada | Plan final + export antes  

---

## IMG-N20 — Comparativo de canales (diagrama mental)

**Título:** De dos piezas (escritorio + copia) a ocho canales sobre un dato

**Centro:** Una sola información operativa.  
**Alrededor (8 etiquetas):** Gestión web · App socio · Empleados · Campo · Sitio público · Tótem · Plataforma · Integraciones.  
**Hoy (gris):** ProCoop.exe + Agente + CoopOnline/P-Móvil sobre copia.  
**Por qué importa:** Menos reclamos, menos reprocesos, más canales sin multiplicar verdades.

---

## IMG-N21 — Qué NO decir en la reunión (honestidad)

**Título:** Frases prohibidas y cómo decirlo bien

| Evitar | Decir |
|---|---|
| “ProCoop no tiene app” | “Tiene CoopOnline y P-Móvil; están limitados por la copia y poca marca propia.” |
| “API desde el día 1” | “Exportaciones y reportes al inicio; API documentada en la etapa final del plan.” |
| “Mismas pantallas” | “Mismo negocio; pantallas web y reglas adicionales.” |
| “Sin ProCoop mañana” | “Migración por olas con convivencia.” |

---

## IMG-N23 — Una frase por audiencia (slide comercial)

**Título:** Por qué importa, según quién mira

| Audiencia | Frase visible (marketing honesto) |
|---|---|
| Consejo | Menos riesgo de parque, datos y reputación; migración por etapas, no apagón. |
| Gerencia general | Una sola verdad para oficina, campo y socio; decisiones con números iguales en todos lados. |
| Atención y ventas | Marca propia, trámites con expediente y plazos; el socio deja de “cazar” el saldo. |
| Facturación y mora | Lotes controlados, un motor de intereses, corte solo confirmado. |
| Técnica y campo | Una app, obra visible para el socio, serie del equipo en domicilio. |
| Contador y auditoría | Trazas, libro sueldo digital, asientos desde operaciones. |
| Socio | Pagar, reclamar y dar de baja con la marca de su cooperativa, sobre la misma cuenta que ve caja. |

**Gancho central:** ProCoop probó que el negocio se puede; CoopApps lo especifica para la nube y el siglo XXI digital del socio.

---

## IMG-N22 — Cierre ejecutivo

**Título:** CoopApps = ProCoop en alcance + plataforma moderna

Checklist visual (6 ✓):
1. Menú relevado cubierto (119/120) — detalle en deck IMG-F.  
2. **Ocho aplicativos** frente a escritorio + copia.  
3. **Marca y app del socio** con dato único.  
4. **Más funciones** sin botón en ProCoop (comunidad, asamblea, proveedor, sandbox…).  
5. **Migración** sin big bang.  
6. **Datos exportables** y camino a API propia.

---

## C. Orden sugerido al generar

| Orden | Código | Uso en reunión |
|---|---|---|
| 1 | N00, N01 | Abrir |
| 2 | N02, N20 | Ocho apps |
| 3 | N03–N05 | Plataforma y “sin botón” |
| 4 | N06–N07 | Socio |
| 5 | N08–N11 | Gestión y operación |
| 6 | N12 | 17 servicios |
| 7 | N13–N14 | Datos y seguridad |
| 8 | N15 | Dolores |
| 9 | N16–N17 | Escala y migración |
| 10 | N12b | 17 servicios completo |
| 11 | N15b | Pedidos extra del relevamiento |
| 12 | N18–N19 | Inventario 20 ítems (anexo denso) |
| 13 | N23 | Frases por audiencia (comercial) |
| 14 | N21–N22 | Honestidad y cierre |

---

## D. Relación con otros materiales

| Necesidad | Archivo |
|---|---|
| Menú 120 ítems Hoy vs CoopApps | `comparativo-funcional-megaspec-unificado.md` + IMG-F |
| Comparativo corto consejo | `comparativo-funcional-procoop-vs-coopapps-PROMPT-CLAUDE-COMPLETO.md` (IMG-C) |
| Dolores antes/después | `dolores-procoop-antes-y-despues.md` (IMG-D) |
| **Este deck: lo nuevo** | **Este archivo** (IMG-N) |
| **Lista por aplicativo (1 línea/funcción)** | [`enumeracion-funciones-por-aplicativo.md`](./enumeracion-funciones-por-aplicativo.md) |