# 25 · Prototipo navegable estático (artefacto 4.3)

> **Prototipo - datos ficticios.** Todo lo que se ve en el prototipo es inventado: cooperativas, personas, documentos, CUIT, importes, correos y números de comprobante. No hay datos reales de ninguna cooperativa ni código de ProCoop.

| Campo | Valor |
|---|---|
| Artefacto | 4.3 · Prototipo navegable (ver `00-INDICE.md`) |
| Carpeta | `25-prototipo-navegable/` |
| Base | `05-wireframes-pantallas-piloto.md` (W-01 a W-17, piloto Internet, olas O0 a O5) |
| Rutas y estilo | T03 §10.9 (rutas canónicas), T03 §7.A (tokens de marca), T03 §10.1/§10.4/§10.5 (AdminShell, AppShell, accesibilidad), M19 (portal del socio) |
| Tecnología | HTML + CSS + JavaScript sin frameworks, sin dependencias externas, sin CDN y sin servidor |
| Fecha simulada | 05-11-2026 (fija en todo el prototipo) |

---

## 1. Cómo abrirlo

1. Abrí la carpeta `25-prototipo-navegable/`.
2. Hacé doble clic en `index.html`. Se abre en el navegador predeterminado (Chrome, Edge o Firefox actuales). No hace falta instalar nada ni tener conexión a Internet.
3. La primera pantalla es el **Mapa del prototipo**: tiene los siete recorridos guiados, la tabla de pantallas (incluye una ampliación posterior al alcance mínimo del piloto) y accesos directos para entrar como personal, como socio o como técnico.

Otras indicaciones:

- **Estado:** los cambios (altas, cobros, emisiones, OT) se guardan en `sessionStorage` de la pestaña. Al cerrar la pestaña se pierden.
- **Reiniciar datos:** el botón de la barra superior devuelve los datos al estado inicial.
- **Navegación:** se usa el fragmento de la URL (`index.html#/admin/...`). Por eso funciona con `file://`, y los botones Atrás/Adelante del navegador funcionan.
- **Tema:** el admin arranca en tema oscuro. El tema claro se activa desde el Mapa del prototipo o desde el menú de usuario. La PWA (socio y campo) usa siempre la piel oscura `.pwa-mod`.
- **Sin JavaScript:** se muestra un aviso en lugar de las pantallas.

### Barra del prototipo

Todas las pantallas tienen una barra superior amarilla que no forma parte del producto. Contiene:

- La etiqueta visible **"Prototipo - datos ficticios"**.
- La referencia a la pantalla que se ve: el wireframe (W-xx), la pantalla de la especificación (PAN-xxx) y la ruta canónica.
- El botón **Mapa del prototipo**, que vuelve al inicio.
- El botón **Ficha**, que abre la ficha de la pantalla: propósito, roles, capacidad, ola y ruta.
- El botón **Reiniciar datos**.

## 2. Estructura de archivos

```text
25-prototipo-navegable/
├── index.html                      Punto de entrada (doble clic)
├── css/
│   └── estilos.css                 Tokens (admin claro/oscuro y PWA), shells, componentes, responsive
└── js/
    ├── datos.js                    Datos ficticios semilla, persistencia en sessionStorage, validación de CUIT
    ├── ui.js                       Componentes: insignias de estado, campos, modal, toasts, pestañas, íconos SVG
    ├── app.js                      Router por hash, guardas de sesión, AdminShell, AppShell, barra del prototipo, recorridos
    ├── pantallas-acceso.js         Mapa del prototipo, login, 2FA, elección de espacio, sin acceso, no encontrada
    ├── pantallas-admin-socios.js   Tablero, titulares, personas, ficha de cuenta/contrato, alta, ficha 360, servicios
    ├── pantallas-admin-operacion.js Lotes, comprobantes (listado y detalle), cuenta corriente, caja, recibos, CRM, OT
    ├── pantallas-socio.js          Portal (PWA): inicio, cuentas, detalle/movimientos, contratar/solicitud, facturas, pago, perfil, gestiones
    └── pantallas-campo.js          App de campo (PWA): Mi día, ejecución de OT, cola sin conexión, stock
```

Los scripts se cargan como `<script>` clásicos y en orden (no son módulos ES), para que funcionen al abrir el archivo directamente desde el disco.

## 3. Pantallas

"—" en la columna Wireframe indica una pantalla de la especificación sin wireframe propio en el documento 05. Se agregó porque los recorridos la necesitan.

### 3.1 Acceso

