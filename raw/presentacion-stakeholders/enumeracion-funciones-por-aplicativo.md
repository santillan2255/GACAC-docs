# Enumeración funcional por aplicativo — ProCoop vs CoopApps

Cada ítem es **una línea** (función o capacidad), agrupado por **aplicativo** y **módulo**. Fuente: `roles-y-modulos-para-claude.md` (T03 §10.8, grupos C01–C18), comparativo menú PC-001…120, relevamiento CoopOnline/Agente.

| | ProCoop (legacy) | CoopApps (especificación) |
|---|---|---|
| Aplicativos | Escritorio + CoopOnline + P-Móvil + Agente + Integra | 8 aplicaciones + API |
| Ítems de menú catalogados | 120 funciones escritorio | 558 ítems (402 en gestión web) |

---

## Parte 1 — CoopApps (por aplicación)

### 1. Sistema de gestión web (navegador, personal de la cooperativa)

Catálogo oficial de menú: **402** ítems `SM-ADM-*` en **18** grupos (C01–C18); esta lista tiene **329** capacidades desglosadas en **21** módulos.

**Cantidad total:** 329 líneas en **21** módulo(s).

#### Módulo: C01 Inicio

*10 funciones*

1. Tablero de la cooperativa: indicadores del día y accesos directos.
2. Mi bandeja de tareas: aprobaciones y tareas pendientes del usuario.
3. Alertas: comprobantes fiscales pendientes y avisos críticos sin bloquear el inicio.
4. Avisos: novedades del producto y comunicaciones de la cooperativa.
5. Tablero de control: indicadores certificados para dirección.
6. Búsqueda global del menú (equivalente a buscar función en ProCoop).
7. Centro de ayuda contextual por pantalla.
8. Exportar e imprimir listados desde cualquier grilla.
9. Vistas guardadas de tablas (reemplaza formularios personalizados WinForms).
10. Atajos y favoritos del usuario en el mapa del sitio.

#### Módulo: C02 Socios y cuentas (M01)

*17 funciones*

11. Personas: alta y mantenimiento de identidad (DNI/CUIT, contacto).
12. Titulares: ficha integral con cuentas, servicios e historial.
13. Cuentas: estado de cuenta, débitos y habilitaciones.
14. Grupos de facturación: facturar varios servicios en un mismo comprobante.
15. Inmuebles y domicilios: ubicación del suministro y domicilio postal.
16. Autorizados y representantes: quién puede actuar por el titular y con qué permisos.
17. Grupo familiar y adherentes: coberturas sociales vinculadas.
18. Documentación del titular: archivos y constancias.
19. Unificación de duplicados: fusionar personas repetidas con trazabilidad.
20. Consultas e informes de titulares: listados del padrón.
21. Configuración de tablas de titulares (dominios del módulo).
22. Bloqueos y excepciones en ficha (según reglas de negocio).
23. Línea de tiempo de gestiones sobre el titular.
24. Privacidad entre convivientes del mismo domicilio.
25. Representaciones legales y poderes.
26. Historial de cambios en datos sensibles.
27. Exportación del padrón para campañas autorizadas.

#### Módulo: C03 Servicios (M02)

*12 funciones*

28. Catálogo de servicios: familias habilitadas en la cooperativa.
29. Planes comerciales y comerciales de cada servicio.
30. Productos y subservicios dentro de un plan.
31. Categorías tarifarias y clasificación.
32. Particularidades normativas por tipo de servicio.
33. Requisitos de alta por servicio.
34. Copiar configuración de servicio desde otra cooperativa o plantilla.
35. Servicios contratados por cuenta.
36. Altas de servicio con circuito comercial.
37. Bajas y suspensiones con causas y plazos.
38. Cambios de plan o titularidad del servicio.
39. Versionado de fichas de servicio.

#### Módulo: C04 Medición (M03)

*19 funciones*

40. Medidores y puntos de medición.
41. Rutas de lectura por zona y lecturista.
42. Registro de lecturas (oficina y validación).
43. Validación de consumos y reglas de estimación.
44. Estimaciones automáticas y tercera estimada → inspección.
45. Autolecturas enviadas por el socio.
46. Telemedición: administración, informes y parámetros.
47. Prepago y recargas de saldo.
48. Opciones de telefonía/consumos asociados.
49. Informes de consumos y telemedición.
50. Excepciones de lectura con motivo.
51. Fotos y evidencia en lecturas de campo.
52. Corrección supervisada de lecturas.
53. Períodos de facturación vinculados a lecturas.
54. Histórico de lecturas por medidor.
55. Comparación lectura vs facturado.
56. Reglas de consumo mínimo y máximo.
57. Integración lectura → factura (trazabilidad).
58. Dashboard de avance de rutas.

#### Módulo: C05 Facturación (M04, M05, M06)

*24 funciones*

