# 08 — Identidad visual CoopApps (producto)

| Campo | Valor |
|---|---|
| Versión | 1.1 |
| Fecha | 19-11-2026 |
| Estado | Vigente |
| Complementa | DEC-109, **T03** §7.A–7.B, [`GUIA-UI-UX-DESARROLLO.md`](GUIA-UI-UX-DESARROLLO.md) |
| Assets versionados | [`docs/brand/coopapps/`](../brand/coopapps/README.md) |
| Fuente nominal externa | Informe de naming (nombre **CoopApps** y textos — DEC-109); **no hay entregable gráfico** (logo/PDF de marca) en poder del solicitante |
| Fuente gráfica vigente | **Solo** `docs/brand/coopapps/` v1.0 (DEC-119, PA-BRD-01 opción B) hasta DEC nueva con manual externo |

> **Alcance.** Define la **marca del producto SaaS** (CoopApps), no la marca de cada cooperativa tenant. La identidad del tenant sigue en `tenantBrandings` (T03 §7.B.1). **GoodApps** como operador usa la banda `#E2B552` en consola de plataforma (T03 §10.1.6), no como logo del producto.

---

## 1. Naming y textos (DEC-109)

| Uso | Valor | Clave `dict:` |
|---|---|---|
| Nombre del producto | **CoopApps** | `product.name` |
| Bajada | Gestión inteligente para cooperativas | `product.tagline` |
| Pronunciación (referencia) | *Coop-apps* (es-AR) | — (no visible) |
| Atribución comercial | por GoodApps | `product.attribution` (protegido) |
| Operador / vendor | GoodApps | `vendor.name` |
| Alt del logo producto | CoopApps | `product.logoAlt` |
| Consola plataforma (chip) | Plataforma GoodApps | `plt.banda` |

---

## 2. Paleta de marca CoopApps (producto)

Colores **por defecto** del tenant técnico `PLATFORM` y fallback cuando un tenant nuevo hereda el kit del producto. Coinciden con el design system (T03 §7.A) para evitar dos paletas en conflicto.

### 2.1 Primarios

| Rol | Hex | Token CSS / campo | Uso |
|---|---|---|---|
| Marca principal | `#6B5BF0` | `--brand`, `tenantBrandings.colors.brand` | Botones primarios, cabecera de modal, enlaces admin, acento PWA si el tenant no personaliza |
| Acento / glow | `#8B78FF` | `--pwa-lilac`, `colors.brandAccent` | Glow PWA, tab activa, gradientes |
| Secundario decorativo | `#2E3A59` | `colors.brand2` | Ilustraciones, landing, gráficos de marca producto |

### 2.2 Superficies de referencia (no personalizables por tenant en producto)

| Rol | Hex | Referencia |
|---|---|---|
| Admin canvas oscuro | `#111019` | T03 §7.A.1 `--canvas` |
| PWA fondo glow | `#000000` | T03 §7.A.2 |
| Plataforma GoodApps (banda) | `#E2B552` | Chip operador; **no** es color de marca CoopApps |

### 2.3 Estados semánticos (compartidos producto + tenants)

`#5BD39B` (ok), `#E2B552` (warn), `#F0837B` (bad), `#7CB4F5` (info), `#9A95AB` (neutral) — T03 §7.A.1.

### 2.4 Contraste

Todo color publicado en `tenantBrandings` debe pasar validación RF-UXD-032 / RN-UXD-017: texto sobre marca con ratio ≥ 4,5:1; componentes UI ≥ 3:1.

---

## 3. Logotipo y recursos gráficos

### 3.1 Ubicación en repo

| Ruta | Contenido |
|---|---|
| `docs/brand/coopapps/` | Fuente de verdad de archivos para sembrar `brandAssets` del tenant `PLATFORM` |
| [`brand/coopapps/tokens-marca.json`](../brand/coopapps/tokens-marca.json) | Hex y metadatos para CI y seed |

### 3.2 `kind` en `brandAssets` (producto)