| Wireframe | Pantalla | PAN | Ruta del prototipo |
|---|---|---|---|
| W-01 | Login (usuario y contraseña, SSO simulado) | PAN-UXD-13 · PAN-POR-23 | `#/login` |
| W-01 | Verificación en dos pasos | PAN-UXD-13 | `#/login/2fa` |
| W-01 | Elegir cooperativa y espacio | PAN-UXD-13 · PAN-POR-23 | `#/login/espacio` |
| — | Sin acceso | PAN-UXD-12 | `#/sin-acceso` |
| — | Página no encontrada | — | cualquier ruta inexistente |

### 3.2 Admin (personal de la cooperativa)

| Wireframe | Pantalla | PAN | Ruta canónica |
|---|---|---|---|
| W-02 | Layout general del admin y buscador (tablero) | AdminShell · PAN-UXD-04 | `/admin/inicio` |
| W-02 | Búsqueda de titulares y cuentas | PAN-PER-01 | `/admin/per/titulares` |
| — | Alta de persona, titular y cuenta (modal) | PAN-PER-04 · PAN-PER-05 | modal lg desde `/admin/per/titulares` (`?alta=1`) |
| W-03 | Ficha 360 del titular | PAN-PER-02 | `/admin/per/titulares/:holderId` |
| — | Personas (listado y detalle) | PAN-PER-03 | `/admin/per/personas`, `/admin/per/personas/:personId` |
| — | Ficha de la cuenta | PAN-PER-05 | `/admin/per/cuentas/:accountId` |
| W-04 | Alta de contrato de servicio (asistente de 6 pasos) | PAN-CAT-15 | `/admin/cat/contracts/new` |
| — | Ficha del contrato de servicio | PAN-CAT-14 | `/admin/cat/contracts/:contractId` |
| — | Catálogo de servicios | PAN-CAT-03 | `/admin/cat/services` |
| W-10 | Configuración del servicio Internet | PAN-CAT-04 | `/admin/cat/services/:id` |
| — | Lotes de facturación | PAN-FAC-05 | `/admin/fac/lotes` |
| W-06 | Revisión previa del lote (aprobación y emisión) | PAN-FAC-07 | `/admin/fac/lotes/:id` |
| W-05 | Listado de comprobantes | PAN-FAC-09 | `/admin/fac/comprobantes` |
| — | Detalle del comprobante | PAN-FAC-10 | `/admin/fac/comprobantes/:invoiceId` |
| — | Apertura y cierre de caja | PAN-COB-09 | `/admin/cob/caja/apertura` |
| — | Cuenta corriente (vista Cobranza) | PAN-COB-01 | `/admin/cob/cuentas/:currentAccountId` |
| W-07 | Cobro en ventanilla | PAN-COB-10 | `/admin/cob/caja/cobro` |
| — | Recibos | PAN-COB-14 | `/admin/cob/recibos` |
| W-08 | Bandeja de reclamos y casos | PAN-CRM-02 | `/admin/crm/bandeja` |
| W-08 | Expediente del caso | PAN-CRM-03 | `/admin/crm/casos/:id` |
| — | Tablero de órdenes de trabajo | PAN-TEC-04 | `/admin/tec/work-orders` |
| W-09 | Ficha de orden de trabajo | PAN-TEC-05 | `/admin/tec/work-orders/:id` |

El AdminShell incluye:

- **Barra superior:** marca, contexto de cooperativa y sucursal, buscador global (Ctrl+K), mapa del sitio, accesos fijados, alertas, ayuda de la pantalla (`?`) y menú de usuario.
- **Menú lateral:** agrupado por clústeres, con la opción actual marcada. Incluye **Personas** (PAN-PER-03) y un acceso ejemplo a **Cuenta corriente** de la cuenta 0001 (PAN-COB-01).
- **Cabecera de página:** migas de pan y título.

En tabletas el menú lateral se pliega. Por debajo de 768 px se muestra el aviso de que el admin está pensado para escritorio.

Si se elige **Cooperativa Ejemplo Dos**, el tablero aparece vacío. Así se ilustra el aislamiento por cooperativa (tenant): cada una ve solo sus datos.

### 3.3 Portal del socio (PWA, M19)