59. Cuadros tarifarios versionados.
60. Conceptos y cargos facturables.
61. Promociones y bonificaciones.
62. Subsidios y tarifa social.
63. Simulador de cálculo antes de publicar tarifa.
64. Ciclos y calendarios de facturación.
65. Lotes de facturación con universo congelado.
66. Bandeja de no facturables (excepciones visibles).
67. Comprobantes emitidos y reimpresión.
68. Pendientes de autorización ante ARCA.
69. Notas de crédito y débito.
70. Movimiento de conceptos entre cuadros.
71. Distribución y envío de comprobantes (mail, portal).
72. Libro IVA ventas digital.
73. Percepciones y retenciones en ventas.
74. Regímenes informativos y padrones fiscales.
75. Tasas de terceros en factura con rendición.
76. Reguladores y bloques normativos.
77. Contingencia fiscal (CAEA/CAE).
78. Prefactura y control previo a emisión masiva.
79. Multiservicio en un mismo comprobante.
80. Factura digital y adhesión del socio.
81. Autorización masiva con excepciones.
82. Reimpresión y segunda vía con QR.

#### Módulo: C06 Cobranza (M07)

*14 funciones*

83. Cuenta corriente del titular.
84. Apertura y cierre de caja.
85. Cobranza en mostrador (efectivo y medios mixtos).
86. Entes recaudadores y cupones.
87. Débitos automáticos en cuenta.
88. Pasarelas de pago y tarjetas sin guardar PAN.
89. Conciliación de cobranzas.
90. Pagos no identificados y asignación.
91. Devoluciones y contracargos.
92. Informes de cobranza.
93. Código de barras y QR en cupón.
94. Configuración de cajas y puntos de venta.
95. Rendición de cobrador de campo.
96. Integración cobro web confirmado antes de imputar.

#### Módulo: C07 Mora (M08)

*17 funciones*

97. Emitir planes de financiación con CFT visible.
98. Generar primera notificación de mora.
99. Tratamiento de notificaciones generadas.
100. Tratamiento de morosos.
101. Intereses y recargos (motor único).
102. Notificaciones multicanal de mora.
103. Causas de baja de servicio.
104. Instancias de mora y etapas.
105. Excepciones (electrodependientes, ventanas legales).
106. Suspensiones, cortes y reconexiones confirmadas.
107. Garantías y cauciones.
108. Incobrables y prescripción.
109. Gestión judicial de deuda.
110. Informes de mora y financiación.
111. Firma de convenio en portal.
112. Constancia de entrega de notificación.
113. Corte no ejecutable solo desde escritorio.

#### Módulo: C08 Atención (M09)

*22 funciones*

114. Bandeja de atención omnicanal.
115. Carga rápida de reclamos.
116. Solicitudes comerciales.
117. Reclamos con plazos y estados.
118. Trámites web recibidos del portal.
119. Conversaciones con el socio.
120. Expediente digital por gestión.
121. Incidentes masivos (un incidente, muchos socios).
122. Boxes y turnero presencial.
123. Estadísticas del turnero.
124. Actividades internas de seguimiento.
125. Tipos, estados y SLA de gestiones.
126. Informes de atención y mesa de entradas.
127. Integración WhatsApp con verificación.
128. Turno online vinculado a box.
129. Selección de turnos y tótem.
130. Mesa de entradas administración e incidentes.
131. Autorización de operaciones puntuales.
132. Encuestas post-gestión.
133. Asignación y reasignación de casos.
134. Incidente con foto en campo vinculado.
135. Historial visible al socio en portal.

#### Módulo: C09 Técnica (M10)

*25 funciones*

136. Agenda y visitas técnicas.
137. Factibilidades con vigencia.
138. Órdenes de trabajo y despacho.
139. Mapa de campo y cuadrillas.
140. Contratistas externos.
141. Instalaciones y conformidad del socio.
142. Aprovisionamiento de Internet/TV/Tel.
143. Redes, GIS y nodos.
144. Obras y mantenimiento de red.
145. Informes técnicos.
146. Telemedición operativa (administración).
147. Carga rápida vinculada a expediente.
148. Estados de OT visibles al socio.
149. Materiales usados en OT desde stock.
150. Instalación integral punta a punta.
151. Inspecciones y relevamientos.
152. Vivienda materiales y construcción (planes).
153. Informes de vivienda.
154. Integración factibilidad → OT → factura.
155. Geolocalización de órdenes.
156. Conflictos de sincronización supervisados.
157. Equipos serializados en instalación.
158. Encuesta post-visita.
159. Aviso al socio “técnico en camino”.
160. Reprogramación de visitas.

#### Módulo: C10 Ventas (M11)

*10 funciones*

161. Presupuestos con envío y aceptación online.
162. Venta de productos.
163. Punto de venta en mostrador.
164. Informes de ventas.
165. Presupuesto aceptado → orden de trabajo.
166. Stock de productos en POS.
167. Medios de cobro en venta.
168. Comprobante fiscal de venta.
169. Promociones en mostrador.
170. Devoluciones de venta.

#### Módulo: C11 Compras (M12)

*12 funciones*

