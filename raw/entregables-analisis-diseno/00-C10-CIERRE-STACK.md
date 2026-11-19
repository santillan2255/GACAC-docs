# C-10 — Cierre de alineación stack (entregables)

| Campo | Valor |
|---|---|
| Fecha de cierre | 19-11-2026 |
| Checklist | `docs/especificacion/06-impacto-adaptacion-stack-goodapps.md` §12.2 ítem **C-10** |
| Política | Misma §12.3 |
| Auditoría | `docs/especificacion/13-auditoria-impacto-entregables.md` (regenerable) |

## Criterios cumplidos

| Criterio §12.3 | Estado |
|---|---|
| OpenAPI (`18-contratos-api`, `18-openapi/`) como contrato de **diseño** (D-06); implementación ASP.NET Core; entidades → `07-ddl` | **Hecho** (bloque normativo en `18-contratos-api.md`) |
| C4 / STRIDE / estrategia de pruebas con cabecera C-10; diagramas Connectia = análisis, norma Azure en `00-INDICE` | **Hecho** |
| **5.710 CP** sin reescritura masiva; comportamiento = RF/RN; motor físico DEC-111 | **Hecho** (nota maestra en `20-casos-prueba.md`) |
| Política publicada + auditoría estable | **Hecho** (este documento) |

## Inventario de residuos aceptados (no bloquean export)

| Origen | Tokens históricos | Tratamiento |
|---|---|---|
| `20-casos-prueba/` (~5.710 CP) | Mongo, Mongoose, Vue, BullMQ en Dado/Cuando/Entonces | Wording del generador; UAT en .NET/SQL/React |
| `03-er/` y partes `03*` | `ObjectId` en diagramas ER | Vista de diseño lógico; físico en `07-modelo-relacional-azure-sql.md` |
| `02-arquitectura-c4.md` | Contenedores Node/Mongo en figuras | Vista Connectia; columna objetivo en §7.0 del C4 |
| `18-openapi/*` | Nombre «colección» en esquemas | Entidad lógica → tabla catálogo T05/`07` |

**Regeneración:** nuevos CP y OpenAPI deben tomar anexos ya barridos (C-05) o citar norma DEC-111 en el generador.

## Documentos con norma explícita C-10

- [`00-INDICE.md`](00-INDICE.md)
- [`18-contratos-api.md`](18-contratos-api.md)
- [`02-arquitectura-c4.md`](02-arquitectura-c4.md)
- [`07-estrategia-pruebas.md`](07-estrategia-pruebas.md)
- [`20-casos-prueba.md`](20-casos-prueba.md)
- [`28-modelo-amenazas-seguridad.md`](28-modelo-amenazas-seguridad.md)
- [`03-modelo-entidad-relacion.md`](03-modelo-entidad-relacion.md)