| Wireframe | Pantalla | PAN | Ruta canónica |
|---|---|---|---|
| W-11 | Inicio con saldo | PAN-POR-25 | `/app/inicio` |
| — | Mis cuentas y servicios | PAN-POR-26 | `/app/cuentas` |
| — | Detalle de cuenta | PAN-POR-28 | `/app/cuentas/:accountId` |
| — | Movimientos de cuenta | PAN-POR-43 | `/app/cuentas/:accountId/movimientos` |
| W-15 | Vincular cuenta con código | PAN-POR-27 | `/app/cuentas/vincular` |
| — | Mis facturas | PAN-POR-38 | `/app/facturas` |
| W-12 | Detalle de factura ("¿Por qué pago esto?") | PAN-POR-39 | `/app/facturas/:invoiceId` |
| W-13 | Pagar (SIRO o cupón de pago en efectivo) | PAN-POR-40 | `/app/pagar` |
| W-13 | Resultado del pago | PAN-POR-41 | `/app/pagos/:checkoutId` |
| — | Historial de pagos | PAN-POR-42 | `/app/pagos` |
| — | Mis gestiones | PAN-POR-50 | `/app/gestiones` |
| W-14 | Nueva gestión o reclamo (modal) | PAN-POR-51 | `/app/gestiones/nueva` |
| — | Seguimiento de la gestión | PAN-POR-33 | `/app/gestiones/:caseId` |
| — | Contratar (catálogo de planes) | PAN-POR-31 | `/app/contratar` |
| — | Solicitar contratación desde la app | PAN-POR-32 | `/app/contratar/solicitar` |
| — | Mi perfil | PAN-POR-59 | `/app/perfil` |
| — | Comunidad (fuera del piloto; estado vacío) | M17/T09 | `/app/comunidad` |

El AppShell del socio tiene:

- **Barra superior:** menú (incluye Contratar, Mi perfil y accesos rápidos), marca de la cooperativa, notificaciones y avatar de usuario.
- **Barra inferior:** Inicio, Servicios, botón flotante (+), Gestiones y Comunidad.

En escritorio la app se muestra dentro de un marco de teléfono de 430 px. En el celular ocupa toda la pantalla.

### 3.4 App de campo (PWA, técnicos)

| Wireframe | Pantalla | PAN | Ruta canónica |
|---|---|---|---|
| W-16 | Mi día: agenda de OT (y vista "Órdenes") | PAN-TEC-50 | `/app/campo/today` |
| W-17 | Ejecución y cierre de OT con evidencias (8 pasos) | PAN-TEC-51 | `/app/campo/work-orders/:id` |
| — | Cola de sincronización | PAN-TEC-53 | `/app/campo/sync` |
| — | Stock en vehículo (solo consulta) | — | `/app/campo/stock` |

La barra inferior de campo tiene Hoy, Órdenes, botón flotante, Stock y Sincronización.

Un interruptor del prototipo simula **trabajar sin conexión**:

- Las acciones se encolan con un `clientMutationId` y se aplican al sincronizar.
- Mientras tanto se muestra un banner de "sin conexión" y el contador de pendientes.

## 4. Recorridos guiados

Cada recorrido se inicia desde el Mapa del prototipo. Al iniciarlo:

- Se restablecen los datos.
- Se inicia la sesión que corresponda.
- Se preparan las precondiciones; por ejemplo, el lote ya emitido para los recorridos 5 y 6.

Una barra inferior muestra el paso actual con los botones Anterior, Siguiente paso y Salir del recorrido. La barra avanza sola cuando el usuario llega a la pantalla del paso siguiente.