171. Proveedores y datos fiscales.
172. Solicitudes de aprovisionamiento.
173. Solicitudes de cotización.
174. Órdenes de compra.
175. Remitos de proveedores.
176. Comprobantes de proveedores (tres vías).
177. Pagos a proveedores con bloqueos.
178. Retenciones practicadas en compras.
179. Portal del proveedor (invitación).
180. Anti-fraude por cambio de CBU.
181. Sugerencia de borrador de factura (validación humana).
182. Informes de compras y correspondencia.

#### Módulo: C11 Stock (M13)

*11 funciones*

183. Artículos y depósitos.
184. Movimientos de stock.
185. Equipos serializados y comodatos.
186. Trazabilidad por serie (módem, ONU).
187. Operaciones especiales de stock.
188. Bienes de uso.
189. Fabricación.
190. RMA y devoluciones.
191. Custodia por cuadrilla.
192. Stock en vehículo (campo).
193. Informes de stock.

#### Módulo: C11 Tesorería (M14)

*12 funciones*

194. Cuentas bancarias propias.
195. Movimientos bancarios y de tesorería.
196. Valores de terceros.
197. Cheques propios y electrónicos.
198. Cupones de tarjetas.
199. Retenciones recibidas.
200. Cajas de pagos a proveedores.
201. Cierre de cajas central.
202. Conciliación bancaria asistida.
203. Interbanking.
204. Planificación de fondos (tránsito vs disponible).
205. Informes de tesorería.

#### Módulo: C11 Contabilidad (M15)

*13 funciones*

206. Plan de cuentas.
207. Ejercicios y períodos.
208. Centros de costo.
209. Asientos manuales y automáticos.
210. Consulta de mayor.
211. Balance y sumas y saldos.
212. Planes contables múltiples y simulaciones.
213. Presupuesto económico.
214. Herramientas contables.
215. Informes contables y de gestión.
216. Contabilidad paralela en migración.
217. Asiento desde cada operación (factura, cobro, compra).
218. Libro IVA compras.

#### Módulo: C12 Personal / sueldos (M16)

*19 funciones*

219. Empleados y legajos.
220. Empresas empleadoras.
221. Recibos de sueldo.
222. Novedades del período.
223. Liquidación masiva.
224. Simulador de liquidación.
225. Impuesto a las ganancias (4.ª cat.).
226. Variables de liquidación.
227. Conceptos de haberes y descuentos.
228. Aplicar aumentos.
229. Libro de sueldos digital y F.931.
230. Informes de sueldos.
231. Quien calcula no aprueba (separación de funciones).
232. Recibo firmado en app del empleado.
233. Importación de nómina externa antes de liquidar.
234. Portal del empleado (recibos, licencias).
235. Certificados laborales.
236. Vacaciones y licencias.
237. Evaluaciones (si aplica política).

#### Módulo: C13 Institucional (M17)

*8 funciones*

238. Padrón de asociados.
239. Capital social y aportes.
240. Asambleas y quórum.
241. Consejo y actas.
242. Reuniones institucionales.
243. Presentaciones INAES.
244. Credencial de asociado.
245. Quórum en vivo con QR.

#### Módulo: C14 Servicios sociales (M18)

*19 funciones*

246. Planes de vivienda (materiales, construcción, vales).
247. Sepelio y urgencias.
248. Cementerio parque.
249. Salud y ambulancias (administrativo).
250. Banco de sangre (sin datos clínicos).
251. Vehículos y choferes.
252. Viajes y traslados.
253. Seguimiento GPS de flota.
254. Informes de servicios sociales.
255. Adherentes a coberturas.
256. Prestaciones por servicio social.
257. Reglas de mora en cementerio.
258. Sepelio sin bloqueo solo por deuda.
259. Integración vivienda con atención.
260. Asignación de unidades cementerio.
261. Flota integrada a órdenes.
262. Combustible y mantenimiento vehicular.
263. Actos en cementerio desde app empleado.
264. Urgencias administrativas.

#### Módulo: C15 Comunidad (T09)

*17 funciones*

265. Publicaciones en muro.
266. Moderación de contenidos.
267. Boletines.
268. Centro de comunicaciones.
269. Plantillas de mensajes.
270. Campañas y avisos push.
271. SMS masivos.
272. Saludos automáticos.
273. Encuestas.
274. Audiencias por zona.
275. Eventos y beneficios.
276. Avisos de corte solo a afectados.
277. NPS post-factura.
278. Comunicación multicanal unificada.
279. Segmentación por servicio o zona.
280. Calendario de publicaciones.
281. Estadísticas de lectura.

#### Módulo: C16 Sitio y portal (M19)

*13 funciones*

282. Landing pública por bloques.
283. Usuarios del portal (alta, bloqueo).
284. Trámites web y requisitos.
285. Archivos publicados en web.
286. Bajas públicas recibidas.
287. Configuración del portal y marca.
288. Operaciones web (pagos, adhesiones).
289. Logos y PDF web.
290. Dominio propio y publicación.
291. WCAG y accesibilidad.
292. Bandeja operador para trámites web.
293. Historial de cambios en portal.
294. Integración trámites con expediente.

#### Módulo: C17 Reportes (T10)

