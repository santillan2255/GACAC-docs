# MANIFEST DDL — 19-11-2026

| Métrica | Valor |
|---|---|
| Tablas generadas (no pla) | 1027 |
| Con campos desde anexo §7 | 1027 |
| Fallback (solo PK+tenant+legacy+audit) | 0 |
| Absorbidas (sin SQL) | 51 |
| pla (generate_pla_sql.py) | 31 |
| Colecciones en caché §7 (mega) | 1078 |

## Regenerar

```text
python docs/especificacion/_trabajo/generate_pla_sql.py
python docs/especificacion/_trabajo/generate_exhaustive_ddl.py
python docs/especificacion/_trabajo/generate_ddl_constraints.py
python docs/especificacion/_trabajo/validate_ddl_quality.py
python docs/especificacion/_trabajo/generate_07_catalog_from_t05.py
```

| Constraints | Archivo | ~cantidad |
|---|---|---|
| Índices únicos T05 | `sql/200-all-unique-indexes.sql` | 878 |
| FK completo (topológico) | `sql/201-deferred-foreign-keys.sql` | 1912 (90 con NOCHECK; ver `FK-CYCLES.md`) |
| FK intra-módulo | `sql/203-foreign-keys-intramodule.sql` | 942 |

## Despliegue

```text
sqlcmd ... -i docs/especificacion/07-ddl/deploy-coopapps-full.sql
```