| N.º | Recorrido | Pasos principales | Pantallas |
|---|---|---|---|
| 1 | Ingreso y selección de cooperativa y espacio | Ingresar con cualquier usuario y contraseña (p. ej. DNI 00000000). Escribir cualquier código de 6 dígitos y verificar. Elegir la cooperativa y el espacio (probar también "Cooperativa Ejemplo Dos"). Llegar al tablero y usar Ctrl+K. | W-01, W-02 |
| 2 | Alta de persona, titular y cuenta | En Titulares, tocar "Nuevo titular". Completar persona, titular y cuenta. Al guardar se abre la ficha 360 del nuevo titular. | PAN-PER-01, PAN-PER-04/05, W-03 |
| 3 | Alta de contrato de Internet | En la ficha 360, la cuenta 0002 no tiene contratos: tocar "Nuevo contrato". Recorrer los 6 pasos y crear. El contrato queda **Solicitado** y vinculado a un caso de solicitud, que aparece en la bandeja. | W-03, W-04, W-08 |
| 4 | Facturación: revisión previa y emisión | Abrir LOT-2026-11-INT (Prefacturado). Revisar la muestra, aprobar (con segregación de funciones) y emitir. El avance del proceso es simulado. Los comprobantes de 11-2026 aparecen en el listado. | PAN-FAC-05, W-06, W-05 |
| 5 | Cobro en caja y recibo | Abrir la caja 01 con un fondo inicial. Buscar la cuenta 0001, entregar ARS 40.000 en efectivo (vuelto ARS 5.000) y confirmar con F10. Ver el recibo. La cuenta corriente de la ficha 360 o la pantalla PAN-COB-01 muestra el pago. | PAN-COB-09, W-07, PAN-COB-14, PAN-COB-01, W-03 |
| 6 | Portal del socio: facturas, pago, vinculación y gestiones | En Inicio, abrir "Tu última factura" y ver "¿Por qué pago esto?". Pagar con SIRO; el pago queda pendiente hasta simular la notificación de aprobación (también se puede simular el rechazo). Vincular la cuenta 0002 con el DNI 00000000. Crear una gestión o reclamo con el botón (+) y seguirla. | W-11, W-12, W-13, PAN-POR-41, W-15, W-14, PAN-POR-33 |
| 7 | Reclamo y orden de trabajo (admin y campo) | En la bandeja, abrir el reclamo vencido 2026-000040. Tomarlo y crear una OT de reclamo técnico, luego despacharla. Pasar a la app de campo: Mi día, abrir la OT, completar los 8 pasos (checklist, serie, fotos, prueba, conformidad) y marcarla ejecutada. Volver al admin, confirmar y cerrar la OT: el caso queda resuelto. | W-08, PAN-CRM-03, W-09, W-16, W-17 |

## 5. Datos ficticios

| Tipo | Valores |
|---|---|
| Cooperativas | "Cooperativa Ejemplo" (Sucursal Centro) y "Cooperativa Ejemplo Dos" (sin datos, para mostrar el aislamiento). CUIT de la cooperativa: 30-00000000-7. |
| Personas | Socio Ejemplo (DNI 00000000, CUIT 20-00000000-1), Ana Prueba, Comercio Ficticio S.R.L. (responsable inscripto), Carlos Muestra. Correos con dominio reservado `.example`. |
| Titulares y cuentas | Titulares 000123 a 000126. Cuentas 0001 y 0002 (Socio Ejemplo), 0003 (Ana), 0004 (Comercio), 0005 (Carlos). |
| Contratos | INT-0001 Activo desde 28-10-2026. INT-0002 Pendiente de instalación (caso 2026-000045, OT 0000002). INT-0003 e INT-0004 Activos. |
| Planes | Fibra 100: ARS 15.000 por mes y ARS 20.000 de instalación. Fibra 300: ARS 22.000 por mes. |
| Facturación | LOT-2026-10-INT cerrado. LOT-2026-11-INT prefacturado (universo 100, aptos 98, 2 excepciones). |
| Atención | Casos 2026-000039 (resuelto), 2026-000040 (reclamo vencido), 2026-000044 (consulta) y 2026-000045 (solicitud de alta). |
| Técnica | OT 0000001 (cerrada) y 0000002 (asignada a "Cuadrilla Ejemplo 1", visita 05-11-2026 de 09:00 a 12:00). |
| Usuarios demo | "Usuario Ejemplo D" (personal), "Socio Ejemplo" (socio), "Técnico Ejemplo" (campo). |

Los CUIT se generan con un dígito verificador válido. El alta de persona valida:

- el formato y el dígito verificador del CUIT
- que el CUIT coincida con el DNI
- que no haya un documento duplicado

## 6. Diseño y accesibilidad

### Tokens y piel visual

- Se usan los tokens de T03 §7.A: piel admin en tema oscuro y claro, piel PWA `.pwa-mod` con fondo negro y halo lila, radios, espaciado, alturas y escala de z-index.
- Tres valores se ajustaron solo en el prototipo para cumplir el contraste que T03 declara. Ver la sección 9, Observaciones.

### Tipografía

- No se descarga ninguna fuente.
- Space Grotesk, IBM Plex Sans/Mono y Sora se usan solo si están instaladas en el equipo. Si no, se usa la fuente del sistema (Segoe UI, system-ui, Roboto).

### Insignias de estado (StatusBadge)

- Siempre muestran ícono y texto; el estado nunca se comunica solo con color.
- Los mapas de estado siguen las máquinas de estados de la especificación: contrato, estado comercial y fiscal del comprobante, lote, caso, OT, checkout y caja.

### Accesibilidad