*13 funciones*

295. Catálogo de reportes.
296. Salas de inteligencia.
297. Editor de reportes.
298. Informes personalizados.
299. Exportaciones programadas.
300. APIs para terceros (según plan).
301. Indicadores certificados.
302. Drill-down al documento origen.
303. Jobs en segundo plano.
304. Procesos personalizados.
305. Power BI / exportaciones.
306. Informes de gestión.
307. Tablero certificado = Excel.

#### Módulo: C18 Configuración (T01–T07, T11)

*22 funciones*

308. Usuarios y doble factor.
309. Roles por acción.
310. Perfiles de pantallas.
311. Alcances (sucursal, caja, zona).
312. Auditorías y sesiones.
313. Datos de la cooperativa.
314. Sucursales y puntos de venta.
315. Tablas maestras y parámetros versionados.
316. Geografía y calles.
317. Marca e identidad omnicanal.
318. Diccionario de términos.
319. Autorización de operaciones y workflows.
320. Plantillas de documentos.
321. Integraciones y bóveda de credenciales.
322. Migración desde ProCoop y convivencia.
323. Paralelo factura a factura.
324. Soporte, licencia y casos.
325. Respaldos y exportación del tenant.
326. Ambiente de prueba (sandbox).
327. Autorizaciones multinivel.
328. Simulación de publicación de parámetros.
329. “En uso por” antes de borrar tablas.

### 2. App del socio (PWA/web, titulares y representantes)

Especificación: **49** ítems de menú del socio.

**Cantidad total:** 48 líneas en **8** módulo(s).

#### Módulo: Inicio y avisos

*4 funciones*

1. Inicio con accesos y avisos.
2. Avisos personalizados.
3. Notificaciones push.
4. Instalar PWA con marca de la cooperativa.

#### Módulo: Cuentas y servicios

*6 funciones*

5. Cuentas y servicios activos.
6. Detalle de cada servicio contratado.
7. Vincular cuenta existente.
8. Vincular cuenta con código seguro.
9. Contratar un servicio nuevo.
10. Baja, suspensión o reactivación.

#### Módulo: Facturas, pagos y deuda

*10 funciones*

11. Mis facturas y comprobantes PDF.
12. Detalle de factura y renglones.
13. Descarga de factura con QR.
14. Pagar con medios habilitados.
15. Pago por tercero sin ver cuenta ajena.
16. Resumen de cuenta y saldo.
17. Adhesión a débito automático y factura digital.
18. Planes de pago y cuotas.
19. Mi deuda y avisos de mora.
20. Firma digital en convenios.

#### Módulo: Consumos y prepago

*4 funciones*

21. Mis consumos e historial.
22. Autolectura con foto.
23. Cargar saldo prepago.
24. Ver consumo prepago y alertas.

#### Módulo: Gestiones, visitas y trámites

*11 funciones*

25. Nueva gestión y seguimiento de trámites.
26. Estado de visitas técnicas.
27. Conformidad de instalación.
28. Turnos online y presenciales.
29. Trámites y requisitos digitales.
30. Constancias y documentos.
31. Cortes programados e interrupciones.
32. Estado de reclamo en tiempo real (misma base que caja).
33. Chat/atención sobre gestión abierta.
34. Mis presupuestos aceptados.
35. Historial de gestiones previas (migración).

#### Módulo: Comunidad y encuestas

*3 funciones*

36. Comunidad: publicaciones, encuestas, beneficios.
37. Adherirse a comunicaciones opt-in.
38. Encuesta NPS.

#### Módulo: Institucional y servicios sociales

*2 funciones*

39. Servicios sociales, cementerio y vivienda.
40. Capital social y asambleas.

#### Módulo: Perfil, representantes y seguridad

*8 funciones*

41. Perfil, datos, autorizados y preferencias.
42. Representantes con permisos por acción.
43. Consulta sin login con datos enmascarados.
44. Verificar autenticidad de documento.
45. Mapa de sucursales y contacto.
46. Preferencias de accesibilidad.
47. Sesiones y cierre de dispositivos.
48. Ayuda y asistente (solo sugerencias, no ejecuta).

### 3. App del empleado (PWA, personal)

**Cantidad total:** 27 líneas en **5** módulo(s).

#### Módulo: Trabajo del día

*6 funciones*

1. Inicio con pendientes del día.
2. Bandeja personal.
3. Casos asignados.
4. Aprobaciones pendientes.
5. Agenda de actividades.
6. Avisos internos.

#### Módulo: Supervisión y comunicación interna

*6 funciones*

7. Pendientes sin asignar (supervisores).
8. Excepciones de proceso.
9. Indicadores del equipo.
10. Publicar aviso al equipo.
11. Encuestas y boletines internos.
12. Mi equipo (jefes).

#### Módulo: Legajo y recibos

*7 funciones*

13. Mis recibos de sueldo.
14. Firmar recibo digitalmente.
15. Directorio interno.
16. Vacaciones y licencias.
17. Mis datos y documentos laborales.
18. Mis certificados.
19. Mis evaluaciones.

