# 07-ddl — SQL ejecutable (Azure SQL) — base CoopApps completa

Scripts **CREATE TABLE** con PK, columnas, índices básicos y FK a `pla.Tenants` donde corresponde. **1.058 tablas** (51 absorbidas sin tabla propia).

## Tres capas (DEC-117)

| Capa | Artefacto | Contenido |
|---|---|---|
| **A** | `07-catalogo-tablas-sql.md` | Inventario COL-* → tabla |
| **B** | `07-modelo-relacional-azure-sql.md` §2 | Diseño legible (núcleo) |
| **C** | Esta carpeta | **DDL listo para crear la base** |

## Estado (regenerar = ver `MANIFEST.md`)

| Bloque | Origen | Tablas |
|---|---|---|
| `sql/pla/` | `generate_pla_sql.py` (columnas T01 §7.11, índices) | 31 |
| `sql/<esquema>/` | `generate_exhaustive_ddl.py` (parsea §7 anexos) | 1.027 (**0 fallback**) |
| **Total** | | **1.058** |

El generador exhaustivo lee las tablas `| Campo | Tipo |` de todos los anexos M/T (caché mega §7, incluye bloques `**`colección`** —` al cierre de anexos). Objetos embebidos → `*Json`. **Alcance `TenantId`** según T05 (`G`/`P`/`T`). Tras regenerar, ejecutar `validate_ddl_quality.py` → `QUALITY-REPORT.md`.

## Regenerar todo

```text
python docs/especificacion/_trabajo/generate_pla_sql.py
python docs/especificacion/_trabajo/generate_exhaustive_ddl.py
python docs/especificacion/_trabajo/generate_07_catalog_from_t05.py
```

## Desplegar base vacía (sqlcmd)

Desde `docs/especificacion/07-ddl/`:

```text
sqlcmd -S <servidor> -d <base-diseño> -i deploy-coopapps-full.sql
```

Orden: `000-all-schemas.sql` → `pla/deploy-all.sql` (incl. `099` FK pla) → cada esquema `*/deploy-all.sql` → `200-all-unique-indexes.sql` → **FK** (elegir uno):

| Modo | Script | FK |
|------|--------|-----|
| Completo (topológico, cross-schema) | `201-deferred-foreign-keys.sql` | ~1912 |
| Conservador (solo mismo esquema) | `203-foreign-keys-intramodule.sql` | ~942 |

Ciclos: `FK-CYCLES.md` (aristas con `WITH NOCHECK` en `201`).

Regenerar constraints:

```text
python docs/especificacion/_trabajo/generate_ddl_constraints.py
```

FK desde T05 + columna **Referencia** §7; orden **topológico** (padre antes que hijo); **90** aristas en ciclo llevan `WITH NOCHECK`. Variante **203** = sin FK entre esquemas (`per`→`cat`, etc.).

Smoke test local (requiere `sqlcmd`): `.\smoke-deploy-ddl.ps1`

**Producción:** prevalecen migraciones **EF Core** en GoodApps; este DDL es contrato GACAC, revisión y CI de esquema.

## Límites conocidos (v1 generador)

- No declara todas las FK entre módulos (solo `TenantId` → `pla.Tenants`).
- Índices únicos compuestos del anexo: solo los explícitos en `pla` manual.
- Hijos normalizados (p. ej. `personIdentifiers` tabla vs JSON) → JSON salvo tabla explícita en §7.
- Mejora continua: subir % «anexo» bajando «fallback» re-parseando patrones de encabezado.