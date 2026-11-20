# Cuestionario de decisiones (una persona)

Revisás las preguntas **PA-xxx** y guardás respuestas en una **copia** que no toca la especificación oficial.

## Qué NO se modifica nunca

| Ruta | Rol |
|------|-----|
| `docs/especificacion/02-preguntas-abiertas.md` | Registro consolidado (solo lectura para esta herramienta) |
| `docs/especificacion/01-registro-decisiones.md` | DEC oficiales |
| `docs/especificacion/anexos/*.md` | Fuente de las preguntas (solo lectura) |

## Copia de trabajo (sí se actualiza)

| Archivo | Rol |
|--------|-----|
| **`copia-respuestas-stakeholder.md`** | Único MD que editás vos / la web / `build_md.py` |
| `build_md.py` | Crea o refresca la copia desde anexos y **conserva respuestas** ya guardadas en la copia |
| `index.html` | Interfaz |

El archivo viejo `preguntas-respuestas.md` (si lo tenías) solo se usa una vez para migrar respuestas al regenerar; después trabajá con `copia-respuestas-stakeholder.md`.

## Uso

1. Crear o actualizar la copia (textos desde anexos, tus respuestas intactas):
   ```bash
   python build_md.py
   ```
2. Abrir la web:
   - `python -m http.server 8787` en esta carpeta → `http://localhost:8787/`
   - o **Abrir MD** → elegir `copia-respuestas-stakeholder.md`
3. **Guardar y seguir** → actualiza esa copia en memoria + `localStorage`.
4. **Guardar archivo** o **Exportar MD** y enviámelo el archivo exportado.

Integrar al repo oficial (`02`, `01-registro-decisiones`) es un paso manual aparte, cuando vos quieras.

## Publicado en GitHub Pages

Tras un push a `main` (carpeta `docs/…` o `portal/`), el portal publica en:

**https://santillan2255.github.io/GACAC-docs/cuestionario-decisiones/**

(Entrá con la misma clave que el resto del portal; usa **Abrir MD** o **Guardar archivo** para persistir en tu copia del `.md`.)