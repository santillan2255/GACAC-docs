# Marca CoopApps — assets de producto

Fuente versionada para sembrar el tenant **`PLATFORM`** (`brandAssets`, T03 §7.B.2).

**Especificación:** [`docs/especificacion/08-identidad-marca-coopapps.md`](../../especificacion/08-identidad-marca-coopapps.md).

## Archivos

| Archivo | Uso |
|---|---|
| `tokens-marca.json` | Colores y metadatos para seed/CI |
| `logo-producto-horizontal.svg` | Topbar admin (fondo oscuro) |
| `logo-producto-horizontal-claro.svg` | Topbar admin (tema claro) |
| `isotipo.svg` | Ícono cuadrado base (1024 workflow) |
| `favicon.svg` | Favicon y base 32×16 |

## Generar en build (JOB-UXD-01)

Desde `isotipo.svg` o logo maestro:

- PNG 192, 512, maskable 512 (zona segura 80 %)
- apple-touch 180, favicon 32/16
- splash móvil / desktop si no hay arte dedicado

## Versión

v1.0 — **fuente gráfica oficial** (DEC-120): no existe PDF/arte de naming en el proyecto; usar estos archivos en build y export. Un manual futuro solo reemplaza archivos (DEC + mismos `kind`).