#### Módulo: Funciones por rol (tesorería, stock, institucional)

*5 funciones*

20. Firma de pagos (tesorería).
21. Posición de tesorería (gerencia).
22. Entregas de depósito (stock).
23. Acreditación en asamblea.
24. Actos en cementerio parque.

#### Módulo: Perfil y seguridad

*3 funciones*

25. Perfil y preferencias.
26. Asistente interno (sugerencias).
27. Doble factor y seguridad de sesión.

### 4. App de campo (PWA offline, técnicos, lecturistas, cobradores)

**Cantidad total:** 19 líneas en **4** módulo(s).

#### Módulo: Órdenes técnicas y campo

*8 funciones*

1. Hoy: resumen de tareas del día.
2. Órdenes asignadas.
3. Ejecución de orden con checklist.
4. Instalación integral (stock, firma, fotos).
5. Cortes y reconexiones con confirmación.
6. Inspecciones y relevamientos.
7. Reclamo rápido en campo.
8. Incidente con foto y GPS.

#### Módulo: Lecturas

*3 funciones*

9. Rutas de lectura.
10. Toma de lectura con excepción.
11. Lectura fuera de ruta.

#### Módulo: Cobranza, stock y logística

*6 funciones*

12. Cobranza en domicilio.
13. Rendición de cobranza.
14. Stock en vehículo.
15. Reparto de facturas impresas.
16. Mapa de paradas.
17. Viajes y logística.

#### Módulo: Sincronización y perfil

*2 funciones*

18. Sincronización offline.
19. Perfil y preferencias del agente de campo.

### 5. Sitio público / landing

**Cantidad total:** 34 líneas en **5** módulo(s).

#### Módulo: Contenido institucional

*15 funciones*

1. Inicio institucional.
2. Catálogo de servicios y requisitos.
3. Noticias y novedades.
4. Cuadros tarifarios publicados.
5. Contacto y sucursales.
6. Descarga de estatuto o reglamento.
7. Mapa de red o cobertura (si publica).
8. Estado de obra o proyecto público.
9. Legales, privacidad y ayuda.
10. Accesibilidad del sitio.
11. Cookies y consentimiento.
12. Multi-idioma (si habilitado).
13. Banner de incidente masivo.
14. RSS o feeds de noticias.
15. Landing de campaña estacional.

#### Módulo: Autoservicio sin ingreso

*6 funciones*

16. Pagar sin ingresar (datos enmascarados).
17. Consultar deuda sin ingresar.
18. Reclamo o solicitud anónima.
19. Seguimiento de gestión por código.
20. Verificar documento emitido.
21. Chat público o bot de primer nivel.

#### Módulo: Trámites y servicios públicos

*8 funciones*

22. Baja de servicio online.
23. Turno online.
24. Estado del servicio y cortes.
25. Trámites y requisitos descargables.
26. Asambleas y convocatorias.
27. Buscar difunto (cementerio).
28. Oferta comercial y contratación.
29. Formulario de contacto comercial.

#### Módulo: Acceso al portal y app

*3 funciones*

30. Registrarme como socio.
31. Ingresar al portal.
32. Instalar app del socio.

#### Módulo: Portales externos

*2 funciones*

33. Portal de proveedores (invitación).
34. Portal para desarrolladores (API).

### 6. Tótem y turnero en sucursal

**Cantidad total:** 2 líneas en **1** módulo(s).

#### Módulo: Turnero en sucursal

*2 funciones*

1. Selección de turno en sucursal (modo tótem).
2. Emisión de ticket de turno para box.

### 7. Consola de plataforma (equipo GoodApps, sin datos operativos del tenant)

**Cantidad total:** 25 líneas en **4** módulo(s).

#### Módulo: Tenants, licencias y contratos

*6 funciones*

1. Dashboard global de la plataforma.
2. Alta y gestión de tenants (cooperativas).
3. Alta asistida de nueva cooperativa.
4. Licencias, packs y módulos contratados.
5. Contratos SaaS.
6. Uso y consumo por tenant.

#### Módulo: Catálogo e integraciones globales

*6 funciones*

7. Catálogo de módulos del producto.
8. Catálogo global de servicios y plantillas.
9. Tablas comunes entre tenants.
10. Conectores de integración globales.
11. Diccionario base y plantillas.
12. Design system compartido.

#### Módulo: Operación, salud y ambientes

*8 funciones*

13. Soporte y accesos temporales auditados.
14. Salud del sistema y SLA.
15. Colas y jobs de procesamiento.
16. Respaldos y restauración.
17. Ambientes (prod, sandbox).
18. Versiones del producto desplegadas.
19. Monitoreo de BI y API.
20. Consumo de mensajería transaccional.

#### Módulo: Gobernanza, migración y avisos

*5 funciones*

21. Usuarios de plataforma.
22. Auditoría de plataforma.
23. Flags globales de funcionalidad.
24. Proyectos de migración ProCoop.
25. Avisos de plataforma a tenants.

### 8. API para terceros autorizados por la cooperativa