- **Navegación y foco:**
  - Enlace "Saltar al contenido".
  - Foco visible en todos los controles.
  - Al navegar, el foco va al `h1` de la pantalla, y se conserva al volver a dibujar la misma pantalla.
- **Formularios:**
  - Etiquetas asociadas a cada campo y marca de obligatorio en texto.
  - Errores en línea con `aria-describedby` y un resumen de errores que recibe el foco.
  - `autocomplete` donde corresponde, incluido `one-time-code` en la verificación.
- **Componentes:**
  - Modales nativos `<dialog>` con título asociado y cierre con Esc.
  - Pestañas con `role="tablist"` y navegación con flechas.
  - Tablas con `th scope`.
  - Regiones `aria-live` para avisos y toasts. Los toasts de error no se cierran solos.
- **Tamaño y movimiento:**
  - Objetivos táctiles de 44 px o más en la PWA.
  - Se respeta `prefers-reduced-motion`.

### Diseño adaptable

- **Admin:**
  - El menú lateral se pliega por debajo de 1024 px.
  - Las grillas pasan a una columna por debajo de 768 px, donde también aparece el aviso de uso en escritorio.
- **PWA:** marco de teléfono en escritorio y pantalla completa en el celular.

## 7. Alcance

El prototipo cubre:

- Los 17 wireframes (W-01 a W-17).
- Las pantallas auxiliares que los recorridos necesitan: PAN-PER-04, PAN-CAT-03, PAN-FAC-05, PAN-COB-09, PAN-COB-14, PAN-TEC-04, PAN-TEC-53 y las listas del portal.
- **Ampliación (posteriores a la versión mínima del artefacto 4.3):** pantallas de detalle y navegación cruzada admin ↔ socio: PAN-PER-03, PAN-PER-05 (ficha de cuenta), PAN-CAT-14, PAN-FAC-10, PAN-COB-01, PAN-POR-28, PAN-POR-43, PAN-POR-32 (solicitud desde la app), PAN-POR-59. Siguen el piloto Internet O0–O5; no abren olas O6+ ni el catálogo completo de ~1.000 PAN.
- Los siete recorridos pedidos (sin recorrido guiado propio para la ampliación; se accede desde el mapa o desde enlaces dentro de las pantallas).

Las reglas visibles en los wireframes están simuladas en el navegador:

- **Estados:**
  - Las transiciones de contrato, lote, caso y OT siguen las máquinas de estados de la especificación.
  - El contrato nuevo nace Solicitado.
  - La facturación empieza con la activación.
- **Permisos y controles:**
  - Segregación de funciones en la aprobación del lote.
  - Confirmación con escritura del identificador para anular.
- **Caja:**
  - Sesión de caja obligatoria para cobrar.
  - Vuelto, pago parcial y varios medios de pago.
- **Portal y campo:**
  - Antienumeración y límite de intentos en la vinculación.
  - Protección contra doble envío en el pago.
  - Requisitos de cierre de la OT.
  - Cola sin conexión.

## 8. Limitaciones

- **Sin servidor:**
  - No hay persistencia real ni concurrencia.
  - La seguridad, los permisos y el aislamiento por cooperativa están simulados en la interfaz.
  - El usuario demo del admin tiene todos los roles.
- **Integraciones simuladas:**
  - SSO, verificación en dos pasos, pasarela SIRO y notificación de pago.
  - Autorización fiscal (CAE).
  - Impresión de recibos (agente local).
  - Generación de PDF.
  - Mapas y georreferencia.
  - Carga de archivos y fotos.
  - Lectura de código de barras y de número de serie.
  - Dictado.
  - Instalación de la PWA y notificaciones push.
- **Detalle parcial:**
  - No todas las pestañas o secciones de las pantallas tienen el detalle completo. Las que no lo tienen muestran un estado vacío explicativo.
  - En la vinculación de cuenta solo se implementa el primer método, número de cuenta y documento.
  - PAN-POR-32 crea contrato Solicitado y caso en bandeja, pero no reproduce el asistente completo del admin (W-04) ni la factibilidad técnica paso a paso.
  - El detalle de comprobante en admin sigue disponible como modal rápido desde el listado; la ruta PAN-FAC-10 es la vista de página completa.
- **No implementado:**
  - Confirmación de "cambios sin guardar" al salir de un formulario.
  - Búsqueda difusa ni paginación real.
  - Internacionalización, más allá del español rioplatense.
