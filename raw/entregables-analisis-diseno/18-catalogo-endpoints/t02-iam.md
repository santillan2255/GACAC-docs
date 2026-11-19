# Catálogo de endpoints · T02 · Identidad, autenticación, roles, perfiles, alcance y auditoría

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Definir, de forma única para toda la plataforma GoodApps Cooperativas, quién es cada actor (identidad), cómo prueba que es quien dice ser (autenticación), en qué cooperativa y con qué condición actúa (pertenencia y selección de ámbito), qué puede ver y hacer (perfiles de pantallas, roles funcionales, capabilities, alcance de datos, franja horaria, separación de funciones y autorizaciones de supervisor) y qué evidencia queda (auditoría inmutable de cambios, accesos, lecturas sensibles, exportaciones, mensajes e IA). El anexo reemplaza el modelo de seguridad de ProCoop (contraseñas reversibles, contraseñas maestras, usuario SQL compartido, permisos solo por opción de menú, auditoría selectiva) por uno verificable según OWASP ASVS 5.0.0 [SEG1], NIST SP 800-63B-4 [SEG2], RFC 9700 [SEG3] y OpenID Connect [SEG4], y cumple el principio de BASE §29: no alcanza con ocultar botones; tenant, usuario habilitado, perfil de pantalla, permiso de acción y alcance se verifican en el servidor en cada request. Criterio rector (AGR-008): para cualquier usuario se puede explicar por qué una pantalla, un registro y una acción están habilitados o denegados, también en la API.

Detalle completo en el anexo T02, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=t02-iam).