**Cantidad total:** 15 líneas en **3** módulo(s).

#### Módulo: Seguridad y gobernanza

*6 funciones*

1. Autenticación con token emitido por la cooperativa.
2. Cuotas y límites por cliente API.
3. Revocación de credenciales.
4. Ambiente de prueba para integradores.
5. Registro de llamadas y auditoría.
6. Documentación OpenAPI por recurso (plan final).

#### Módulo: Consultas

*5 funciones*

7. Consulta de titulares y cuentas (según permiso).
8. Consulta de comprobantes y saldos.
9. Consulta de lecturas y consumos.
10. Estado de órdenes técnicas.
11. Catálogo de servicios y tarifas publicadas.

#### Módulo: Operaciones, eventos e integración

*4 funciones*

12. Alta de gestiones o reclamos.
13. Webhooks de eventos (pago, factura, corte).
14. Exportaciones masivas programadas.
15. Sincronización con BI externo.

---

## Parte 2 — ProCoop y piezas legacy (por aplicación)

### 1. ProCoop.exe — programa de escritorio (9 pestañas)

**Cantidad total:** 120 funciones de menú relevadas (+ exportar/imprimir en grillas), en **13** módulos (pestañas / subáreas).

#### Módulo: Pantalla principal e inicio

1. **Alerta modal FE pendientes** — opción de menú escritorio (PC-001).
2. **Grilla comprobantes pendientes autorizar** — opción de menú escritorio (PC-002).
3. **Centro de notificaciones** — opción de menú escritorio (PC-003).
4. **Noticias del producto** — opción de menú escritorio (PC-004).

#### Módulo: Servicios a Titulares — Titulares

5. **Administración de Titulares** — opción de menú escritorio (PC-005).
6. **Administración de Personas** — opción de menú escritorio (PC-006).
7. **Consultas e Informes titulares** — opción de menú escritorio (PC-007).

#### Módulo: Servicios a Titulares — Consumos

8. **Registro de Lectura** — opción de menú escritorio (PC-008).
9. **Telemed** — opción de menú escritorio (PC-009).
10. **Opciones de consumos** — opción de menú escritorio (PC-010).
11. **Opciones de Telefonía** — opción de menú escritorio (PC-011).
12. **Informes de Consumos** — opción de menú escritorio (PC-012).

#### Módulo: Servicios a Titulares — Ventas y facturación

13. **Presupuestos** — opción de menú escritorio (PC-013).
14. **Venta de Productos** — opción de menú escritorio (PC-014).
15. **Facturación** — opción de menú escritorio (PC-015).
16. **Informes Ventas y Facturación** — opción de menú escritorio (PC-016).
17. **Libro IVA Ventas** — opción de menú escritorio (PC-017).
18. **Movimiento de Conceptos** — opción de menú escritorio (PC-018).

#### Módulo: Servicios a Titulares — Cobranza

19. **Apertura de Caja** — opción de menú escritorio (PC-019).
20. **Cobranza Local** — opción de menú escritorio (PC-020).
21. **Opciones de Cobranza** — opción de menú escritorio (PC-021).
22. **Informes de Cobranzas** — opción de menú escritorio (PC-022).
23. **Configuración submenú ST** — opción de menú escritorio (PC-023).

#### Módulo: Crédito y gestión de mora

24. **Emitir Plan de Financiación** — opción de menú escritorio (PC-024).
25. **Informes financiaciones** — opción de menú escritorio (PC-025).
26. **Generar Notificaciones (1ª)** — opción de menú escritorio (PC-026).
27. **Tratamiento Notificaciones Generadas** — opción de menú escritorio (PC-027).
28. **Tratamiento de Morosos** — opción de menú escritorio (PC-028).
29. **Notificaciones** — opción de menú escritorio (PC-029).
30. **Causas de Baja** — opción de menú escritorio (PC-030).
31. **Instancias de Mora** — opción de menú escritorio (PC-031).
32. **Excepciones de Mora** — opción de menú escritorio (PC-032).
33. **Informes de Mora** — opción de menú escritorio (PC-033).

#### Módulo: Operaciones

34. **Factibilidades** — opción de menú escritorio (PC-034).
35. **Órdenes** — opción de menú escritorio (PC-035).
36. **Carga Rápida de Reclamos** — opción de menú escritorio (PC-036).
37. **Informes Técnica** — opción de menú escritorio (PC-037).
38. **Telemed Administración** — opción de menú escritorio (PC-038).
39. **Telemed Informes** — opción de menú escritorio (PC-039).
40. **Telemed Configuración** — opción de menú escritorio (PC-040).
41. **Vivienda Materiales** — opción de menú escritorio (PC-041).
42. **Vivienda Construcción** — opción de menú escritorio (PC-042).
43. **Vivienda Informes** — opción de menú escritorio (PC-043).

#### Módulo: Compras y Stock