- **Diferencias con la especificación:**
  - El asistente de contrato W-04 está especificado como modal, pero tiene ruta propia. En el prototipo se implementó como página, por la ruta.
  - El selector de cooperativa del admin no tiene ruta canónica (AD-01). Se usa `#/login/espacio`.
- **Navegadores:** probado en navegadores Chromium actuales. Requiere soporte de `<dialog>` y de `:has()` (solo estético).

## 9. Observaciones

Inconsistencias o vacíos detectados en la especificación durante la construcción. **No se corrigió la especificación.** Cuando hubo que elegir, en el prototipo se siguió la regla de negocio y no el texto del wireframe.

1. **W-04: estado resultante del contrato.** El resumen del asistente muestra "Estado resultante: Pendiente de instalación". El mismo wireframe dice que el contrato se crea Solicitado, e Internet requiere factibilidad (DEC-040, RN-CAT-026). El prototipo crea el contrato en **Solicitado**.
2. **W-03 / W-12: cobro de la instalación.** Los wireframes facturan la instalación y el abono de INT-0001 mientras W-03 lo muestra Pendiente de instalación. Esto contradice M02 T06: la facturación empieza con la activación. En el prototipo, INT-0001 está **Activo desde el 28-10-2026**, y la factura 11-2026 (ARS 15.000 + 20.000 = 35.000) es coherente con esa activación.
3. **Número de caso 2026-000045 duplicado.** Se usa como la solicitud de alta de Internet (W-11, W-03, W-09) y como el reclamo "Lentitud intermitente" (W-08). El prototipo lo usa solo para la solicitud de alta; el reclamo de la bandeja es 2026-000040.
4. **CUIT de ejemplo inválido.** El CUIT 20-00000000-0 de los ejemplos no pasa la validación de dígito verificador; el válido es 20-00000000-1. El prototipo usa CUIT calculados con dígito verificador correcto.
5. **Contraste de tokens de T03 §7.A.** Algunos valores declarados no alcanzan la relación de contraste que T03 promete:
   - `--line-strong` oscuro `#3b3450` sobre `--panel` da alrededor de 1,45:1, y el claro `#c3bdd3` alrededor de 1,8:1. T03 declara 3:1 o más para bordes de controles. El prototipo usa `#7a7192` (oscuro) y `#8a84a0` (claro).
   - `--ok` claro `#1f8f5f` como texto da alrededor de 4,07:1, frente al 4,5:1 declarado. El prototipo usa `#1a7a51`.
   - El borde de campos de la PWA con blanco al 32 % sobre `#17171d` queda por debajo de 3:1. El prototipo usa blanco al 40 %.
   - Para enlaces sobre el panel se definió `--brand-accessible`: `#aea4fa` en el tema oscuro y `#5a49e0` en el claro.
6. **Rutas y capacidades distintas entre T03 §10.8.2 y §10.9.4:**
   - SM-PWS-010: `/pagar/resultado/:id` con `por.pagos.ver` frente a `/app/pagos/:checkoutId` con `por.pagos.crear`. El prototipo usa `/app/pagos/:checkoutId`.
   - SM-PWS-001: `por.inicio.ver` frente a `por.portal.ver`.
   - SM-PWS-017: `por.gestiones.ver` frente a `por.gestiones.crear` (ya registrado como AD-13).
7. **W-07: número de comprobante abreviado.** Se usa "FC B 0001-01". El prototipo muestra el número completo (punto de venta de 4 dígitos y número de 8).
8. **Pantallas sin wireframe.** El alta de persona, titular y cuenta (PAN-PER-04; modal) y la apertura de caja (PAN-COB-09) no tienen wireframe propio en el documento 05, aunque los recorridos pedidos las necesitan. Se diseñaron siguiendo los patrones de T03. La ficha de cuenta (PAN-PER-05) tiene ruta propia `/admin/per/cuentas/:accountId` distinta del modal de alta; en la ampliación se implementó como página.
9. **Selector de cooperativa del admin sin ruta.** No hay ruta canónica para el selector de cooperativa y espacio del personal (pendiente AD-01). El prototipo lo resuelve con `#/login/espacio`.
10. **W-04: modal o página.** El asistente se especifica como modal pero tiene ruta propia (`/admin/cat/contracts/new`). El prototipo lo implementa como página para respetar la ruta.
11. **Números de cuenta de ejemplo en el portal.** Los textos de ejemplo del portal usan "Cta 0007" y otros números que no coinciden con las cuentas de los wireframes del admin. El prototipo usa el mismo conjunto de cuentas (0001 a 0005) en todos los espacios.
