# Contratos de API - detalle de inconsistencias

Detalle generado por `_trabajo/gen_openapi.py`; el resumen está en `../18-contratos-api.md`. La especificación no se modificó.

## Operaciones repetidas entre filas API

Misma combinación de método y ruta en dos filas; se conserva la primera y la segunda queda en `x-api-ids-adicionales`.

| API-ID | Anexo | Línea | Detalle |
|---|---|---|---|

## Parámetros de ruta con nombres distintos

| API-ID | Anexo | Línea | Detalle |
|---|---|---|---|

## Rutas no interpretables o con servicios en la celda de ruta

| API-ID | Anexo | Línea | Detalle |
|---|---|---|---|

## Filas API de referencia o reemplazadas (sin operación propia)

No generan operaciones: la operación vive en el destino (referencia) o la fila no se expone (reemplazo).

| API-ID | Anexo | Línea | Estado | Destino | Rutas de la celda |
|---|---|---|---|---|---|
| API-PER-38 | M01 | 1519 | reemplazado | API-SOC-001, API-SOC-002, API-SOC-005 | `GET /api/admin/per/adherents`; `POST /api/admin/per/adherents`; `GET /api/admin/per/adherents/{adherentId}`; `PATCH /api/admin/per/adherents/{adherentId}` |
| API-PER-39 | M01 | 1520 | reemplazado | API-SOC-003 | `POST /api/admin/per/adherents/{adherentId}/close` |
| API-PER-40 | M01 | 1521 | reemplazado | API-SOC-004 | `POST /api/admin/per/adherents/condition/simulate`; `POST /api/admin/per/adherents/condition/execute` |
| API-CAT-40 | M02 | 1499 | reemplazado | API-SOC-001, API-SOC-002, API-SOC-003, API-SOC-004, API-SOC-005 | `GET /api/admin/cat/contracts/{id}/members`; `POST /api/admin/cat/contracts/{id}/members`; `PATCH /api/admin/cat/contracts/{id}/members` |
| API-MED-66 | M03 | 1633 | reemplazado | API-TAR-030 | `GET /api/admin/med/gas-factors`; `POST /api/admin/med/gas-factors`; `GET /api/admin/med/gas-factors/{id}`; `PATCH /api/admin/med/gas-factors/{id}` |
| API-FAC-023 | M05 | 1776 | reemplazado | API-MOR-25 | `GET /api/admin/fac/hold-reasons`; `POST /api/admin/fac/hold-reasons`; `GET /api/admin/fac/hold-reasons/{id}`; `PATCH /api/admin/fac/hold-reasons/{id}` |
| API-VEN-006 | M11 | 976 | reemplazado | API-FAC-105 | `GET /api/admin/ven/billing-items` |
| API-VEN-007 | M11 | 977 | reemplazado | API-FAC-044 | `POST /api/admin/ven/billing-items/lock` |
| API-SUE-01 | M16 | 2083 | reemplazado | API-CFG-55 | `GET /api/admin/sue/employers` |
| API-SUE-02 | M16 | 2084 | reemplazado | API-CFG-55 | `POST /api/admin/sue/employers`; `PATCH /api/admin/sue/employers/{id}` |
| API-PLA-64 | T01 | 1940 | referencia | API-POR-01 | `GET /api/public/{tenantSlug}/bootstrap` |
| API-UXD-01 | T03 | 2845 | referencia | API-POR-01 | `GET /api/public/{tenantSlug}/bootstrap` |
| API-CFG-54 | T04 | 1579 | reemplazado | API-WFL-71, API-WFL-72, API-WFL-73 | `GET /api/admin/cfg/sequences`; `POST /api/admin/cfg/sequences` |
| API-CFG-58 | T04 | 1583 | reemplazado | legalEntities.resolve({ branchId, serviceId, at }) | `GET /api/internal/cfg/legal-entities/resolve` |

## Destinos de referencia o reemplazo con problemas

| API-ID | Anexo | Línea | Detalle |
|---|---|---|---|

## Rutas de M01 a M06 con segmentos en español

| API-ID | Anexo | Línea | Ruta | Segmentos |
|---|---|---|---|---|

## Capabilities usadas en API y ausentes del catálogo de T02 §4.4

No figuran como canónicas en T02 §4.4 ni §4.4.2, ni como alias (§4.4.1) ni como nombre no registrado (§4.4.3).

| Capability | Filas API |
|---|---|

## Capabilities usadas por su alias (T02 §4.4.1)

| Alias usado | Canónica | Filas API |
|---|---|---|

## Nombres no registrados usados en API (T02 §4.4.3)

| Nombre usado | Canónica propuesta | Filas API |
|---|---|---|
| `fis.*.ver` | `fis.reportes.exportar` | API-FIS-80 |

## Filas API sin capability con formato de T02

La celda indica un rol, una regla de acceso o texto libre en lugar de una capability.

| API-ID | Valor en la celda |
|---|---|
