# IMG-F — lote de apertura (F00–F02)

Adjuntar en Claude: `comparativo-funcional-megaspec-unificado.md` + prompt de `comparativo-funcional-imagenes-F-PROMPT-CLAUDE.md` §1.

## IMG-F00 — Portada

- **Título:** ProCoop y CoopApps: misma cooperativa, comparación función por función
- **Subtítulo:** 120 funciones relevadas · 17 servicios · tres lecturas (operación, gerencia, técnica en anexo)

## IMG-F01 — Leyenda (copiar §0.1 megaspec)

| Etiqueta | Significado |
|---|---|
| **Igual** | El negocio sigue igual; cambia pantalla u organización. |
| **Mejor** | Mismo negocio con más control, trazabilidad o canales. |
| **Nuevo** | No estaba en el menú ProCoop; suma capacidad. |
| **Modelo distinto** | Sustituye el mecanismo (ej. backup manual → nube). |
| **No aplica al usuario** | Deja de ser tarea interna de la cooperativa. |

## IMG-F02 — Plataforma (copiar §1 megaspec, 7 filas)

| Tema | Hoy en ProCoop | Con CoopApps | Cambio | Por qué importa |
|---|---|---|---|---|
| Dónde corre el sistema | Programa en cada PC; servidor propio | Navegador y apps; sin instalar en cada equipo | Modelo distinto | Menos costo de parque y de actualizar. |
| Copias de seguridad | Menú que opera el usuario | Copia automática diaria + restauración probada | Modelo distinto | No depende de que alguien recuerde el backup. |
| Portal del socio | Copia a base aparte (desfasaje posible) | Misma información que ve caja y facturación | Mejor | Menos reclamos por saldos que no coinciden. |
| App de campo | App sobre copia; varias piezas | Una app: técnico, lecturista y cobrador; trabajo sin señal | Mejor | Menos viajes en vano; el socio ve el estado. |
| Parámetros | Miles de claves numéricas | Parámetros con nombre, vigencia e historial | Mejor | No hace falta “el que sabe el número”. |
| Permisos | Perfil = menú + tablas | Rol por acción; plantillas ajustables | Modelo distinto | Menor riesgo de permisos de más. |
| Menú relevado | 120 ítems en 9 pestañas | 119 cubiertos; solo “administrar base” pasa al proveedor | Mejor | No hay módulo sin destino. |

**Pedido en Claude:** `Generá IMG-F02` (o F00/F01) con el prompt §1.

**Siguiente lote:** [`img-f-lotes/IMG-F03.md`](./img-f-lotes/IMG-F03.md) (y F04…F22 en la misma carpeta; índice en `img-f-lotes/README.md`).