| Dato | Valor |
|---|---|
| Endpoints | 128 |
| Por método | DELETE 8, GET 45, PATCH 7, POST 64, PUT 4 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 0 |
| Con requisito inferido (a confirmar) | 98 |
| Sin requisito identificable | 30 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API](#grupo-1) | 128 | Resolver tenant y métodos.; Login staff/socio con contraseña.; Enviar/crear desafío.… |

## Cómo leer cada ficha

Cada endpoint tiene una ficha con estos datos:

| Dato | De dónde sale |
|---|---|
| **Qué hace** | La descripción de la fila API del anexo (§11), seguida de una frase armada con el método HTTP, la forma de la ruta y el nombre de la colección en T05. |
| **Para qué sirve** | El requisito funcional (RF) que el endpoint implementa, con su texto del §5 del anexo. Si la fila API o el anexo lo vinculan, se cita tal cual. Si no, se elige el RF del anexo con más palabras en común y se marca *a confirmar*. |
| **Quién lo usa** | El canal, según el prefijo de la ruta (backoffice, portal del socio, app de campo, consola de plataforma, terceros, público), y el permiso (capability) de T02. |
| **Recibe / Devuelve** | Parámetros, cuerpo y respuesta exitosa del contrato OpenAPI. |
| **Pantallas** | Pantallas del catálogo 4.5 que exigen el mismo permiso. |
| **Ola y fuente** | Ola de construcción y línea de la fila API en el anexo. |

<a id="grupo-1"></a>

## API

128 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-IAM-01](#API-IAM-01) | POST | `/api/auth/pre-login` | Resolver tenant y métodos. |
| [API-IAM-02](#API-IAM-02) | POST | `/api/auth/login` | Login staff/socio con contraseña. |
| [API-IAM-03](#API-IAM-03) | POST | `/api/auth/mfa/challenge` | Enviar/crear desafío. |
| [API-IAM-04](#API-IAM-04) | POST | `/api/auth/mfa/verify` | Verificar factor; opción dispositivo confiable. |
| [API-IAM-05](#API-IAM-05) | GET | `/api/auth/scopes` | Ámbitos disponibles. |
| [API-IAM-06](#API-IAM-06) | POST | `/api/auth/scope` | Seleccionar ámbito y contexto operativo; emite sesión. |
| [API-IAM-07](#API-IAM-07) | POST | `/api/auth/switch-scope` | Cambiar ámbito. |
| [API-IAM-08](#API-IAM-08) | PUT | `/api/auth/operating-context` | Cambiar sucursal/PV/caja. |
| [API-IAM-09](#API-IAM-09) | POST | `/api/auth/refresh` | Rotar refresh, nuevo access. |
| [API-IAM-10](#API-IAM-10) | POST | `/api/auth/logout` | Cerrar sesión. |
| [API-IAM-11](#API-IAM-11) | POST | `/api/auth/logout-all` | Cerrar todas (identidad o tenant) |
| [API-IAM-12](#API-IAM-12) | POST | `/api/auth/password/forgot` | Pedir recuperación (202 genérico) |
| [API-IAM-13](#API-IAM-13) | POST | `/api/auth/password/reset` | Restablecer. |
| [API-IAM-14](#API-IAM-14) | POST | `/api/auth/password/change` | Cambiar contraseña. |
| [API-IAM-15](#API-IAM-15) | GET | `/api/auth/oidc/{provider}/start` | Inicio federado (google, cidi, idp del tenant) |
| [API-IAM-16](#API-IAM-16) | GET | `/api/auth/oidc/{provider}/callback` | Callback federado. |
| [API-IAM-17](#API-IAM-17) | POST | `/api/auth/otp-login/start` | Inicio sin contraseña (PA-IAM-01) |
| [API-IAM-18](#API-IAM-18) | POST | `/api/auth/otp-login/verify` | Verificar OTP de ingreso. |
| [API-IAM-19](#API-IAM-19) | POST | `/api/auth/invitations/{token}/accept` | Aceptar invitación. |
| [API-IAM-20](#API-IAM-20) | POST | `/api/auth/register` | Registro de socio/visitante. |
| [API-IAM-21](#API-IAM-21) | POST | `/api/auth/verify-email/{token}` | Verificar correo. |
| [API-IAM-22](#API-IAM-22) | GET | `/api/auth/me` | Identidad, ámbito, contexto, marca. |
| [API-IAM-23](#API-IAM-23) | GET | `/api/auth/me/permissions` | Capabilities y pantallas efectivas (para menú y can()) |
| [API-IAM-24](#API-IAM-24) | GET | `/api/me/security/factors` | Gestionar factores. |
| [API-IAM-24-b](#API-IAM-24-b) | POST | `/api/me/security/factors` | Gestionar factores. |
| [API-IAM-24-c](#API-IAM-24-c) | GET | `/api/me/security/factors/{id}` | Gestionar factores. |
| [API-IAM-24-d](#API-IAM-24-d) | DELETE | `/api/me/security/factors/{id}` | Gestionar factores. |
| [API-IAM-25](#API-IAM-25) | POST | `/api/me/security/recovery-codes` | Regenerar códigos. |
| [API-IAM-26](#API-IAM-26) | GET | `/api/me/security/sessions` | Ver/cerrar sesiones propias. |
| [API-IAM-26-b](#API-IAM-26-b) | GET | `/api/me/security/sessions/{id}` | Ver/cerrar sesiones propias. |
| [API-IAM-26-c](#API-IAM-26-c) | DELETE | `/api/me/security/sessions/{id}` | Ver/cerrar sesiones propias. |
| [API-IAM-27](#API-IAM-27) | GET | `/api/me/security/trusted-devices` | Dispositivos confiables. |
| [API-IAM-27-b](#API-IAM-27-b) | GET | `/api/me/security/trusted-devices/{id}` | Dispositivos confiables. |
| [API-IAM-27-c](#API-IAM-27-c) | DELETE | `/api/me/security/trusted-devices/{id}` | Dispositivos confiables. |
| [API-IAM-28](#API-IAM-28) | GET | `/api/me/security/links` | Vincular/desvincular Google/CiDi/SSO. |
| [API-IAM-28-b](#API-IAM-28-b) | POST | `/api/me/security/links` | Vincular/desvincular Google/CiDi/SSO. |
| [API-IAM-28-c](#API-IAM-28-c) | GET | `/api/me/security/links/{id}` | Vincular/desvincular Google/CiDi/SSO. |
| [API-IAM-28-d](#API-IAM-28-d) | DELETE | `/api/me/security/links/{id}` | Vincular/desvincular Google/CiDi/SSO. |
| [API-IAM-29](#API-IAM-29) | POST | `/api/portal/accounts/link` | Vincular cuenta con prueba. |
| [API-IAM-30](#API-IAM-30) | GET | `/api/admin/iam/users` | Listar staff (?page=&size=) |
| [API-IAM-31](#API-IAM-31) | POST | `/api/admin/iam/users/invitations` | Invitar. |
| [API-IAM-32](#API-IAM-32) | POST | `/api/admin/iam/users/import` | Preview/confirmar importación. |
| [API-IAM-33](#API-IAM-33) | GET | `/api/admin/iam/users/{membershipId}` | Ficha (con version) |
| [API-IAM-33-b](#API-IAM-33-b) | PATCH | `/api/admin/iam/users/{membershipId}` | Ficha (con version) |
| [API-IAM-34](#API-IAM-34) | POST | `/api/admin/iam/users/{membershipId}/suspend` | Estados. |
| [API-IAM-34-b](#API-IAM-34-b) | POST | `/api/admin/iam/users/{membershipId}/reactivate` | Estados. |
| [API-IAM-34-c](#API-IAM-34-c) | POST | `/api/admin/iam/users/{membershipId}/revoke` | Estados. |
| [API-IAM-35](#API-IAM-35) | POST | `/api/admin/iam/users/{membershipId}/access-reset` | Enviar restablecimiento / iniciar recuperación asistida. |
| [API-IAM-36](#API-IAM-36) | GET | `/api/admin/iam/roles` | Roles (clonar con ?from=) |
| [API-IAM-36-b](#API-IAM-36-b) | POST | `/api/admin/iam/roles` | Roles (clonar con ?from=) |
| [API-IAM-36-c](#API-IAM-36-c) | GET | `/api/admin/iam/roles/{id}` | Roles (clonar con ?from=) |
| [API-IAM-36-d](#API-IAM-36-d) | PATCH | `/api/admin/iam/roles/{id}` | Roles (clonar con ?from=) |
| [API-IAM-37](#API-IAM-37) | POST | `/api/admin/iam/users/{membershipId}/role-assignments` | Asignar/quitar. |
| [API-IAM-37-b](#API-IAM-37-b) | DELETE | `/api/admin/iam/users/{membershipId}/role-assignments/{id}` | Asignar/quitar. |
| [API-IAM-38](#API-IAM-38) | GET | `/api/admin/iam/profiles` | Perfiles. |
| [API-IAM-38-b](#API-IAM-38-b) | POST | `/api/admin/iam/profiles` | Perfiles. |
| [API-IAM-38-c](#API-IAM-38-c) | GET | `/api/admin/iam/profiles/{id}` | Perfiles. |
| [API-IAM-38-d](#API-IAM-38-d) | PATCH | `/api/admin/iam/profiles/{id}` | Perfiles. |
| [API-IAM-39](#API-IAM-39) | POST | `/api/admin/iam/users/{membershipId}/profile-assignments` | Asignar perfiles. |
| [API-IAM-39-b](#API-IAM-39-b) | DELETE | `/api/admin/iam/users/{membershipId}/profile-assignments/{id}` | Asignar perfiles. |
| [API-IAM-40](#API-IAM-40) | GET | `/api/admin/iam/capabilities` | Catálogos (filtrados por licencia) |
| [API-IAM-40-b](#API-IAM-40-b) | GET | `/api/admin/iam/screens` | Catálogos (filtrados por licencia) |
| [API-IAM-41](#API-IAM-41) | POST | `/api/admin/iam/explain` | Explicar permiso. |
| [API-IAM-42](#API-IAM-42) | GET | `/api/admin/iam/sod/rules` | Reglas SoD. |
| [API-IAM-42-b](#API-IAM-42-b) | PUT | `/api/admin/iam/sod/rules` | Reglas SoD. |
| [API-IAM-43](#API-IAM-43) | GET | `/api/admin/iam/sod/exceptions` | Excepciones. |
| [API-IAM-43-b](#API-IAM-43-b) | POST | `/api/admin/iam/sod/exceptions` | Excepciones. |
| [API-IAM-43-c](#API-IAM-43-c) | POST | `/api/admin/iam/sod/exceptions/{id}/approve` | Excepciones. |
| [API-IAM-43-d](#API-IAM-43-d) | POST | `/api/admin/iam/sod/exceptions/{id}/reject` | Excepciones. |
| [API-IAM-44](#API-IAM-44) | GET | `/api/admin/iam/sessions` | Sesiones del tenant. |
| [API-IAM-44-b](#API-IAM-44-b) | GET | `/api/admin/iam/sessions/{id}` | Sesiones del tenant. |
| [API-IAM-44-c](#API-IAM-44-c) | DELETE | `/api/admin/iam/sessions/{id}` | Sesiones del tenant. |
| [API-IAM-45](#API-IAM-45) | GET | `/api/admin/iam/policies` | Políticas (vía T04) |
| [API-IAM-45-b](#API-IAM-45-b) | PUT | `/api/admin/iam/policies` | Políticas (vía T04) |
| [API-IAM-46](#API-IAM-46) | GET | `/api/admin/iam/identity-providers` | SSO. |
| [API-IAM-46-b](#API-IAM-46-b) | POST | `/api/admin/iam/identity-providers` | SSO. |
| [API-IAM-46-c](#API-IAM-46-c) | GET | `/api/admin/iam/identity-providers/{id}` | SSO. |
| [API-IAM-46-d](#API-IAM-46-d) | PATCH | `/api/admin/iam/identity-providers/{id}` | SSO. |
| [API-IAM-46-e](#API-IAM-46-e) | POST | `/api/admin/iam/identity-providers/{id}/test` | SSO. |
| [API-IAM-47](#API-IAM-47) | GET | `/api/admin/iam/api-clients` | Clientes API. |
| [API-IAM-47-b](#API-IAM-47-b) | POST | `/api/admin/iam/api-clients` | Clientes API. |
| [API-IAM-47-c](#API-IAM-47-c) | GET | `/api/admin/iam/api-clients/{id}` | Clientes API. |
| [API-IAM-47-d](#API-IAM-47-d) | POST | `/api/admin/iam/api-clients/{id}/rotate` | Clientes API. |
| [API-IAM-47-e](#API-IAM-47-e) | POST | `/api/admin/iam/api-clients/{id}/revoke` | Clientes API. |
| [API-IAM-48](#API-IAM-48) | POST | `/api/v1/ext/oauth/token` | Token técnico. |
| [API-IAM-51](#API-IAM-51) | GET | `/api/admin/iam/authorizations` | Bandeja. |
| [API-IAM-49](#API-IAM-49) | POST | `/api/admin/iam/authorizations` | Crear solicitud inline/diferida. |
| [API-IAM-50](#API-IAM-50) | POST | `/api/admin/iam/authorizations/{id}/approve-inline` | Aprobación con supervisor presente. |
| [API-IAM-52](#API-IAM-52) | POST | `/api/admin/iam/authorizations/{id}/approve` | Decidir. |
| [API-IAM-52-b](#API-IAM-52-b) | POST | `/api/admin/iam/authorizations/{id}/reject` | Decidir. |
| [API-IAM-52-c](#API-IAM-52-c) | POST | `/api/admin/iam/authorizations/{id}/cancel` | Decidir. |
| [API-IAM-53](#API-IAM-53) | GET | `/api/admin/audit/changes` | Consultar cambios. |
| [API-IAM-54](#API-IAM-54) | GET | `/api/admin/audit/changes/entity/{collection}/{id}` | Historial de un objeto. |
| [API-IAM-55](#API-IAM-55) | GET | `/api/admin/audit/access` | Accesos. |
| [API-IAM-56](#API-IAM-56) | GET | `/api/admin/audit/reads` | Lecturas y exportaciones. |
| [API-IAM-57](#API-IAM-57) | GET | `/api/admin/audit/messages` | Mensajes. |
| [API-IAM-58](#API-IAM-58) | GET | `/api/admin/audit/ai` | IA. |
| [API-IAM-59](#API-IAM-59) | POST | `/api/admin/audit/export` | Exportación (job) |
| [API-IAM-60](#API-IAM-60) | POST | `/api/admin/audit/ai/{eventId}/decision` | Registrar decisión humana. |
| [API-IAM-61](#API-IAM-61) | GET | `/api/admin/audit/integrity` | Verificación de cadena. |
| [API-IAM-62](#API-IAM-62) | PUT | `/api/admin/iam/presence` | Presencia de edición. |
| [API-IAM-62-b](#API-IAM-62-b) | DELETE | `/api/admin/iam/presence` | Presencia de edición. |
| [API-IAM-63](#API-IAM-63) | GET | `/api/admin/iam/portal-users` | Accesos al portal. |
| [API-IAM-63-b](#API-IAM-63-b) | POST | `/api/admin/iam/portal-users` | Accesos al portal. |
| [API-IAM-63-c](#API-IAM-63-c) | POST | `/api/admin/iam/portal-users/{membershipId}/block` | Accesos al portal. |
| [API-IAM-63-d](#API-IAM-63-d) | POST | `/api/admin/iam/portal-users/{membershipId}/unblock` | Accesos al portal. |
| [API-IAM-63-e](#API-IAM-63-e) | POST | `/api/admin/iam/portal-users/{membershipId}/resend` | Accesos al portal. |
| [API-IAM-63-f](#API-IAM-63-f) | POST | `/api/admin/iam/portal-users/{membershipId}/unlink` | Accesos al portal. |
| [API-IAM-64](#API-IAM-64) | GET | `/api/admin/iam/support-access` | Soporte (lado tenant) |
| [API-IAM-64-b](#API-IAM-64-b) | POST | `/api/admin/iam/support-access` | Soporte (lado tenant) |
| [API-IAM-64-c](#API-IAM-64-c) | POST | `/api/admin/iam/support-access/{id}/approve` | Soporte (lado tenant) |
| [API-IAM-64-d](#API-IAM-64-d) | POST | `/api/admin/iam/support-access/{id}/reject` | Soporte (lado tenant) |
| [API-IAM-64-e](#API-IAM-64-e) | POST | `/api/admin/iam/support-access/{id}/revoke` | Soporte (lado tenant) |
| [API-IAM-65](#API-IAM-65) | POST | `/api/platform/support-access` | Soporte (lado plataforma) |
| [API-IAM-65-b](#API-IAM-65-b) | POST | `/api/platform/support-access/{id}/start` | Soporte (lado plataforma) |
| [API-IAM-65-c](#API-IAM-65-c) | POST | `/api/platform/support-access/{id}/end` | Soporte (lado plataforma) |
| [API-IAM-66](#API-IAM-66) | GET | `/api/platform/iam/users` | Plataforma. |
| [API-IAM-66-b](#API-IAM-66-b) | POST | `/api/platform/iam/users` | Plataforma. |
| [API-IAM-66-c](#API-IAM-66-c) | PATCH | `/api/platform/iam/users` | Plataforma. |
| [API-IAM-66-d](#API-IAM-66-d) | GET | `/api/platform/iam/role-templates` | Plataforma. |
| [API-IAM-66-e](#API-IAM-66-e) | POST | `/api/platform/iam/role-templates` | Plataforma. |
| [API-IAM-66-f](#API-IAM-66-f) | PATCH | `/api/platform/iam/role-templates` | Plataforma. |
| [API-IAM-67](#API-IAM-67) | GET | `/api/platform/security/alerts` | Alertas. |
| [API-IAM-67-b](#API-IAM-67-b) | GET | `/api/platform/security/alerts/{id}` | Alertas. |
| [API-IAM-67-c](#API-IAM-67-c) | PATCH | `/api/platform/security/alerts/{id}` | Alertas. |
| [API-IAM-68](#API-IAM-68) | GET | `/api/admin/iam/access-reviews` | Recertificación. |
| [API-IAM-68-b](#API-IAM-68-b) | POST | `/api/admin/iam/access-reviews` | Recertificación. |
| [API-IAM-68-c](#API-IAM-68-c) | POST | `/api/admin/iam/access-reviews/{id}/decisions` | Recertificación. |

<a id="API-IAM-01"></a>
#### API-IAM-01 · `POST /api/auth/pre-login`

- **Qué hace:** Resolver tenant y métodos. Registra un nuevo elemento u operación en `pre-login`.
- **Para qué sirve:** RF-IAM-044: Métodos de factor permitidos por rol: SMS no admitido para roles de plataforma ni T-ADM (PA-IAM-13). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; acceso según el anexo: «public: true».
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4141 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-01)

<a id="API-IAM-02"></a>
#### API-IAM-02 · `POST /api/auth/login`

- **Qué hace:** Login staff/socio con contraseña. Inicia sesión sobre `login`.
- **Para qué sirve:** RF-IAM-021: Login de staff con usuario (alias por tenant) o correo + contraseña, luego 2FA si corresponde. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; acceso según el anexo: «public: true».
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4142 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-02)

<a id="API-IAM-03"></a>
#### API-IAM-03 · `POST /api/auth/mfa/challenge`

- **Qué hace:** Enviar/crear desafío. Registra un nuevo elemento u operación en `challenge`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; acceso según el anexo: «public: true».
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4143 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-03)

<a id="API-IAM-04"></a>
#### API-IAM-04 · `POST /api/auth/mfa/verify`

- **Qué hace:** Verificar factor; opción dispositivo confiable. Verifica sobre `verify`.
- **Para qué sirve:** RF-IAM-023: Dispositivo confiable: opción "no volver a pedir en este dispositivo durante 30 días" (parametrizable, 0 = deshabilitado), con listado y revocación por el usuario y por el administrador. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; acceso según el anexo: «public: true».
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4144 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-04)

<a id="API-IAM-05"></a>
#### API-IAM-05 · `GET /api/auth/scopes`

- **Qué hace:** Ámbitos disponibles. Consulta `scopes`.
- **Para qué sirve:** RF-IAM-032: Cambio autenticado de contraseña con verificación de la contraseña vigente o factor, notificación y revocación de las demás sesiones según política. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; permiso `iam.sesion.autenticada`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4145 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-05)

<a id="API-IAM-06"></a>
#### API-IAM-06 · `POST /api/auth/scope`

- **Qué hace:** Seleccionar ámbito y contexto operativo; emite sesión. Registra un nuevo elemento u operación en `scope`.
- **Para qué sirve:** RF-IAM-009: Selección del contexto operativo (sucursal, punto de venta, caja) al iniciar sesión staff, limitado a los permitidos por el alcance; valores por defecto por usuario y por puesto enrolado; cambiable desde la topbar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; acceso según el anexo: «public: true».
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4146 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-06)

<a id="API-IAM-07"></a>
#### API-IAM-07 · `POST /api/auth/switch-scope`

- **Qué hace:** Cambiar ámbito. Registra un nuevo elemento u operación en `switch-scope`.
- **Para qué sirve:** RF-IAM-009: Selección del contexto operativo (sucursal, punto de venta, caja) al iniciar sesión staff, limitado a los permitidos por el alcance; valores por defecto por usuario y por puesto enrolado; cambiable desde la topbar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; permiso `iam.sesion.autenticada`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4147 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-07)

<a id="API-IAM-08"></a>
#### API-IAM-08 · `PUT /api/auth/operating-context`

- **Qué hace:** Cambiar sucursal/PV/caja. Reemplaza o configura `operating-context`.
- **Para qué sirve:** RF-IAM-009: Selección del contexto operativo (sucursal, punto de venta, caja) al iniciar sesión staff, limitado a los permitidos por el alcance; valores por defecto por usuario y por puesto enrolado; cambiable desde la topbar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; permiso `iam.sesion.autenticada`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4148 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-08)

<a id="API-IAM-09"></a>
#### API-IAM-09 · `POST /api/auth/refresh`

- **Qué hace:** Rotar refresh, nuevo access. Actualiza sobre `refresh`.
- **Para qué sirve:** RF-IAM-035: Sesión: access JWT de 15 minutos + refresh opaco de 30 días rotativo, guardado hasheado en sessions, con detección de reutilización (revoca la familia) y sessionEpoch para "cerrar sesión en todos los dispositivos". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; acceso según el anexo: «public: true».
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4149 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-09)

<a id="API-IAM-10"></a>
#### API-IAM-10 · `POST /api/auth/logout`

- **Qué hace:** Cerrar sesión. Cierra la sesión sobre `logout`.
- **Para qué sirve:** RF-IAM-035: Sesión: access JWT de 15 minutos + refresh opaco de 30 días rotativo, guardado hasheado en sessions, con detección de reutilización (revoca la familia) y sessionEpoch para "cerrar sesión en todos los dispositivos". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; permiso `iam.sesion.autenticada`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4150 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-10)

<a id="API-IAM-11"></a>
#### API-IAM-11 · `POST /api/auth/logout-all`

- **Qué hace:** Cerrar todas (identidad o tenant) Registra un nuevo elemento u operación en `logout-all`.
- **Para qué sirve:** RF-IAM-035: Sesión: access JWT de 15 minutos + refresh opaco de 30 días rotativo, guardado hasheado en sessions, con detección de reutilización (revoca la familia) y sessionEpoch para "cerrar sesión en todos los dispositivos". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; permiso `iam.miCuenta.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-61 (Seguridad de la cuenta), PAN-IAM-07 (Mi seguridad).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4151 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-11)

<a id="API-IAM-12"></a>
#### API-IAM-12 · `POST /api/auth/password/forgot`

- **Qué hace:** Pedir recuperación (202 genérico) Registra un nuevo elemento u operación en `forgot`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-IAM-030: Recuperación de contraseña con respuesta siempre genérica (anti-enumeración), token de un solo uso con vigencia limitada, validación del segundo factor si está registrado y sin desactivar MFA. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; acceso según el anexo: «public: true».
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4152 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-12)

<a id="API-IAM-13"></a>
#### API-IAM-13 · `POST /api/auth/password/reset`

- **Qué hace:** Restablecer. Restablece sobre `reset`.
- **Para qué sirve:** RF-IAM-041: Sin contraseñas por defecto: el alta de usuarios y el "blanqueo" generan una invitación o enlace de restablecimiento de un solo uso; nunca una contraseña conocida. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; acceso según el anexo: «public: true».
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4153 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-13)

<a id="API-IAM-14"></a>
#### API-IAM-14 · `POST /api/auth/password/change`

- **Qué hace:** Cambiar contraseña. Registra un nuevo elemento u operación en `change`.
- **Para qué sirve:** RF-IAM-005: Una persona empleada y socia en el mismo tenant tiene dos contextos separados en la misma pertenencia; cambia explícitamente entre ellos (PA-IAM-08). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; permiso `iam.miCuenta.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-61 (Seguridad de la cuenta), PAN-IAM-07 (Mi seguridad).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4154 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-14)

<a id="API-IAM-15"></a>
#### API-IAM-15 · `GET /api/auth/oidc/{provider}/start`

- **Qué hace:** Inicio federado (google, cidi, idp del tenant) Consulta «start» de un registro de `start`.
- **Para qué sirve:** RF-IAM-027: CiDi Córdoba (Ciudadano Digital) como proveedor federado habilitable por tenant (equivalente a var 40 "Habilitar CIDI en la Web" de CoopOnline); se registra el nivel de verificación de identidad que informe CiDi. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; acceso según el anexo: «public: true».
- **Recibe:** en la ruta `provider`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4155 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-15)

<a id="API-IAM-16"></a>
#### API-IAM-16 · `GET /api/auth/oidc/{provider}/callback`

- **Qué hace:** Callback federado. Consulta «callback» de un registro de `callback`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; acceso según el anexo: «public: true».
- **Recibe:** en la ruta `provider`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4156 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-16)

<a id="API-IAM-17"></a>
#### API-IAM-17 · `POST /api/auth/otp-login/start`

- **Qué hace:** Inicio sin contraseña (PA-IAM-01) Inicia sobre `start`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; acceso según el anexo: «public: true».
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4157 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-17)

<a id="API-IAM-18"></a>
#### API-IAM-18 · `POST /api/auth/otp-login/verify`

- **Qué hace:** Verificar OTP de ingreso. Verifica sobre `verify`.
- **Para qué sirve:** RF-IAM-076: Desactivación de inactivos: pertenencias staff sin ingreso en PRM-IAM-062 días se suspenden con aviso previo (PA-IAM-14). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; acceso según el anexo: «public: true».
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4158 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-18)

<a id="API-IAM-19"></a>
#### API-IAM-19 · `POST /api/auth/invitations/{token}/accept`

- **Qué hace:** Aceptar invitación. Acepta un registro de `accept`.
- **Para qué sirve:** RF-IAM-047: Invitación de staff: el T-ADM/T-USR invita por correo; el invitado acepta, crea o reutiliza su identidad (inicia sesión si ya existe) y queda con la pertenencia; la invitación vence en PRM-IAM-040 horas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; acceso según el anexo: «public: true».
- **Recibe:** en la ruta `token`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4159 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-19)

<a id="API-IAM-20"></a>
#### API-IAM-20 · `POST /api/auth/register`

- **Qué hace:** Registro de socio/visitante. Registra sobre `register`.
- **Para qué sirve:** RF-IAM-048: Registro de socio y vinculación de cuentas con prueba (DEC-043: código de factura + documento, código al contacto o validación presencial, con intentos limitados; PA-IAM-12); el registro sencillo puede preceder al contrato… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; acceso según el anexo: «public: true».
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4160 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-20)

<a id="API-IAM-21"></a>
#### API-IAM-21 · `POST /api/auth/verify-email/{token}`

- **Qué hace:** Verificar correo. Registra un nuevo elemento u operación en `verify-email`.
- **Para qué sirve:** RF-IAM-001: Existe una identidad de acceso común por persona humana (correo verificado como identificador global, teléfono opcional, contraseña, factores y vínculos federados), sin datos de negocio de ningún tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; acceso según el anexo: «public: true».
- **Recibe:** en la ruta `token`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4161 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-21)

<a id="API-IAM-22"></a>
#### API-IAM-22 · `GET /api/auth/me`

- **Qué hace:** Identidad, ámbito, contexto, marca. Consulta `me`.
- **Para qué sirve:** RF-IAM-003: La selección de ámbito (tenant + contexto) es explícita, verificada en servidor y visible en la topbar; si hay un solo ámbito se selecciona automáticamente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; permiso `iam.sesion.autenticada`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4162 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-22)

<a id="API-IAM-23"></a>
#### API-IAM-23 · `GET /api/auth/me/permissions`

- **Qué hace:** Capabilities y pantallas efectivas (para menú y can()) Consulta `permissions`.
- **Para qué sirve:** RF-IAM-032: Cambio autenticado de contraseña con verificación de la contraseña vigente o factor, notificación y revocación de las demás sesiones según política. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier usuario, para iniciar o administrar su sesión; permiso `iam.sesion.autenticada`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4163 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-23)

<a id="API-IAM-24"></a>
#### API-IAM-24 · `GET /api/me/security/factors`

- **Qué hace:** Gestionar factores. Lista, con filtros y paginación, los registros de factores de autenticación (`authFactors`).
- **Para qué sirve:** RF-IAM-032: Cambio autenticado de contraseña con verificación de la contraseña vigente o factor, notificación y revocación de las demás sesiones según política. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `iam.miCuenta.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de factores de autenticación (`authFactors`) con `total`.
- **Pantallas:** PAN-POR-61 (Seguridad de la cuenta), PAN-IAM-07 (Mi seguridad).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4164 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-24)

<a id="API-IAM-24-b"></a>
#### API-IAM-24-b · `POST /api/me/security/factors`

- **Qué hace:** Gestionar factores. Da de alta un registro de factores de autenticación (`authFactors`).
- **Para qué sirve:** RF-IAM-032: Cambio autenticado de contraseña con verificación de la contraseña vigente o factor, notificación y revocación de las demás sesiones según política. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `iam.miCuenta.gestionar`.
- **Recibe:** los datos de factores de autenticación (`authFactors`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de factores de autenticación (`authFactors`).
- **Pantallas:** PAN-POR-61 (Seguridad de la cuenta), PAN-IAM-07 (Mi seguridad).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4164 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-24-b)

<a id="API-IAM-24-c"></a>
#### API-IAM-24-c · `GET /api/me/security/factors/{id}`

- **Qué hace:** Gestionar factores. Obtiene el detalle de un registro de factores de autenticación (`authFactors`).
- **Para qué sirve:** RF-IAM-032: Cambio autenticado de contraseña con verificación de la contraseña vigente o factor, notificación y revocación de las demás sesiones según política. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `iam.miCuenta.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de factores de autenticación (`authFactors`).
- **Pantallas:** PAN-POR-61 (Seguridad de la cuenta), PAN-IAM-07 (Mi seguridad).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4164 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-24-c)

<a id="API-IAM-24-d"></a>
#### API-IAM-24-d · `DELETE /api/me/security/factors/{id}`

- **Qué hace:** Gestionar factores. Elimina o da de baja un registro de factores de autenticación (`authFactors`).
- **Para qué sirve:** RF-IAM-032: Cambio autenticado de contraseña con verificación de la contraseña vigente o factor, notificación y revocación de las demás sesiones según política. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `iam.miCuenta.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-POR-61 (Seguridad de la cuenta), PAN-IAM-07 (Mi seguridad).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4164 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-24-d)

<a id="API-IAM-25"></a>
#### API-IAM-25 · `POST /api/me/security/recovery-codes`

- **Qué hace:** Regenerar códigos. Registra un nuevo elemento u operación en `recovery-codes`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `iam.miCuenta.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-61 (Seguridad de la cuenta), PAN-IAM-07 (Mi seguridad).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4165 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-25)

<a id="API-IAM-26"></a>
#### API-IAM-26 · `GET /api/me/security/sessions`

- **Qué hace:** Ver/cerrar sesiones propias. Lista, con filtros y paginación, los registros de sesiones y refresh rotativo; TTL (`sessions`).
- **Para qué sirve:** RF-IAM-035: Sesión: access JWT de 15 minutos + refresh opaco de 30 días rotativo, guardado hasheado en sessions, con detección de reutilización (revoca la familia) y sessionEpoch para "cerrar sesión en todos los dispositivos". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `iam.miCuenta.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de sesiones y refresh rotativo; TTL (`sessions`) con `total`.
- **Pantallas:** PAN-POR-61 (Seguridad de la cuenta), PAN-IAM-07 (Mi seguridad).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4166 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-26)

<a id="API-IAM-26-b"></a>
#### API-IAM-26-b · `GET /api/me/security/sessions/{id}`

- **Qué hace:** Ver/cerrar sesiones propias. Obtiene el detalle de un registro de sesiones y refresh rotativo; TTL (`sessions`).
- **Para qué sirve:** RF-IAM-035: Sesión: access JWT de 15 minutos + refresh opaco de 30 días rotativo, guardado hasheado en sessions, con detección de reutilización (revoca la familia) y sessionEpoch para "cerrar sesión en todos los dispositivos". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `iam.miCuenta.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de sesiones y refresh rotativo; TTL (`sessions`).
- **Pantallas:** PAN-POR-61 (Seguridad de la cuenta), PAN-IAM-07 (Mi seguridad).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4166 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-26-b)

<a id="API-IAM-26-c"></a>
#### API-IAM-26-c · `DELETE /api/me/security/sessions/{id}`

- **Qué hace:** Ver/cerrar sesiones propias. Elimina o da de baja un registro de sesiones y refresh rotativo; TTL (`sessions`).
- **Para qué sirve:** RF-IAM-035: Sesión: access JWT de 15 minutos + refresh opaco de 30 días rotativo, guardado hasheado en sessions, con detección de reutilización (revoca la familia) y sessionEpoch para "cerrar sesión en todos los dispositivos". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `iam.miCuenta.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-POR-61 (Seguridad de la cuenta), PAN-IAM-07 (Mi seguridad).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4166 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-26-c)

<a id="API-IAM-27"></a>
#### API-IAM-27 · `GET /api/me/security/trusted-devices`

- **Qué hace:** Dispositivos confiables. Lista, con filtros y paginación, los registros de dispositivos de confianza (`trustedDevices`).
- **Para qué sirve:** RF-IAM-023: Dispositivo confiable: opción "no volver a pedir en este dispositivo durante 30 días" (parametrizable, 0 = deshabilitado), con listado y revocación por el usuario y por el administrador. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `iam.miCuenta.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de dispositivos de confianza (`trustedDevices`) con `total`.
- **Pantallas:** PAN-POR-61 (Seguridad de la cuenta), PAN-IAM-07 (Mi seguridad).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4167 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-27)

<a id="API-IAM-27-b"></a>
#### API-IAM-27-b · `GET /api/me/security/trusted-devices/{id}`

- **Qué hace:** Dispositivos confiables. Obtiene el detalle de un registro de dispositivos de confianza (`trustedDevices`).
- **Para qué sirve:** RF-IAM-023: Dispositivo confiable: opción "no volver a pedir en este dispositivo durante 30 días" (parametrizable, 0 = deshabilitado), con listado y revocación por el usuario y por el administrador. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `iam.miCuenta.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de dispositivos de confianza (`trustedDevices`).
- **Pantallas:** PAN-POR-61 (Seguridad de la cuenta), PAN-IAM-07 (Mi seguridad).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4167 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-27-b)

<a id="API-IAM-27-c"></a>
#### API-IAM-27-c · `DELETE /api/me/security/trusted-devices/{id}`

- **Qué hace:** Dispositivos confiables. Elimina o da de baja un registro de dispositivos de confianza (`trustedDevices`).
- **Para qué sirve:** RF-IAM-023: Dispositivo confiable: opción "no volver a pedir en este dispositivo durante 30 días" (parametrizable, 0 = deshabilitado), con listado y revocación por el usuario y por el administrador. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `iam.miCuenta.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-POR-61 (Seguridad de la cuenta), PAN-IAM-07 (Mi seguridad).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4167 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-27-c)

<a id="API-IAM-28"></a>
#### API-IAM-28 · `GET /api/me/security/links`

- **Qué hace:** Vincular/desvincular Google/CiDi/SSO. Lista, con filtros y paginación, los registros de vínculos Google/OIDC/CiDi (`federatedLinks`).
- **Para qué sirve:** RF-IAM-025: Login de socio con Google (OIDC), con vínculo explícito y seguro a la pertenencia; sin fusión por correo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `iam.miCuenta.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de vínculos Google/OIDC/CiDi (`federatedLinks`) con `total`.
- **Pantallas:** PAN-POR-61 (Seguridad de la cuenta), PAN-IAM-07 (Mi seguridad).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4168 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-28)

<a id="API-IAM-28-b"></a>
#### API-IAM-28-b · `POST /api/me/security/links`

- **Qué hace:** Vincular/desvincular Google/CiDi/SSO. Da de alta un registro de vínculos Google/OIDC/CiDi (`federatedLinks`).
- **Para qué sirve:** RF-IAM-025: Login de socio con Google (OIDC), con vínculo explícito y seguro a la pertenencia; sin fusión por correo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `iam.miCuenta.gestionar`.
- **Recibe:** los datos de vínculos Google/OIDC/CiDi (`federatedLinks`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de vínculos Google/OIDC/CiDi (`federatedLinks`).
- **Pantallas:** PAN-POR-61 (Seguridad de la cuenta), PAN-IAM-07 (Mi seguridad).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4168 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-28-b)

<a id="API-IAM-28-c"></a>
#### API-IAM-28-c · `GET /api/me/security/links/{id}`

- **Qué hace:** Vincular/desvincular Google/CiDi/SSO. Obtiene el detalle de un registro de vínculos Google/OIDC/CiDi (`federatedLinks`).
- **Para qué sirve:** RF-IAM-025: Login de socio con Google (OIDC), con vínculo explícito y seguro a la pertenencia; sin fusión por correo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `iam.miCuenta.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de vínculos Google/OIDC/CiDi (`federatedLinks`).
- **Pantallas:** PAN-POR-61 (Seguridad de la cuenta), PAN-IAM-07 (Mi seguridad).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4168 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-28-c)

<a id="API-IAM-28-d"></a>
#### API-IAM-28-d · `DELETE /api/me/security/links/{id}`

- **Qué hace:** Vincular/desvincular Google/CiDi/SSO. Elimina o da de baja un registro de vínculos Google/OIDC/CiDi (`federatedLinks`).
- **Para qué sirve:** RF-IAM-025: Login de socio con Google (OIDC), con vínculo explícito y seguro a la pertenencia; sin fusión por correo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `iam.miCuenta.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-POR-61 (Seguridad de la cuenta), PAN-IAM-07 (Mi seguridad).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4168 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-28-d)

<a id="API-IAM-29"></a>
#### API-IAM-29 · `POST /api/portal/accounts/link`

- **Qué hace:** Vincular cuenta con prueba. Vincula sobre `link`.
- **Para qué sirve:** RF-IAM-048: Registro de socio y vinculación de cuentas con prueba (DEC-043: código de factura + documento, código al contacto o validación presencial, con intentos limitados; PA-IAM-12); el registro sencillo puede preceder al contrato… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.cuentas.vincular`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-27 (Vincular cuenta), PAN-IAM-32 (Vinculación de cuenta del socio).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4169 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-29)

<a id="API-IAM-30"></a>
#### API-IAM-30 · `GET /api/admin/iam/users`

- **Qué hace:** Listar staff (?page=&size=) Lista, con filtros y paginación, los registros de `users`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.usuarios.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-IAM-09 (Usuarios del staff), PAN-IAM-10 (Ficha de usuario).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4170 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-30)

<a id="API-IAM-31"></a>
#### API-IAM-31 · `POST /api/admin/iam/users/invitations`

- **Qué hace:** Invitar. Registra un nuevo elemento u operación en `invitations`.
- **Para qué sirve:** RF-IAM-041: Sin contraseñas por defecto: el alta de usuarios y el "blanqueo" generan una invitación o enlace de restablecimiento de un solo uso; nunca una contraseña conocida. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.usuarios.invitar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4171 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-31)

<a id="API-IAM-32"></a>
#### API-IAM-32 · `POST /api/admin/iam/users/import`

- **Qué hace:** Preview/confirmar importación. Importa sobre `import`.
- **Para qué sirve:** RF-IAM-078: Importación masiva de usuarios por ExcelImportWizard (subir → preview con errores → confirmar), que genera invitaciones (nunca contraseñas). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.usuarios.importar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-31 (ExcelImportWizard de usuarios).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4172 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-32)

<a id="API-IAM-33"></a>
#### API-IAM-33 · `GET /api/admin/iam/users/{membershipId}`

- **Qué hace:** Ficha (con version) Obtiene el detalle de un registro de `users`.
- **Para qué sirve:** RF-IAM-140: Aviso de edición concurrente ("Juan está editando esta ficha") con presencia de TTL 120 s; no bloquea. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.usuarios.ver`.
- **Recibe:** en la ruta `membershipId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-09 (Usuarios del staff), PAN-IAM-10 (Ficha de usuario).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4173 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-33)

<a id="API-IAM-33-b"></a>
#### API-IAM-33-b · `PATCH /api/admin/iam/users/{membershipId}`

- **Qué hace:** Ficha (con version) Modifica algunos campos de un registro de `users` (solo los enviados).
- **Para qué sirve:** RF-IAM-140: Aviso de edición concurrente ("Juan está editando esta ficha") con presencia de TTL 120 s; no bloquea. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.usuarios.ver`.
- **Recibe:** en la ruta `membershipId`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-09 (Usuarios del staff), PAN-IAM-10 (Ficha de usuario).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4173 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-33-b)

<a id="API-IAM-34"></a>
#### API-IAM-34 · `POST /api/admin/iam/users/{membershipId}/suspend`

- **Qué hace:** Estados. Suspende un registro de `suspend`.
- **Para qué sirve:** RF-IAM-076: Desactivación de inactivos: pertenencias staff sin ingreso en PRM-IAM-062 días se suspenden con aviso previo (PA-IAM-14). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.usuarios.suspender`.
- **Recibe:** en la ruta `membershipId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4174 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-34)

<a id="API-IAM-34-b"></a>
#### API-IAM-34-b · `POST /api/admin/iam/users/{membershipId}/reactivate`

- **Qué hace:** Estados. Reactiva un registro de `reactivate`.
- **Para qué sirve:** RF-IAM-076: Desactivación de inactivos: pertenencias staff sin ingreso en PRM-IAM-062 días se suspenden con aviso previo (PA-IAM-14). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.usuarios.suspender`.
- **Recibe:** en la ruta `membershipId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4174 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-34-b)

<a id="API-IAM-34-c"></a>
#### API-IAM-34-c · `POST /api/admin/iam/users/{membershipId}/revoke`

- **Qué hace:** Estados. Revoca un registro de `revoke`.
- **Para qué sirve:** RF-IAM-076: Desactivación de inactivos: pertenencias staff sin ingreso en PRM-IAM-062 días se suspenden con aviso previo (PA-IAM-14). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.usuarios.suspender`.
- **Recibe:** en la ruta `membershipId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4174 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-34-c)

<a id="API-IAM-35"></a>
#### API-IAM-35 · `POST /api/admin/iam/users/{membershipId}/access-reset`

- **Qué hace:** Enviar restablecimiento / iniciar recuperación asistida. Registra «access-reset» sobre un registro de `access-reset`.
- **Para qué sirve:** RF-IAM-031: Pérdida del segundo factor: códigos de recuperación o procedimiento reforzado asistido (verificación de identidad por el T-ADM/T-USR con evidencia y período de espera), con notificación a todos los medios registrados. Un correo o… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.usuarios.restablecerAcceso`.
- **Recibe:** en la ruta `membershipId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4175 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-35)

<a id="API-IAM-36"></a>
#### API-IAM-36 · `GET /api/admin/iam/roles`

- **Qué hace:** Roles (clonar con ?from=) Lista, con filtros y paginación, los registros de roles con capabilities (`roles`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.roles.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de roles con capabilities (`roles`) con `total`.
- **Pantallas:** PAN-IAM-11 (Roles).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4176 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-36)

<a id="API-IAM-36-b"></a>
#### API-IAM-36-b · `POST /api/admin/iam/roles`

- **Qué hace:** Roles (clonar con ?from=) Da de alta un registro de roles con capabilities (`roles`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.roles.ver`.
- **Recibe:** los datos de roles con capabilities (`roles`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de roles con capabilities (`roles`).
- **Pantallas:** PAN-IAM-11 (Roles).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4176 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-36-b)

<a id="API-IAM-36-c"></a>
#### API-IAM-36-c · `GET /api/admin/iam/roles/{id}`

- **Qué hace:** Roles (clonar con ?from=) Obtiene el detalle de un registro de roles con capabilities (`roles`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.roles.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de roles con capabilities (`roles`).
- **Pantallas:** PAN-IAM-11 (Roles).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4176 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-36-c)

<a id="API-IAM-36-d"></a>
#### API-IAM-36-d · `PATCH /api/admin/iam/roles/{id}`

- **Qué hace:** Roles (clonar con ?from=) Modifica algunos campos de un registro de roles con capabilities (`roles`) (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.roles.ver`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de roles con capabilities (`roles`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de roles con capabilities (`roles`).
- **Pantallas:** PAN-IAM-11 (Roles).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4176 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-36-d)

<a id="API-IAM-37"></a>
#### API-IAM-37 · `POST /api/admin/iam/users/{membershipId}/role-assignments`

- **Qué hace:** Asignar/quitar. Da de alta un registro de rol asignado con alcance de datos (`roleAssignments`).
- **Para qué sirve:** RF-IAM-072: Autoasignación prohibida y delegación acotada: nadie se asigna roles ni amplía su alcance; solo se delegan capabilities que el delegante tiene, con alcance ⊆ el propio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.roles.asignar`.
- **Recibe:** en la ruta `membershipId`; los datos de rol asignado con alcance de datos (`roleAssignments`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de rol asignado con alcance de datos (`roleAssignments`).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4177 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-37)

<a id="API-IAM-37-b"></a>
#### API-IAM-37-b · `DELETE /api/admin/iam/users/{membershipId}/role-assignments/{id}`

- **Qué hace:** Asignar/quitar. Elimina o da de baja un registro de rol asignado con alcance de datos (`roleAssignments`).
- **Para qué sirve:** RF-IAM-072: Autoasignación prohibida y delegación acotada: nadie se asigna roles ni amplía su alcance; solo se delegan capabilities que el delegante tiene, con alcance ⊆ el propio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.roles.asignar`.
- **Recibe:** en la ruta `membershipId`, `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4177 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-37-b)

<a id="API-IAM-38"></a>
#### API-IAM-38 · `GET /api/admin/iam/profiles`

- **Qué hace:** Perfiles. Lista, con filtros y paginación, los registros de perfiles de pantalla (`screenProfiles`).
- **Para qué sirve:** RF-IAM-063: Perfiles de pantallas administrables (árbol de siteMapGroups por app), con franja horaria y apps habilitadas (admin, pwa-socio, pwa-empleado, pwa-campo); clonables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.perfiles.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de perfiles de pantalla (`screenProfiles`) con `total`.
- **Pantallas:** PAN-IAM-12 (Editor de perfiles).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4178 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-38)

<a id="API-IAM-38-b"></a>
#### API-IAM-38-b · `POST /api/admin/iam/profiles`

- **Qué hace:** Perfiles. Da de alta un registro de perfiles de pantalla (`screenProfiles`).
- **Para qué sirve:** RF-IAM-063: Perfiles de pantallas administrables (árbol de siteMapGroups por app), con franja horaria y apps habilitadas (admin, pwa-socio, pwa-empleado, pwa-campo); clonables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.perfiles.ver`.
- **Recibe:** los datos de perfiles de pantalla (`screenProfiles`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de perfiles de pantalla (`screenProfiles`).
- **Pantallas:** PAN-IAM-12 (Editor de perfiles).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4178 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-38-b)

<a id="API-IAM-38-c"></a>
#### API-IAM-38-c · `GET /api/admin/iam/profiles/{id}`

- **Qué hace:** Perfiles. Obtiene el detalle de un registro de perfiles de pantalla (`screenProfiles`).
- **Para qué sirve:** RF-IAM-063: Perfiles de pantallas administrables (árbol de siteMapGroups por app), con franja horaria y apps habilitadas (admin, pwa-socio, pwa-empleado, pwa-campo); clonables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.perfiles.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de perfiles de pantalla (`screenProfiles`).
- **Pantallas:** PAN-IAM-12 (Editor de perfiles).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4178 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-38-c)

<a id="API-IAM-38-d"></a>
#### API-IAM-38-d · `PATCH /api/admin/iam/profiles/{id}`

- **Qué hace:** Perfiles. Modifica algunos campos de un registro de perfiles de pantalla (`screenProfiles`) (solo los enviados).
- **Para qué sirve:** RF-IAM-063: Perfiles de pantallas administrables (árbol de siteMapGroups por app), con franja horaria y apps habilitadas (admin, pwa-socio, pwa-empleado, pwa-campo); clonables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.perfiles.ver`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de perfiles de pantalla (`screenProfiles`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de perfiles de pantalla (`screenProfiles`).
- **Pantallas:** PAN-IAM-12 (Editor de perfiles).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4178 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-38-d)

<a id="API-IAM-39"></a>
#### API-IAM-39 · `POST /api/admin/iam/users/{membershipId}/profile-assignments`

- **Qué hace:** Asignar perfiles. Da de alta un registro de perfil de pantalla asignado (`profileAssignments`).
- **Para qué sirve:** RF-IAM-063: Perfiles de pantallas administrables (árbol de siteMapGroups por app), con franja horaria y apps habilitadas (admin, pwa-socio, pwa-empleado, pwa-campo); clonables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.perfiles.asignar`.
- **Recibe:** en la ruta `membershipId`; los datos de perfil de pantalla asignado (`profileAssignments`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de perfil de pantalla asignado (`profileAssignments`).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4179 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-39)

<a id="API-IAM-39-b"></a>
#### API-IAM-39-b · `DELETE /api/admin/iam/users/{membershipId}/profile-assignments/{id}`

- **Qué hace:** Asignar perfiles. Elimina o da de baja un registro de perfil de pantalla asignado (`profileAssignments`).
- **Para qué sirve:** RF-IAM-063: Perfiles de pantallas administrables (árbol de siteMapGroups por app), con franja horaria y apps habilitadas (admin, pwa-socio, pwa-empleado, pwa-campo); clonables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.perfiles.asignar`.
- **Recibe:** en la ruta `membershipId`, `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4179 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-39-b)

<a id="API-IAM-40"></a>
#### API-IAM-40 · `GET /api/admin/iam/capabilities`

- **Qué hace:** Catálogos (filtrados por licencia) Lista, con filtros y paginación, los registros de `capabilities`.
- **Para qué sirve:** RF-IAM-060: Catálogo de capabilities declarado en código (packages/shared/capabilities) con metadatos (módulo, recurso, acción, sensible, SoD, autorizable, limitada por importe, exponible por API, módulo de licencia) y sincronizado a… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.roles.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-IAM-11 (Roles).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4180 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-40)

<a id="API-IAM-40-b"></a>
#### API-IAM-40-b · `GET /api/admin/iam/screens`

- **Qué hace:** Catálogos (filtrados por licencia) Lista, con filtros y paginación, los registros de `screens`.
- **Para qué sirve:** RF-IAM-060: Catálogo de capabilities declarado en código (packages/shared/capabilities) con metadatos (módulo, recurso, acción, sensible, SoD, autorizable, limitada por importe, exponible por API, módulo de licencia) y sincronizado a… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.roles.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-IAM-11 (Roles).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4180 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-40-b)

<a id="API-IAM-41"></a>
#### API-IAM-41 · `POST /api/admin/iam/explain`

- **Qué hace:** Explicar permiso. Registra un nuevo elemento u operación en `explain`.
- **Para qué sirve:** RF-IAM-069: Explicador de permisos: para usuario + pantalla/acción/registro devuelve permitido/denegado y la cadena de razones (licencia, activación, perfil, rol, denegación, alcance, franja, SoD, límite, MFA). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.permisos.explicar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-14 (Explicador de permisos).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4181 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-41)

<a id="API-IAM-42"></a>
#### API-IAM-42 · `GET /api/admin/iam/sod/rules`

- **Qué hace:** Reglas SoD. Lista, con filtros y paginación, los registros de reglas de separación de funciones (`sodRules`).
- **Para qué sirve:** RF-IAM-005: Una persona empleada y socia en el mismo tenant tiene dos contextos separados en la misma pertenencia; cambia explícitamente entre ellos (PA-IAM-08). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.sod.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de reglas de separación de funciones (`sodRules`) con `total`.
- **Pantallas:** PAN-IAM-13 (Segregación de funciones).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4182 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-42)

<a id="API-IAM-42-b"></a>
#### API-IAM-42-b · `PUT /api/admin/iam/sod/rules`

- **Qué hace:** Reglas SoD. Reemplaza o configura reglas de separación de funciones (`sodRules`).
- **Para qué sirve:** RF-IAM-005: Una persona empleada y socia en el mismo tenant tiene dos contextos separados en la misma pertenencia; cambia explícitamente entre ellos (PA-IAM-08). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.sod.configurar`.
- **Recibe:** los datos de reglas de separación de funciones (`sodRules`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de reglas de separación de funciones (`sodRules`).
- **Pantallas:** PAN-IAM-13 (Segregación de funciones).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4182 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-42-b)

<a id="API-IAM-43"></a>
#### API-IAM-43 · `GET /api/admin/iam/sod/exceptions`

- **Qué hace:** Excepciones. Lista, con filtros y paginación, los registros de excepciones aprobadas a SoD (`sodExceptions`).
- **Para qué sirve:** RF-IAM-091: SoD estática: catálogo de pares de capabilities incompatibles (sección 6, RN-IAM-040) que se controla al asignar roles; bloqueante o advertencia con excepción aprobada y control compensatorio (PA-IAM-04). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.sod.excepcionAprobar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de excepciones aprobadas a SoD (`sodExceptions`) con `total`.
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4183 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-43)

<a id="API-IAM-43-b"></a>
#### API-IAM-43-b · `POST /api/admin/iam/sod/exceptions`

- **Qué hace:** Excepciones. Da de alta un registro de excepciones aprobadas a SoD (`sodExceptions`).
- **Para qué sirve:** RF-IAM-091: SoD estática: catálogo de pares de capabilities incompatibles (sección 6, RN-IAM-040) que se controla al asignar roles; bloqueante o advertencia con excepción aprobada y control compensatorio (PA-IAM-04). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.sod.excepcionAprobar`.
- **Recibe:** los datos de excepciones aprobadas a SoD (`sodExceptions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de excepciones aprobadas a SoD (`sodExceptions`).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4183 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-43-b)

<a id="API-IAM-43-c"></a>
#### API-IAM-43-c · `POST /api/admin/iam/sod/exceptions/{id}/approve`

- **Qué hace:** Excepciones. Aprueba un registro de excepciones aprobadas a SoD (`sodExceptions`).
- **Para qué sirve:** RF-IAM-091: SoD estática: catálogo de pares de capabilities incompatibles (sección 6, RN-IAM-040) que se controla al asignar roles; bloqueante o advertencia con excepción aprobada y control compensatorio (PA-IAM-04). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.sod.excepcionAprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4183 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-43-c)

<a id="API-IAM-43-d"></a>
#### API-IAM-43-d · `POST /api/admin/iam/sod/exceptions/{id}/reject`

- **Qué hace:** Excepciones. Rechaza un registro de excepciones aprobadas a SoD (`sodExceptions`).
- **Para qué sirve:** RF-IAM-091: SoD estática: catálogo de pares de capabilities incompatibles (sección 6, RN-IAM-040) que se controla al asignar roles; bloqueante o advertencia con excepción aprobada y control compensatorio (PA-IAM-04). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.sod.excepcionAprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4183 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-43-d)

<a id="API-IAM-44"></a>
#### API-IAM-44 · `GET /api/admin/iam/sessions`

- **Qué hace:** Sesiones del tenant. Lista, con filtros y paginación, los registros de sesiones y refresh rotativo; TTL (`sessions`).
- **Para qué sirve:** RF-IAM-035: Sesión: access JWT de 15 minutos + refresh opaco de 30 días rotativo, guardado hasheado en sessions, con detección de reutilización (revoca la familia) y sessionEpoch para "cerrar sesión en todos los dispositivos". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.sesiones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de sesiones y refresh rotativo; TTL (`sessions`) con `total`.
- **Pantallas:** PAN-IAM-29 (Sesiones activas del tenant).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4184 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-44)

<a id="API-IAM-44-b"></a>
#### API-IAM-44-b · `GET /api/admin/iam/sessions/{id}`

- **Qué hace:** Sesiones del tenant. Obtiene el detalle de un registro de sesiones y refresh rotativo; TTL (`sessions`).
- **Para qué sirve:** RF-IAM-035: Sesión: access JWT de 15 minutos + refresh opaco de 30 días rotativo, guardado hasheado en sessions, con detección de reutilización (revoca la familia) y sessionEpoch para "cerrar sesión en todos los dispositivos". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.sesiones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de sesiones y refresh rotativo; TTL (`sessions`).
- **Pantallas:** PAN-IAM-29 (Sesiones activas del tenant).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4184 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-44-b)

<a id="API-IAM-44-c"></a>
#### API-IAM-44-c · `DELETE /api/admin/iam/sessions/{id}`

- **Qué hace:** Sesiones del tenant. Elimina o da de baja un registro de sesiones y refresh rotativo; TTL (`sessions`).
- **Para qué sirve:** RF-IAM-035: Sesión: access JWT de 15 minutos + refresh opaco de 30 días rotativo, guardado hasheado en sessions, con detección de reutilización (revoca la familia) y sessionEpoch para "cerrar sesión en todos los dispositivos". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.sesiones.ver`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-IAM-29 (Sesiones activas del tenant).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4184 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-44-c)

<a id="API-IAM-45"></a>
#### API-IAM-45 · `GET /api/admin/iam/policies`

- **Qué hace:** Políticas (vía T04) Consulta `policies`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.politicas.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-22 (Políticas del tenant).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4185 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-45)

<a id="API-IAM-45-b"></a>
#### API-IAM-45-b · `PUT /api/admin/iam/policies`

- **Qué hace:** Políticas (vía T04) Reemplaza o configura `policies`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.politicas.ver`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-22 (Políticas del tenant).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4185 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-45-b)

<a id="API-IAM-46"></a>
#### API-IAM-46 · `GET /api/admin/iam/identity-providers`

- **Qué hace:** SSO. Consulta `identity-providers`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.idp.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-23 (Proveedores de identidad (SSO)).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4186 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-46)

<a id="API-IAM-46-b"></a>
#### API-IAM-46-b · `POST /api/admin/iam/identity-providers`

- **Qué hace:** SSO. Registra un nuevo elemento u operación en `identity-providers`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.idp.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-23 (Proveedores de identidad (SSO)).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4186 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-46-b)

<a id="API-IAM-46-c"></a>
#### API-IAM-46-c · `GET /api/admin/iam/identity-providers/{id}`

- **Qué hace:** SSO. Obtiene el detalle de un registro de `identity-providers`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.idp.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-23 (Proveedores de identidad (SSO)).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4186 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-46-c)

<a id="API-IAM-46-d"></a>
#### API-IAM-46-d · `PATCH /api/admin/iam/identity-providers/{id}`

- **Qué hace:** SSO. Modifica algunos campos de un registro de `identity-providers` (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.idp.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-23 (Proveedores de identidad (SSO)).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4186 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-46-d)

<a id="API-IAM-46-e"></a>
#### API-IAM-46-e · `POST /api/admin/iam/identity-providers/{id}/test`

- **Qué hace:** SSO. Prueba un registro de `test`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.idp.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-23 (Proveedores de identidad (SSO)).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4186 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-46-e)

<a id="API-IAM-47"></a>
#### API-IAM-47 · `GET /api/admin/iam/api-clients`

- **Qué hace:** Clientes API. Lista, con filtros y paginación, los registros de clientes API de terceros (`apiClients`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.apiClientes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de clientes API de terceros (`apiClients`) con `total`.
- **Pantallas:** PAN-IAM-24 (Clientes API).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4187 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-47)

<a id="API-IAM-47-b"></a>
#### API-IAM-47-b · `POST /api/admin/iam/api-clients`

- **Qué hace:** Clientes API. Da de alta un registro de clientes API de terceros (`apiClients`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.apiClientes.gestionar`.
- **Recibe:** los datos de clientes API de terceros (`apiClients`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de clientes API de terceros (`apiClients`).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4187 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-47-b)

<a id="API-IAM-47-c"></a>
#### API-IAM-47-c · `GET /api/admin/iam/api-clients/{id}`

- **Qué hace:** Clientes API. Obtiene el detalle de un registro de clientes API de terceros (`apiClients`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.apiClientes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de clientes API de terceros (`apiClients`).
- **Pantallas:** PAN-IAM-24 (Clientes API).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4187 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-47-c)

<a id="API-IAM-47-d"></a>
#### API-IAM-47-d · `POST /api/admin/iam/api-clients/{id}/rotate`

- **Qué hace:** Clientes API. Rota las credenciales de un registro de clientes API de terceros (`apiClients`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.apiClientes.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4187 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-47-d)

<a id="API-IAM-47-e"></a>
#### API-IAM-47-e · `POST /api/admin/iam/api-clients/{id}/revoke`

- **Qué hace:** Clientes API. Revoca un registro de clientes API de terceros (`apiClients`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.apiClientes.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4187 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-47-e)

<a id="API-IAM-48"></a>
#### API-IAM-48 · `POST /api/v1/ext/oauth/token`

- **Qué hace:** Token técnico. Emite un token para sobre tokens de acción; TTL (`actionTokens`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «public: true».
- **Recibe:** los datos de tokens de acción; TTL (`actionTokens`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de tokens de acción; TTL (`actionTokens`).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4188 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-48)

<a id="API-IAM-51"></a>
#### API-IAM-51 · `GET /api/admin/iam/authorizations`

- **Qué hace:** Bandeja. Lista, con filtros y paginación, los registros de `authorizations`.
- **Para qué sirve:** RF-IAM-093: Autorización diferida: la solicitud queda en la bandeja de supervisores con capability y alcance suficientes; al aprobarse, el solicitante la consume dentro de su vigencia o se ejecuta automáticamente si la acción lo permite. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.autorizaciones.bandeja`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-IAM-15 (Autorizaciones pendientes).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4191 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-51)

<a id="API-IAM-49"></a>
#### API-IAM-49 · `POST /api/admin/iam/authorizations`

- **Qué hace:** Crear solicitud inline/diferida. Registra un nuevo elemento u operación en `authorizations`.
- **Para qué sirve:** RF-IAM-093: Autorización diferida: la solicitud queda en la bandeja de supervisores con capability y alcance suficientes; al aprobarse, el solicitante la consume dentro de su vigencia o se ejecuta automáticamente si la acción lo permite. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.autorizaciones.solicitar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4189 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-49)

<a id="API-IAM-50"></a>
#### API-IAM-50 · `POST /api/admin/iam/authorizations/{id}/approve-inline`

- **Qué hace:** Aprobación con supervisor presente. Registra «approve-inline» sobre un registro de `approve-inline`.
- **Para qué sirve:** RF-IAM-093: Autorización diferida: la solicitud queda en la bandeja de supervisores con capability y alcance suficientes; al aprobarse, el solicitante la consume dentro de su vigencia o se ejecuta automáticamente si la acción lo permite. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.autorizaciones.solicitar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4190 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-50)

<a id="API-IAM-52"></a>
#### API-IAM-52 · `POST /api/admin/iam/authorizations/{id}/approve`

- **Qué hace:** Decidir. Aprueba un registro de `approve`.
- **Para qué sirve:** RF-IAM-093: Autorización diferida: la solicitud queda en la bandeja de supervisores con capability y alcance suficientes; al aprobarse, el solicitante la consume dentro de su vigencia o se ejecuta automáticamente si la acción lo permite. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.autorizaciones.bandeja`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-15 (Autorizaciones pendientes).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4192 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-52)

<a id="API-IAM-52-b"></a>
#### API-IAM-52-b · `POST /api/admin/iam/authorizations/{id}/reject`

- **Qué hace:** Decidir. Rechaza un registro de `reject`.
- **Para qué sirve:** RF-IAM-093: Autorización diferida: la solicitud queda en la bandeja de supervisores con capability y alcance suficientes; al aprobarse, el solicitante la consume dentro de su vigencia o se ejecuta automáticamente si la acción lo permite. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.autorizaciones.bandeja`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-15 (Autorizaciones pendientes).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4192 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-52-b)

<a id="API-IAM-52-c"></a>
#### API-IAM-52-c · `POST /api/admin/iam/authorizations/{id}/cancel`

- **Qué hace:** Decidir. Cancela un registro de `cancel`.
- **Para qué sirve:** RF-IAM-093: Autorización diferida: la solicitud queda en la bandeja de supervisores con capability y alcance suficientes; al aprobarse, el solicitante la consume dentro de su vigencia o se ejecuta automáticamente si la acción lo permite. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.autorizaciones.bandeja`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-15 (Autorizaciones pendientes).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4192 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-52-c)

<a id="API-IAM-53"></a>
#### API-IAM-53 · `GET /api/admin/audit/changes`

- **Qué hace:** Consultar cambios. Consulta `changes`.
- **Para qué sirve:** RF-IAM-143: Auditoría de plataforma: acciones de usuarios de plataforma, cambios de licencias y roles plantilla, accesos de soporte; el tenant ve las que lo afectan. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.auditoria.cambios.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-17 (Auditoría de cambios).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4193 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-53)

<a id="API-IAM-54"></a>
#### API-IAM-54 · `GET /api/admin/audit/changes/entity/{collection}/{id}`

- **Qué hace:** Historial de un objeto. Obtiene el detalle de un registro de `entity`.
- **Para qué sirve:** RF-IAM-138: Consulta y exportación de auditoría sujetas a permiso, con filtros por objeto, actor, fecha, operación, módulo, resultado y correlación; vista "historial" embebida en cada ficha. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.auditoria.cambios.ver`.
- **Recibe:** en la ruta `collection`, `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-17 (Auditoría de cambios).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4194 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-54)

<a id="API-IAM-55"></a>
#### API-IAM-55 · `GET /api/admin/audit/access`

- **Qué hace:** Accesos. Lista, con filtros y paginación, los registros de auditoría de accesos y operaciones cruzadas (`auditAccess`).
- **Para qué sirve:** RF-IAM-046: La hora de toda operación la fija el servidor (UTC); no se acepta hora del cliente para auditoría ni sesiones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.auditoria.accesos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de auditoría de accesos y operaciones cruzadas (`auditAccess`) con `total`.
- **Pantallas:** PAN-IAM-18 (Auditoría de accesos).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4195 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-55)

<a id="API-IAM-56"></a>
#### API-IAM-56 · `GET /api/admin/audit/reads`

- **Qué hace:** Lecturas y exportaciones. Lista, con filtros y paginación, los registros de lecturas de datos sensibles (`auditReads`).
- **Para qué sirve:** RF-IAM-135: Auditoría de lecturas sensibles: consulta de datos sensibles, visualización de informes, exportaciones (con conteo de filas y archivo firmado), descargas masivas y búsquedas amplias de personas (PA-IAM-07). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.auditoria.lecturas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de lecturas de datos sensibles (`auditReads`) con `total`.
- **Pantallas:** PAN-IAM-19 (Auditoría de lecturas sensibles y exportaciones).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4196 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-56)

<a id="API-IAM-57"></a>
#### API-IAM-57 · `GET /api/admin/audit/messages`

- **Qué hace:** Mensajes. Lista, con filtros y paginación, los registros de auditoría de mensajes enviados (`auditMessages`).
- **Para qué sirve:** RF-IAM-136: Auditoría de mensajes: cada mail, SMS, WhatsApp y push con destinatario (enmascarado + hash), asunto, plantilla, objeto relacionado, disparador, estado y respuesta del proveedor; el contenido se conserva en T09 según retención. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.auditoria.mensajes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de auditoría de mensajes enviados (`auditMessages`) con `total`.
- **Pantallas:** PAN-IAM-20 (Auditoría de mensajes).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4197 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-57)

<a id="API-IAM-58"></a>
#### API-IAM-58 · `GET /api/admin/audit/ai`

- **Qué hace:** IA. Consulta `ai`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.auditoria.ia.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-21 (Auditoría de invocaciones de IA).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4198 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-58)

<a id="API-IAM-59"></a>
#### API-IAM-59 · `POST /api/admin/audit/export`

- **Qué hace:** Exportación (job) Exporta sobre `export`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-IAM-138: Consulta y exportación de auditoría sujetas a permiso, con filtros por objeto, actor, fecha, operación, módulo, resultado y correlación; vista "historial" embebida en cada ficha. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.auditoria.exportar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4199 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-59)

<a id="API-IAM-60"></a>
#### API-IAM-60 · `POST /api/admin/audit/ai/{eventId}/decision`

- **Qué hace:** Registrar decisión humana. Registra la decisión sobre un registro de `decision`.
- **Para qué sirve:** RF-IAM-137: Auditoría de IA: función, proveedor, modelo y versión, plantilla de prompt y versión, referencias de entrada minimizadas, salida o referencia, tokens, costo, latencia, confianza, señales de seguridad (p. ej., inyección detectada)… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.ia.decisiones.registrar`.
- **Recibe:** en la ruta `eventId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4200 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-60)

<a id="API-IAM-61"></a>
#### API-IAM-61 · `GET /api/admin/audit/integrity`

- **Qué hace:** Verificación de cadena. Consulta `integrity`.
- **Para qué sirve:** RF-IAM-142: Alertas de seguridad: ráfagas de fallos, reutilización de refresh, login desde país inusual, acceso de emergencia, desactivación de MFA, exportaciones masivas, fallos de cadena de auditoría; dirigidas a P-SEC y T-ADM. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.auditoria.cambios.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-17 (Auditoría de cambios).
- **Ola:** O0 · **Fuente:** T02 §11. API, línea 4201 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-61)

<a id="API-IAM-62"></a>
#### API-IAM-62 · `PUT /api/admin/iam/presence`

- **Qué hace:** Presencia de edición. Reemplaza o configura presencia de edición concurrente; TTL (`editPresence`).
- **Para qué sirve:** RF-IAM-140: Aviso de edición concurrente ("Juan está editando esta ficha") con presencia de TTL 120 s; no bloquea. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.sesion.autenticada`.
- **Recibe:** los datos de presencia de edición concurrente; TTL (`editPresence`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de presencia de edición concurrente; TTL (`editPresence`).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4202 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-62)

<a id="API-IAM-62-b"></a>
#### API-IAM-62-b · `DELETE /api/admin/iam/presence`

- **Qué hace:** Presencia de edición. Elimina o da de baja un registro de presencia de edición concurrente; TTL (`editPresence`).
- **Para qué sirve:** RF-IAM-140: Aviso de edición concurrente ("Juan está editando esta ficha") con presencia de TTL 120 s; no bloquea. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.sesion.autenticada`.
- **Recibe:** cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4202 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-62-b)

<a id="API-IAM-63"></a>
#### API-IAM-63 · `GET /api/admin/iam/portal-users`

- **Qué hace:** Accesos al portal. Consulta `portal-users`.
- **Para qué sirve:** RF-IAM-077: Baja de empleado (offboarding): al finalizar la relación laboral (evento de M16) o por baja manual, se revocan pertenencia staff, sesiones, dispositivos confiables, credenciales API de las que sea responsable (se reasignan) y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.portal.usuarios.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-25 (Accesos al portal).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4203 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-63)

<a id="API-IAM-63-b"></a>
#### API-IAM-63-b · `POST /api/admin/iam/portal-users`

- **Qué hace:** Accesos al portal. Registra un nuevo elemento u operación en `portal-users`.
- **Para qué sirve:** RF-IAM-077: Baja de empleado (offboarding): al finalizar la relación laboral (evento de M16) o por baja manual, se revocan pertenencia staff, sesiones, dispositivos confiables, credenciales API de las que sea responsable (se reasignan) y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.portal.usuarios.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4203 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-63-b)

<a id="API-IAM-63-c"></a>
#### API-IAM-63-c · `POST /api/admin/iam/portal-users/{membershipId}/block`

- **Qué hace:** Accesos al portal. Bloquea un registro de `block`.
- **Para qué sirve:** RF-IAM-077: Baja de empleado (offboarding): al finalizar la relación laboral (evento de M16) o por baja manual, se revocan pertenencia staff, sesiones, dispositivos confiables, credenciales API de las que sea responsable (se reasignan) y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.portal.usuarios.gestionar`.
- **Recibe:** en la ruta `membershipId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4203 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-63-c)

<a id="API-IAM-63-d"></a>
#### API-IAM-63-d · `POST /api/admin/iam/portal-users/{membershipId}/unblock`

- **Qué hace:** Accesos al portal. Desbloquea un registro de `unblock`.
- **Para qué sirve:** RF-IAM-077: Baja de empleado (offboarding): al finalizar la relación laboral (evento de M16) o por baja manual, se revocan pertenencia staff, sesiones, dispositivos confiables, credenciales API de las que sea responsable (se reasignan) y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.portal.usuarios.gestionar`.
- **Recibe:** en la ruta `membershipId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4203 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-63-d)

<a id="API-IAM-63-e"></a>
#### API-IAM-63-e · `POST /api/admin/iam/portal-users/{membershipId}/resend`

- **Qué hace:** Accesos al portal. Reenvía un registro de `resend`.
- **Para qué sirve:** RF-IAM-077: Baja de empleado (offboarding): al finalizar la relación laboral (evento de M16) o por baja manual, se revocan pertenencia staff, sesiones, dispositivos confiables, credenciales API de las que sea responsable (se reasignan) y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.portal.usuarios.gestionar`.
- **Recibe:** en la ruta `membershipId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4203 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-63-e)

<a id="API-IAM-63-f"></a>
#### API-IAM-63-f · `POST /api/admin/iam/portal-users/{membershipId}/unlink`

- **Qué hace:** Accesos al portal. Desvincula un registro de `unlink`.
- **Para qué sirve:** RF-IAM-077: Baja de empleado (offboarding): al finalizar la relación laboral (evento de M16) o por baja manual, se revocan pertenencia staff, sesiones, dispositivos confiables, credenciales API de las que sea responsable (se reasignan) y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.portal.usuarios.gestionar`.
- **Recibe:** en la ruta `membershipId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4203 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-63-f)

<a id="API-IAM-64"></a>
#### API-IAM-64 · `GET /api/admin/iam/support-access`

- **Qué hace:** Soporte (lado tenant) Consulta `support-access`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.soporte.actuaciones.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-27 (Accesos de soporte de plataforma).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4204 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-64)

<a id="API-IAM-64-b"></a>
#### API-IAM-64-b · `POST /api/admin/iam/support-access`

- **Qué hace:** Soporte (lado tenant) Registra un nuevo elemento u operación en `support-access`.
- **Para qué sirve:** RF-IAM-112: Acceso de soporte temporal: solicitud con ticket, modo (observar/operar), capabilities y alcance mínimos, justificación, aprobación del T-ADM (o emergencia por P-SUP con aviso inmediato), vencimiento (máx. PRM-IAM-070 horas)… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `pla.soporte.accesos.aprobar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4204 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-64-b)

<a id="API-IAM-64-c"></a>
#### API-IAM-64-c · `POST /api/admin/iam/support-access/{id}/approve`

- **Qué hace:** Soporte (lado tenant) Aprueba un registro de `approve`.
- **Para qué sirve:** RF-IAM-112: Acceso de soporte temporal: solicitud con ticket, modo (observar/operar), capabilities y alcance mínimos, justificación, aprobación del T-ADM (o emergencia por P-SUP con aviso inmediato), vencimiento (máx. PRM-IAM-070 horas)… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `pla.soporte.accesos.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4204 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-64-c)

<a id="API-IAM-64-d"></a>
#### API-IAM-64-d · `POST /api/admin/iam/support-access/{id}/reject`

- **Qué hace:** Soporte (lado tenant) Rechaza un registro de `reject`.
- **Para qué sirve:** RF-IAM-112: Acceso de soporte temporal: solicitud con ticket, modo (observar/operar), capabilities y alcance mínimos, justificación, aprobación del T-ADM (o emergencia por P-SUP con aviso inmediato), vencimiento (máx. PRM-IAM-070 horas)… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `pla.soporte.accesos.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4204 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-64-d)

<a id="API-IAM-64-e"></a>
#### API-IAM-64-e · `POST /api/admin/iam/support-access/{id}/revoke`

- **Qué hace:** Soporte (lado tenant) Revoca un registro de `revoke`.
- **Para qué sirve:** RF-IAM-112: Acceso de soporte temporal: solicitud con ticket, modo (observar/operar), capabilities y alcance mínimos, justificación, aprobación del T-ADM (o emergencia por P-SUP con aviso inmediato), vencimiento (máx. PRM-IAM-070 horas)… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `pla.soporte.accesos.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4204 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-64-e)

<a id="API-IAM-65"></a>
#### API-IAM-65 · `POST /api/platform/support-access`

- **Qué hace:** Soporte (lado plataforma) Registra un nuevo elemento u operación en `support-access`.
- **Para qué sirve:** RF-IAM-143: Auditoría de plataforma: acciones de usuarios de plataforma, cambios de licencias y roles plantilla, accesos de soporte; el tenant ve las que lo afectan. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.soporte.accesos.solicitar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4205 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-65)

<a id="API-IAM-65-b"></a>
#### API-IAM-65-b · `POST /api/platform/support-access/{id}/start`

- **Qué hace:** Soporte (lado plataforma) Inicia un registro de `start`.
- **Para qué sirve:** RF-IAM-143: Auditoría de plataforma: acciones de usuarios de plataforma, cambios de licencias y roles plantilla, accesos de soporte; el tenant ve las que lo afectan. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.soporte.accesos.solicitar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4205 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-65-b)

<a id="API-IAM-65-c"></a>
#### API-IAM-65-c · `POST /api/platform/support-access/{id}/end`

- **Qué hace:** Soporte (lado plataforma) Registra «end» sobre un registro de `end`.
- **Para qué sirve:** RF-IAM-143: Auditoría de plataforma: acciones de usuarios de plataforma, cambios de licencias y roles plantilla, accesos de soporte; el tenant ve las que lo afectan. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.soporte.accesos.solicitar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4205 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-65-c)

<a id="API-IAM-66"></a>
#### API-IAM-66 · `GET /api/platform/iam/users`

- **Qué hace:** Plataforma. Consulta `users`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `iam.plataforma.usuarios.gestionar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-26 (Usuarios y roles de plataforma).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4206 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-66)

<a id="API-IAM-66-b"></a>
#### API-IAM-66-b · `POST /api/platform/iam/users`

- **Qué hace:** Plataforma. Registra un nuevo elemento u operación en `users`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `iam.plataforma.usuarios.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-26 (Usuarios y roles de plataforma).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4206 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-66-b)

<a id="API-IAM-66-c"></a>
#### API-IAM-66-c · `PATCH /api/platform/iam/users`

- **Qué hace:** Plataforma. Modifica algunos campos de un registro de `users` (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `iam.plataforma.usuarios.gestionar`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-26 (Usuarios y roles de plataforma).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4206 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-66-c)

<a id="API-IAM-66-d"></a>
#### API-IAM-66-d · `GET /api/platform/iam/role-templates`

- **Qué hace:** Plataforma. Consulta `role-templates`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `iam.plataforma.usuarios.gestionar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-26 (Usuarios y roles de plataforma).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4206 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-66-d)

<a id="API-IAM-66-e"></a>
#### API-IAM-66-e · `POST /api/platform/iam/role-templates`

- **Qué hace:** Plataforma. Registra un nuevo elemento u operación en `role-templates`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `iam.plataforma.usuarios.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-26 (Usuarios y roles de plataforma).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4206 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-66-e)

<a id="API-IAM-66-f"></a>
#### API-IAM-66-f · `PATCH /api/platform/iam/role-templates`

- **Qué hace:** Plataforma. Modifica algunos campos de un registro de `role-templates` (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `iam.plataforma.usuarios.gestionar`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-IAM-26 (Usuarios y roles de plataforma).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4206 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-66-f)

<a id="API-IAM-67"></a>
#### API-IAM-67 · `GET /api/platform/security/alerts`

- **Qué hace:** Alertas. Lista, con filtros y paginación, los registros de alertas de seguridad de identidad (`securityAlerts`).
- **Para qué sirve:** RF-IAM-142: Alertas de seguridad: ráfagas de fallos, reutilización de refresh, login desde país inusual, acceso de emergencia, desactivación de MFA, exportaciones masivas, fallos de cadena de auditoría; dirigidas a P-SEC y T-ADM. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `iam.plataforma.alertas.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de alertas de seguridad de identidad (`securityAlerts`) con `total`.
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4207 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-67)

<a id="API-IAM-67-b"></a>
#### API-IAM-67-b · `GET /api/platform/security/alerts/{id}`

- **Qué hace:** Alertas. Obtiene el detalle de un registro de alertas de seguridad de identidad (`securityAlerts`).
- **Para qué sirve:** RF-IAM-142: Alertas de seguridad: ráfagas de fallos, reutilización de refresh, login desde país inusual, acceso de emergencia, desactivación de MFA, exportaciones masivas, fallos de cadena de auditoría; dirigidas a P-SEC y T-ADM. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `iam.plataforma.alertas.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de alertas de seguridad de identidad (`securityAlerts`).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4207 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-67-b)

<a id="API-IAM-67-c"></a>
#### API-IAM-67-c · `PATCH /api/platform/security/alerts/{id}`

- **Qué hace:** Alertas. Modifica algunos campos de un registro de alertas de seguridad de identidad (`securityAlerts`) (solo los enviados).
- **Para qué sirve:** RF-IAM-142: Alertas de seguridad: ráfagas de fallos, reutilización de refresh, login desde país inusual, acceso de emergencia, desactivación de MFA, exportaciones masivas, fallos de cadena de auditoría; dirigidas a P-SEC y T-ADM. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `iam.plataforma.alertas.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de alertas de seguridad de identidad (`securityAlerts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de alertas de seguridad de identidad (`securityAlerts`).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4207 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-67-c)

<a id="API-IAM-68"></a>
#### API-IAM-68 · `GET /api/admin/iam/access-reviews`

- **Qué hace:** Recertificación. Lista, con filtros y paginación, los registros de recertificación de accesos (`accessReviews`).
- **Para qué sirve:** RF-IAM-075: Recertificación periódica de accesos: cada PRM-IAM-061 meses el T-ADM/T-GER confirma o retira asignaciones con capabilities S (PA-IAM-16). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.recertificacion.ejecutar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de recertificación de accesos (`accessReviews`) con `total`.
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4208 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-68)

<a id="API-IAM-68-b"></a>
#### API-IAM-68-b · `POST /api/admin/iam/access-reviews`

- **Qué hace:** Recertificación. Da de alta un registro de recertificación de accesos (`accessReviews`).
- **Para qué sirve:** RF-IAM-075: Recertificación periódica de accesos: cada PRM-IAM-061 meses el T-ADM/T-GER confirma o retira asignaciones con capabilities S (PA-IAM-16). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.recertificacion.ejecutar`.
- **Recibe:** los datos de recertificación de accesos (`accessReviews`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de recertificación de accesos (`accessReviews`).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4208 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-68-b)

<a id="API-IAM-68-c"></a>
#### API-IAM-68-c · `POST /api/admin/iam/access-reviews/{id}/decisions`

- **Qué hace:** Recertificación. Registra «decisions» sobre un registro de recertificación de accesos (`accessReviews`).
- **Para qué sirve:** RF-IAM-075: Recertificación periódica de accesos: cada PRM-IAM-061 meses el T-ADM/T-GER confirma o retira asignaciones con capabilities S (PA-IAM-16). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.recertificacion.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T02 §11. API, línea 4208 · [Ver en Swagger](../18-swagger/index.html?api=t02-iam#/API/API-IAM-68-c)
