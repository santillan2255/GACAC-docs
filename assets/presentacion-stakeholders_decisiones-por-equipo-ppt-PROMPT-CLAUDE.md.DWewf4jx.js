import{f as a,o as s,c as e,a2 as p}from"./chunks/framework.Cd9rfTEn.js";const b=JSON.parse('{"title":"Prompt autocontenido — PPT de preguntas de decisión por equipo (~500)","description":"","frontmatter":{},"headers":[],"relativePath":"presentacion-stakeholders/decisiones-por-equipo-ppt-PROMPT-CLAUDE.md","filePath":"presentacion-stakeholders/decisiones-por-equipo-ppt-PROMPT-CLAUDE.md","lastUpdated":null}'),r={name:"presentacion-stakeholders/decisiones-por-equipo-ppt-PROMPT-CLAUDE.md"};function o(l,n,i,t,c,d){return s(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="prompt-autocontenido-—-ppt-de-preguntas-de-decision-por-equipo-500" tabindex="-1">Prompt autocontenido — PPT de preguntas de decisión por equipo (~500) <a class="header-anchor" href="#prompt-autocontenido-—-ppt-de-preguntas-de-decision-por-equipo-500" aria-label="Permalink to &quot;Prompt autocontenido — PPT de preguntas de decisión por equipo (~500)&quot;">​</a></h1><p><strong>Objetivo:</strong> presentación para que <strong>cada equipo</strong> (cooperativa piloto + GoodApps) <strong>revise, ratifique o responda</strong> las preguntas abiertas (PA-*) con su <strong>opción recomendada</strong> vigente.</p><p><strong>Volumen (nov 2026):</strong> ~<strong>590–600</strong> filas <code>PA-*</code> en el registro; ~<strong>103</strong> ya respondidas (DEC); ~<strong>490</strong> con recomendación <strong>asumida</strong> (DEC-072) a <strong>revisar</strong>; pocas <strong>Pendiente</strong> o <strong>contador/legal</strong>.</p><p><strong>Política (DEC-047):</strong> al solicitante solo se presentan preguntas de <strong>alto impacto</strong> o que <strong>bloquean olas tempranas</strong>; el resto <strong>rige la Recomendada</strong> hasta que el equipo la ratifique o la cambie.</p><hr><h2 id="que-adjuntar-a-claude-obligatorio" tabindex="-1">Qué adjuntar a Claude (obligatorio) <a class="header-anchor" href="#que-adjuntar-a-claude-obligatorio" aria-label="Permalink to &quot;Qué adjuntar a Claude (obligatorio)&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Prioridad</th><th>Archivo</th></tr></thead><tbody><tr><td><strong>1 — Fuente de verdad</strong></td><td><a href="./../especificacion/02-preguntas-abiertas"><code>docs/especificacion/02-preguntas-abiertas.md</code></a></td></tr><tr><td>2 — Contexto ejecutivo</td><td><a href="./documento-base-presentacion"><code>documento-base-presentacion.md</code></a> (§4.2, IMG-19, sección 10)</td></tr><tr><td>3 — DEC ya cerradas</td><td><a href="./../especificacion/01-registro-decisiones"><code>docs/especificacion/01-registro-decisiones.md</code></a></td></tr></tbody></table><p><strong>Rutas Windows:</strong><br><code>c:\\Users\\lenovo\\Documents\\GACAC\\docs\\especificacion\\02-preguntas-abiertas.md</code></p><p>Este archivo de prompt <strong>no sustituye</strong> el adjunto 1: la PPT debe listar <strong>cada fila</strong> de la tabla <code>| PA | Anexo | Título | Recomendada | Estado |</code>.</p><hr><h2 id="a-bloque-para-copiar-y-pegar-en-claude-autocontenido" tabindex="-1">A. Bloque para copiar y pegar en Claude (autocontenido) <a class="header-anchor" href="#a-bloque-para-copiar-y-pegar-en-claude-autocontenido" aria-label="Permalink to &quot;A. Bloque para copiar y pegar en Claude (autocontenido)&quot;">​</a></h2><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Sos diseñador de presentaciones ejecutivas (1920×1080, HTML+SVG exportable a PNG/PPT) para una cooperativa de servicios públicos de Argentina y el equipo GoodApps.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>OBJETIVO DEL DECK</span></span>
<span class="line"><span>Armar una PPT para que CADA EQUIPO revise las preguntas de decisión (códigos PA-*) del proyecto CoopApps: qué hay que ratificar, cambiar o responder. No es marketing: es agenda de decisión / workshop.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>FUENTE DE DATOS (obligatorio)</span></span>
<span class="line"><span>Usá la tabla completa del archivo adjunto &quot;02-preguntas-abiertas.md&quot;:</span></span>
<span class="line"><span>columnas: PA | Anexo | Título | Recomendada | Estado.</span></span>
<span class="line"><span>Cada fila PA = una función/pregunta de decisión. NO inventes preguntas. NO omitas filas.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CIFRAS ANCLA (del propio registro; validá contando filas PA al parsear el adjunto)</span></span>
<span class="line"><span>- Total preguntas: ~590 (puede variar si el MD creció).</span></span>
<span class="line"><span>- Respondida (DEC-xxx): ~100 — mostrar en verde, slide resumen; no pedir acción salvo confirmación.</span></span>
<span class="line"><span>- Asumida (DEC-072) o equivalente &quot;recomendación vigente&quot;: ~490 — slides principales: acción = &quot;Ratificar o cambiar&quot;.</span></span>
<span class="line"><span>- Pendiente / contador / legal / stack: destacar en ámbar o rojo suave — acción = &quot;Responder antes de ola X&quot; si el texto del Estado lo indica.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>POLÍTICA DEC-047 (texto en portada o slide 2)</span></span>
<span class="line"><span>&quot;Solo algunas preguntas bloquean el inicio; el resto opera con la opción Recomendada hasta que el equipo la revise.&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>=== EQUIPOS (agrupación para la PPT) ===</span></span>
<span class="line"><span>No uses códigos de anexo (M05, T09) como título visible grande; usá el nombre de equipo abajo.</span></span>
<span class="line"><span>Asigná cada PA al equipo por el PREFIJO del código PA (ej. PA-FAC-12 → equipo Facturación).</span></span>
<span class="line"><span></span></span>
<span class="line"><span>| Equipo responsable | Prefijos PA | Quién suele responder |</span></span>
<span class="line"><span>|--------------------|-------------|------------------------|</span></span>
<span class="line"><span>| Configuración y datos maestros | CFG, CFG-P1…P4, DAT, UXD | Admin cooperativa + implementación |</span></span>
<span class="line"><span>| Socios, cuentas y portal | PER, CAT, POR | Comercial + portal |</span></span>
<span class="line"><span>| Medición y tarifas | MED, TAR | Lecturas + facturación |</span></span>
<span class="line"><span>| Facturación | FAC | Facturación |</span></span>
<span class="line"><span>| Fiscal y organismos | FIS | **Contador** + facturación |</span></span>
<span class="line"><span>| Cobranza | COB | Caja / cobranzas |</span></span>
<span class="line"><span>| Mora y crédito | MOR | Crédito / jurídico |</span></span>
<span class="line"><span>| Atención y CRM | CRM | Mesa de entradas |</span></span>
<span class="line"><span>| Técnica y obras | TEC | Obras / instalaciones |</span></span>
<span class="line"><span>| Ventas y POS | VEN | Comercial / mostrador |</span></span>
<span class="line"><span>| Compras | CMP | Compras |</span></span>
<span class="line"><span>| Stock y depósitos | STK | Depósito |</span></span>
<span class="line"><span>| Tesorería | TES | Tesorería |</span></span>
<span class="line"><span>| Contabilidad | CON | **Contador** |</span></span>
<span class="line"><span>| Sueldos y RRHH | SUE | RRHH |</span></span>
<span class="line"><span>| Institucional | INS | Secretaría / consejo |</span></span>
<span class="line"><span>| Servicios sociales | SOC | Área social |</span></span>
<span class="line"><span>| Plataforma SaaS | PLA | GoodApps + admin cooperativa |</span></span>
<span class="line"><span>| Seguridad e identidad | IAM | TI + admin |</span></span>
<span class="line"><span>| Integraciones | INT | TI + implementación |</span></span>
<span class="line"><span>| Migración ProCoop | MIG | Migración + TI |</span></span>
<span class="line"><span>| No funcionales / rendimiento | NFR | TI + GoodApps |</span></span>
<span class="line"><span>| Comunidad y comunicaciones | COM | Comunicación |</span></span>
<span class="line"><span>| Reportes e inteligencia | BIA | Gerencia + BI |</span></span>
<span class="line"><span>| Workflows y aprobaciones | WFL | Admin + gerencia |</span></span>
<span class="line"><span>| Stack y marca (negociación) | STACK, BRD | GoodApps + dirección |</span></span>
<span class="line"><span>| Parámetros migración T04b | (filas CFG-P*) | Migración + área dueña |</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Si un PA no encaja, usá la columna &quot;Anexo&quot; del adjunto y el mapa de módulos: M01 socios, M02 catálogo, M03 medición, M04 tarifas, M05 facturación, M06 fiscal, M07 cobranza, M08 mora, M09 CRM, M10 técnica, M11 ventas, M12 compras, M13 stock, M14 tesorería, M15 contabilidad, M16 sueldos, M17 institucional, M18 sociales, M19 portal.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>=== PROHIBIDO (texto grande) ===</span></span>
<span class="line"><span>RF-, RN-, DEC- en títulos de slide (sí permitido en pie 8px).</span></span>
<span class="line"><span>Jerga: &quot;tenant&quot; → &quot;cooperativa&quot;; &quot;solicitante&quot; → &quot;dirección de la cooperativa&quot;.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>=== LAYOUT POR SLIDE ===</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PPT-DEC-000 Portada</span></span>
<span class="line"><span>- Título: &quot;Preguntas de decisión por equipo&quot;</span></span>
<span class="line"><span>- Subtítulo: &quot;Revisión de ~490 recomendaciones + cierre de pendientes&quot;</span></span>
<span class="line"><span>- Pie: Fuente 02-preguntas-abiertas.md · nov 2026</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PPT-DEC-001 Cómo usar el deck</span></span>
<span class="line"><span>- 3 pasos: (1) Leer pregunta y recomendada (2) Marcar Ratificar / Cambiar / Pendiente (3) Registrar en acta → DEC en 01-registro-decisiones</span></span>
<span class="line"><span>- Leyenda de colores: Verde=respondida; Ámbar=asumida a revisar; Gris=otro; Rojo=contador/legal urgente</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PPT-DEC-002 Dashboard por equipo</span></span>
<span class="line"><span>- Tabla: Equipo | # PA total | # respondidas | # a revisar | # pendiente</span></span>
<span class="line"><span>- Contar desde el adjunto; no estimes.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PPT-DEC-003 Dashboard por estado</span></span>
<span class="line"><span>- Anillo o barras: Respondida / Asumida / Pendiente / Reemplazada</span></span>
<span class="line"><span>- Centro: total PA</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PPT-DEC-010 … PPT-DEC-0xx Por cada EQUIPO (ver tabla de equipos)</span></span>
<span class="line"><span>SLIDE SEPARADOR equipo:</span></span>
<span class="line"><span>- Título del equipo + &quot;N preguntas&quot;</span></span>
<span class="line"><span>- Subtítulo: roles que deben estar en la reunión</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SLIDES DE DETALLE (repetir hasta cubrir TODAS las PA del equipo):</span></span>
<span class="line"><span>- Título: &quot;Equipo [nombre] — preguntas [rango o parte A/B]&quot;</span></span>
<span class="line"><span>- Tabla 5 columnas, fuente mínimo 11–12px:</span></span>
<span class="line"><span>  | PA (pie chico) | Pregunta (Título) | Opción recomendada | Estado | Acción equipo |</span></span>
<span class="line"><span>- Máximo **8 preguntas por slide** (legibilidad).</span></span>
<span class="line"><span>- Columna &quot;Acción equipo&quot;: dejar checkbox visual &quot;□ Ratificar  □ Cambiar  □ No aplica&quot; + línea en blanco &quot;Nueva decisión:&quot;</span></span>
<span class="line"><span>- Para Estado &quot;Respondida (DEC-…)&quot; acción = &quot;Cerrada (solo lectura)&quot;.</span></span>
<span class="line"><span>- Para &quot;Pendiente (contador)&quot; acción = &quot;Requiere contador&quot;.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PPT-DEC-900 Cierre — solo pendientes bloqueantes</span></span>
<span class="line"><span>- Listar todas las PA con Estado que contenga Pendiente, contador, legal, STACK sin DEC (parsear adjunto).</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PPT-DEC-901 Próximos pasos</span></span>
<span class="line"><span>- Texto fijo: &quot;1. Acta por equipo 2. Subir respuestas al registro 3. Alta de DEC 4. Priorizar piloto Laguna Larga&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>=== FORMATO DE ENTREGA ===</span></span>
<span class="line"><span>1) Primero: &quot;Generá outline&quot; → lista numerada PPT-DEC-* con conteo de slides y tabla de control:</span></span>
<span class="line"><span>   | Equipo | # PA en adjunto | # PA en slides | OK? |</span></span>
<span class="line"><span>   | TOTAL | debe coincidir |</span></span>
<span class="line"><span>2) Luego: &quot;Generá PPT-DEC-xxx&quot; o &quot;Generá todo el equipo Cobranza&quot;.</span></span>
<span class="line"><span>3) Cada slide HTML+SVG 1920×1080.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>=== COMPLETITUD ===</span></span>
<span class="line"><span>Al terminar el outline, si # PA en slides &lt; # filas PA del adjunto, ERROR: agregar slides hasta cubrir 100 %.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Paleta: títulos #2F343A; verde #2E7D32 respondida; ámbar #B7791F a revisar; gris #6B7280 texto; fondo #FFFFFF.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Confirmá que parseaste el adjunto 02-preguntas-abiertas.md y esperá &quot;Generá outline&quot;.</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br></div></div><hr><h2 id="b-comandos-utiles-despues-de-pegar" tabindex="-1">B. Comandos útiles después de pegar <a class="header-anchor" href="#b-comandos-utiles-despues-de-pegar" aria-label="Permalink to &quot;B. Comandos útiles después de pegar&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Orden</th><th>Comando</th></tr></thead><tbody><tr><td>1</td><td><code>Generá outline</code></td></tr><tr><td>2</td><td><code>Generá PPT-DEC-000 a PPT-DEC-003</code></td></tr><tr><td>3</td><td><code>Generá todos los slides del equipo Facturación</code> (ejemplo)</td></tr><tr><td>4</td><td><code>Generá todos los equipos en orden</code></td></tr><tr><td>5</td><td><code>Generá solo PA con Pendiente o contador</code></td></tr></tbody></table><hr><h2 id="c-equipos-vs-500" tabindex="-1">C. Equipos vs. “~500” <a class="header-anchor" href="#c-equipos-vs-500" aria-label="Permalink to &quot;C. Equipos vs. “~500”&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Concepto</th><th>Número</th></tr></thead><tbody><tr><td>Preguntas a <strong>revisar</strong> en taller (recomendación asumida)</td><td><strong>~490</strong></td></tr><tr><td>Total registro PA</td><td><strong>~590–601</strong> (+ bloque STACK al final del MD)</td></tr><tr><td>Ya <strong>respondidas</strong></td><td><strong>~103</strong></td></tr></tbody></table><p>La PPT puede tener <strong>dos modos</strong> (pedilo en un mensaje):</p><ul><li><strong>Modo A (taller):</strong> solo filas con acción &quot;Ratificar o cambiar&quot; (~490) + portada + pendientes.</li><li><strong>Modo B (auditoría):</strong> <strong>todas</strong> las filas PA del adjunto (~600).</li></ul><hr><h2 id="d-relacion-con-otras-presentaciones" tabindex="-1">D. Relación con otras presentaciones <a class="header-anchor" href="#d-relacion-con-otras-presentaciones" aria-label="Permalink to &quot;D. Relación con otras presentaciones&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Deck</th><th>Diferencia</th></tr></thead><tbody><tr><td><strong>PPT-DEC</strong> (este)</td><td>Preguntas PA-* por equipo</td></tr><tr><td><strong>PPT-CAT</strong></td><td>Catálogo de funciones / menú</td></tr><tr><td><strong>IMG-19</strong> en documento-base</td><td>Resumen ejecutivo (anillo 593), no lista completa</td></tr></tbody></table><hr><h2 id="e-si-claude-no-entra-todo-el-md" tabindex="-1">E. Si Claude no entra todo el MD <a class="header-anchor" href="#e-si-claude-no-entra-todo-el-md" aria-label="Permalink to &quot;E. Si Claude no entra todo el MD&quot;">​</a></h2><ol><li>Partir el adjunto por secciones (guardar <code>02-preguntas-parte1.md</code> hasta mitad de tabla) <strong>o</strong></li><li>Pedir por equipo: <code>Generá outline solo para prefijo PA-COB</code> leyendo el adjunto <strong>o</strong></li><li>Exportar CSV desde script (futuro): <code>python scripts/export-pa-por-equipo.py</code></li></ol>`,26)])])}const m=a(r,[["render",o]]);export{b as __pageData,m as default};