| `kind` | Archivo fuente (repo) | Canal | Obligatorio O0 |
|---|---|---|---|
| `productLogo` | `logo-producto-horizontal.svg` | admin (`logo del producto` en topbar) | Sí |
| `productLogoLight` | `logo-producto-horizontal-claro.svg` | admin tema claro | Sí |
| `productIsotype` | `isotipo.svg` | admin compacto, splash | Sí |
| `favicon` | `favicon.svg` | todos | Sí (generar PNG 32/16) |
| `appIcon` | derivado de `isotipo.svg` | pwa | Sí (JOB genera 192/512/maskable) |

Los SVG del repo son la **identidad gráfica oficial provisional**: wordmark tipográfico aprobado por spec (no hay otro archivo de logo). Desarrollo, semilla `PLATFORM` y export GoodApps **usan estos archivos**. Un manual gráfico futuro solo los reemplaza vía DEC + actualización de assets (mismos `kind` y rutas lógicas).

### 3.3 Uso en interfaz

- **Admin tenant:** topbar izquierda = `productLogo` (CoopApps) + logo de la cooperativa (T03 §10.1.1).
- **Login / splash:** logo producto discreto + marca cooperativa dominante.
- **PWA / landing del socio:** solo marca de la cooperativa; CoopApps en pie legal o atribución `dict:product.attribution` si aplica contrato.
- **Documentos comerciales del SaaS** (contrato, propuesta): `productLogo` + `product.tagline`.

---

## 4. Checklist de entrega (implementación y export GoodApps)

Marcar antes de cerrar **O0** de experiencia:

- [ ] Semilla `PLATFORM`: `tenantBrandings` publicado con colores §2.1.
- [ ] Subida de assets §3.2 → `brandAssets` + variantes JOB-UXD-01.
- [ ] Claves `dict:` §1 en catálogo `dictionaryKeys` (tenant `PLATFORM`).
- [ ] Login: `productLogo` visible sin sustituir marca coop.
- [ ] Manifest PWA **del tenant** usa íconos de la cooperativa, no el isotipo CoopApps (salvo tenant demo `PLATFORM`).
- [ ] Contraste automatizado con colores §2.1 sobre `--canvas` oscuro y claro.
- [ ] Carpeta `docs/brand/coopapps/` copiada o referenciada en repo de implementación (`coodo`).

---

## 5. Semilla de datos (tenant `PLATFORM`)

Valores para migración / script de arranque (alinear a T07 y JOB-UXD-04 ampliado):

```json
{
  "tenantCode": "PLATFORM",
  "tenantBranding": {
    "brandName": "CoopApps",
    "shortName": "CoopApps",
    "colors": {
      "brand": "#6B5BF0",
      "brandAccent": "#8B78FF",
      "brand2": "#2E3A59"
    },
    "themePolicy": "dark",
    "assets": {
      "productLogo": "brand/coopapps/logo-producto-horizontal.svg",
      "productLogoLight": "brand/coopapps/logo-producto-horizontal-claro.svg",
      "productIsotype": "brand/coopapps/isotipo.svg",
      "favicon": "brand/coopapps/favicon.svg"
    }
  }
}
```

---

## 6. Relación con cooperativas (tenants)

| Aspecto | Producto CoopApps | Cooperativa |
|---|---|---|
| Colores en UI | Defaults hasta que el usuario personalice; `--brand` del tenant pisa en runtime | `colors.*` en PAN-UXD-01 |
| Logos en app del socio | No sustituye logo coop | `logoPwaSocio`, `appIconSocio`, etc. |
| Nombre visible | Login, splash, legal, pie SaaS | `brandName`, diccionario |

---

## 7. Decisiones y preguntas

| ID | Tema | Estado |
|---|---|---|
| **DEC-119** | Este documento + carpeta `docs/brand/coopapps/` como identidad de producto vigente | Vigente |
| **DEC-120** | Sin manual gráfico externo: los SVG y `tokens-marca.json` del repo son la **única** fuente de logo y paleta de producto hasta nuevo entregable | Vigente |
| PA-BRD-01 | ¿Sustituir wordmark por manual gráfico del informe? | **Cerrada (19-11-2026):** opción B — **no hay manual**; vigente `docs/brand/coopapps/` v1.0 |

---

## Bitácora

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | 19-11-2026 | Creación; paleta alineada T03; checklist; semilla PLATFORM; assets v1 en repo |
| 1.1 | 19-11-2026 | Sin PDF/arte de naming: DEC-120; PA-BRD-01 cerrada; repo = fuente gráfica única |