44. **Solicitudes Aprovisionamiento** — opción de menú escritorio (PC-044).
45. **Solicitudes Cotización** — opción de menú escritorio (PC-045).
46. **Órdenes de Compra** — opción de menú escritorio (PC-046).
47. **Remitos** — opción de menú escritorio (PC-047).
48. **Comprobantes Proveedores** — opción de menú escritorio (PC-048).
49. **Pago a Proveedores** — opción de menú escritorio (PC-049).
50. **Retenciones compras** — opción de menú escritorio (PC-050).
51. **Stock Movimientos** — opción de menú escritorio (PC-051).
52. **Trazabilidad** — opción de menú escritorio (PC-052).
53. **Operaciones Especiales** — opción de menú escritorio (PC-053).
54. **Bienes de Uso** — opción de menú escritorio (PC-054).
55. **Fabricación** — opción de menú escritorio (PC-055).
56. **RMA** — opción de menú escritorio (PC-056).
57. **Informes Compras** — opción de menú escritorio (PC-057).
58. **Informes Stock** — opción de menú escritorio (PC-058).
59. **Libro IVA Compras** — opción de menú escritorio (PC-059).
60. **Informes Correspondencia** — opción de menú escritorio (PC-060).

#### Módulo: Tesorería

61. **Movimientos Bancarios** — opción de menú escritorio (PC-061).
62. **Cuentas Propias** — opción de menú escritorio (PC-062).
63. **Movimientos Tesorería** — opción de menú escritorio (PC-063).
64. **Valores de Terceros** — opción de menú escritorio (PC-064).
65. **Cheques Propios** — opción de menú escritorio (PC-065).
66. **Cupones de Tarjetas** — opción de menú escritorio (PC-066).
67. **Retenciones Recibidas** — opción de menú escritorio (PC-067).
68. **Cajas Pagos a Proveedores** — opción de menú escritorio (PC-068).
69. **Cierre de Cajas** — opción de menú escritorio (PC-069).
70. **Informes Tesorería** — opción de menú escritorio (PC-070).

#### Módulo: Sueldos

71. **Empleados** — opción de menú escritorio (PC-071).
72. **Empresas** — opción de menú escritorio (PC-072).
73. **Recibos** — opción de menú escritorio (PC-073).
74. **Liquidación Masiva** — opción de menú escritorio (PC-074).
75. **Simulador** — opción de menú escritorio (PC-075).
76. **Impuesto a las Ganancias** — opción de menú escritorio (PC-076).
77. **Variables** — opción de menú escritorio (PC-077).
78. **Conceptos** — opción de menú escritorio (PC-078).
79. **Aplicar Aumentos** — opción de menú escritorio (PC-079).
80. **Informes de Sueldos** — opción de menú escritorio (PC-080).
81. **Libro sueldo digital (off en DEMO)** — opción de menú escritorio (PC-081).

#### Módulo: Contabilidad

82. **Asientos** — opción de menú escritorio (PC-082).
83. **Consultar Mayor** — opción de menú escritorio (PC-083).
84. **Balance / Sumas y Saldos** — opción de menú escritorio (PC-084).
85. **Asientos Automáticos** — opción de menú escritorio (PC-085).
86. **Herramientas contables** — opción de menú escritorio (PC-086).
87. **Informes Contables** — opción de menú escritorio (PC-087).
88. **Informes de Gestión** — opción de menú escritorio (PC-088).

#### Módulo: Herramientas

89. **Actividades Seguimiento** — opción de menú escritorio (PC-089).
90. **Actividades Informe** — opción de menú escritorio (PC-090).
91. **SMS** — opción de menú escritorio (PC-091).
92. **Tablero de Control** — opción de menú escritorio (PC-092).
93. **Traslados Viajes** — opción de menú escritorio (PC-093).
94. **Traslados Informes** — opción de menú escritorio (PC-094).
95. **Turnero Box** — opción de menú escritorio (PC-095).
96. **Turnero** — opción de menú escritorio (PC-096).
97. **Selección de Turnos** — opción de menú escritorio (PC-097).
98. **Estadísticas Turnero** — opción de menú escritorio (PC-098).
99. **Mesa Entradas Administración** — opción de menú escritorio (PC-099).
100. **Mesa Entradas Incidentes** — opción de menú escritorio (PC-100).
101. **Mesa Entradas Informes** — opción de menú escritorio (PC-101).

#### Módulo: Configuración (incluye WEB)

102. **Usuarios** — opción de menú escritorio (PC-102).
103. **Un perfil = menú + tablas** — opción de menú escritorio (PC-103).
104. **Auditoría Logueo** — opción de menú escritorio (PC-104).
105. **Backup manual** — opción de menú escritorio (PC-105).
106. **Base de Datos** — opción de menú escritorio (PC-106).
107. **Actualizar.exe** — opción de menú escritorio (PC-107).
108. **Tablas del sistema** — opción de menú escritorio (PC-108).
109. **Parámetros del Sistema** — opción de menú escritorio (PC-109).
110. **Parámetros Externos** — opción de menú escritorio (PC-110).
111. **Autorización Operaciones** — opción de menú escritorio (PC-111).
112. **WEB Requisitos y Trámites** — opción de menú escritorio (PC-112).
113. **WEB Archivos** — opción de menú escritorio (PC-113).
114. **WEB Operaciones** — opción de menú escritorio (PC-114).
115. **Solo logos en PDF web** — opción de menú escritorio (PC-115).
116. **Editor Reportes** — opción de menú escritorio (PC-116).
117. **Informes Personalizados** — opción de menú escritorio (PC-117).
118. **Procesos Personalizados** — opción de menú escritorio (PC-118).
119. **Exportar/Imprimir listados** — opción de menú escritorio (PC-119).
120. **Forms WinForms custom** — opción de menú escritorio (PC-120).

121. **Exportar e imprimir listados** desde cualquier grilla del escritorio.

### 2. CoopOnline / portal del socio (web del proveedor, sobre réplica)

**Cantidad total:** 18 líneas en **4** módulo(s).

#### Módulo: Consultas y documentos

*5 funciones*

1. Consultar facturas y descargar PDF (sobre réplica sincronizada).
2. Consultar saldo y resumen de cuenta.
3. Descarga de cupón de pago.
4. Consulta de consumos (según servicio).
5. Noticias y avisos del proveedor o cooperativa.

#### Módulo: Pagos y adhesiones

*3 funciones*

6. Pagar y prepagar vía web (confirmación indirecta por Agente/Firebase).
7. Adherir a débito o factura digital (según configuración).
8. Historial de pagos web.

#### Módulo: Trámites y autogestión

*8 funciones*

9. Trámites y DDJJ (p. ej. gas) vía API del proveedor.
10. Alta parcial de servicios y solicitudes.
11. Estado limitado de visita técnica.
12. Reclamos y consultas básicas.
13. Turnos (según configuración cooperativa).
14. Vincular usuario del portal.
15. Autolectura limitada.
16. Representantes básicos.

#### Módulo: Alcance y limitaciones conocidas

*2 funciones*

17. Marca genérica compartida entre cooperativas.
18. Sin espacio empleado separado.

### 3. P-Móvil — app de campo legacy

**Cantidad total:** 8 líneas en **3** módulo(s).

#### Módulo: Órdenes y visitas

*3 funciones*

1. Órdenes de trabajo asignadas (sobre copia de datos).
2. Consulta de titular/cuenta en campo.
3. Fotos y novedades en visita (alcance a verificar por versión).

#### Módulo: Lectura y cobranza

*3 funciones*

4. Lecturas de ruta y carga de lectura.
5. Cobranza en domicilio y rendición.
6. Impresión o reparto de comprobantes.

#### Módulo: Sincronización con réplica

*2 funciones*

7. Estados de sincronización con servidor local.
8. Trabajo con conectividad intermitente hacia réplica MySQL.

### 4. Agente ProCoop.exe (servidor/sincronización)

**Cantidad total:** 10 líneas en **3** módulo(s).

#### Módulo: Réplica y publicación de datos

*3 funciones*

1. Sincronizar titulares, facturas, pagos y consumos hacia MySQL del portal.
2. Publicar PDF de facturas a FTP/S3.
3. Puente entre ProCoop SQL y CoopOnline.

#### Módulo: Pagos web y fiscal

*3 funciones*

4. Escuchar confirmaciones de pago web (Firebase/webhook).
5. Conciliación indirecta de pagos web.
6. Reintentar comprobantes fiscales pendientes.

#### Módulo: Infraestructura y dependencias

*4 funciones*

7. Jobs de backup o tareas programadas en PC servidor.
8. Actualización de claves WS para integraciones.
9. Sin API HTTP expuesta por ProCoop hacia afuera.
10. Dependencia de PC encendida para que el portal esté al día.

### 5. Integra, WS_* y exportaciones (integración legacy)

**Cantidad total:** 7 líneas en **3** módulo(s).

#### Módulo: Servicios web legacy

*2 funciones*

1. Integra y servicios WS_* para consultas puntuales.
2. Tablas WS_KEYS y WS_USERS para claves del portal.

#### Módulo: Exportaciones y BI

*2 funciones*

3. Exportaciones manuales a Excel y reportes.
4. Power BI sobre réplicas o vistas.

#### Módulo: Brechas frente a API CoopApps

*3 funciones*

5. Sin API REST documentada por recurso administrable por la cooperativa.
6. Sin bóveda segregada prueba/producción.
7. Sin tokens revocables por integrador.

---

## Parte 3 — Lectura rápida

| Solo en CoopApps (sin menú ProCoop equivalente) | Solo / principal en ProCoop |
|---|---|
| App del empleado (27), Comunidad completa, Institucional menú, Consola SaaS | Agente 24/7, Administrar base de datos local |
| Portal proveedor, Bóveda, Sandbox, Asamblea quórum vivo | Perfiles = menú + tablas |
| Gestión web 402 ítems reorganizados | 120 ítems en 9 pestañas (mismo negocio, otra forma) |

Documentos relacionados: `enumeracion-funciones-por-aplicativo.md` (este), `roles-y-modulos-para-claude.md`, `comparativo-funcional-megaspec-unificado.md`.
