# Catálogo de eventos - listado de canales

Una fila por tipo de evento (canal). Generado por `_trabajo/gen_asyncapi.py` desde T11 §12.2 y §12.3. Índice general en `../19-catalogo-eventos.md`.

| EVT-ID | Canal (tipo canónico) | Productor | Archivo | Estado | Consumidores |
|---|---|---|---|---|---|
| EVT-WFL-001 | `wfl.operation.submitted` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | M01, M02, M03, M04, M05, M06, M07, M08, M09, M10, M11, M12, M13, M14, M15, M16, M17, M18, T01, T02, T04, T07, T09, T10 |
| EVT-WFL-002 | `wfl.operation.approved` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | M01, M02, M03, M04, M05, M06, M07, M08, M09, M10, M11, M12, M13, M14, M15, M16, M17, M18, T01, T02, T04, T07, T09, T10 |
| EVT-WFL-002 | `wfl.operation.rejected` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | M01, M02, M03, M04, M05, M06, M07, M08, M09, M10, M11, M12, M13, M14, M15, M16, M17, M18, T01, T02, T04, T07, T09, T10 |
| EVT-WFL-002 | `wfl.operation.expired` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | M01, M02, M03, M04, M05, M06, M07, M08, M09, M10, M11, M12, M13, M14, M15, M16, M17, M18, T01, T02, T04, T07, T09, T10 |
| EVT-WFL-002 | `wfl.operation.cancelled` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | M01, M02, M03, M04, M05, M06, M07, M08, M09, M10, M11, M12, M13, M14, M15, M16, M17, M18, T01, T02, T04, T07, T09, T10 |
| EVT-WFL-003 | `wfl.operation.executionStarted` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | T10 |
| EVT-WFL-004 | `wfl.operation.completed` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | M01, M02, M03, M04, M05, M06, M07, M08, M09, M10, M11, M12, M13, M14, M15, M16, M17, M18, T01, T02, T04, T07, T09, T10, T11 |
| EVT-WFL-005 | `wfl.operation.failed` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | T11, T09, T10 |
| EVT-WFL-005 | `wfl.operation.uncertain` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | T11, T09, T10 |
| EVT-WFL-005 | `wfl.operation.compensated` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | T11, T09, T10 |
| EVT-WFL-006 | `wfl.operation.reconciled` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | M01, M02, M03, M04, M05, M06, M07, M08, M09, M10, M11, M12, M13, M14, M15, M16, M17, M18, T01, T02, T04, T07, T10 |
| EVT-WFL-007 | `wfl.approval.requested` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | T11, T10 |
| EVT-WFL-008 | `wfl.approval.stepAssigned` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | T09, T11 |
| EVT-WFL-009 | `wfl.approval.stepDecided` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | T09, T10 |
| EVT-WFL-010 | `wfl.approval.decided` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | M03, M09, M11, M12, M16, M17, M18, M02, M04, M05, M07, M08, M10, M13, M14, M15, T04, T09, T10 |
| EVT-WFL-011 | `wfl.approval.escalated` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | T09, T10 |
| EVT-WFL-012 | `wfl.approval.expired` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | M02, M03, M04, M05, M07, M08, M09, M10, M11, M12, M13, M14, M15, M16, M17, M18, T04, T09, T10 |
| EVT-WFL-012 | `wfl.approval.withdrawn` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | M02, M03, M04, M05, M07, M08, M09, M10, M11, M12, M13, M14, M15, M16, M17, M18, T04, T09, T10 |
| EVT-WFL-012 | `wfl.approval.invalidated` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | M02, M03, M04, M05, M07, M08, M09, M10, M11, M12, M13, M14, M15, M16, M17, M18, T04, T09, T10 |
| EVT-WFL-013 | `wfl.delegation.activated` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | T09, T02, T11 |
| EVT-WFL-013 | `wfl.delegation.ended` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | T09, T02, T11 |
| EVT-WFL-013 | `wfl.delegation.revoked` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | T09, T02, T11 |
| EVT-WFL-014 | `wfl.instance.started` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | M01, M02, M04, M07, M08, M09, M10, M16, M17, M18, T04, T08, T09, M19, T10 |
| EVT-WFL-015 | `wfl.instance.transitioned` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | M19, T09, T10 |
| EVT-WFL-016 | `wfl.instance.completed` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | T04, M01, M02, M04, M07, M08, M09, M10, M16, M17, M18, T08, T09, M19, T10 |
| EVT-WFL-017 | `wfl.instance.cancelled` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | M01, M02, M04, M07, M08, M09, M10, M16, M17, M18, T04, T08, T09, M19 |
| EVT-WFL-017 | `wfl.instance.suspended` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | M01, M02, M04, M07, M08, M09, M10, M16, M17, M18, T04, T08, T09, M19 |
| EVT-WFL-017 | `wfl.instance.resumed` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | M01, M02, M04, M07, M08, M09, M10, M16, M17, M18, T04, T08, T09, M19 |
| EVT-WFL-018 | `wfl.definition.published` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | M19, T10 |
| EVT-WFL-018 | `wfl.definition.retired` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | M19, T10 |
| EVT-WFL-019 | `wfl.form.submitted` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | M01, M02, M04, M07, M08, M09, M10, M16, M17, M18, T04, T08, T09, T10 |
| EVT-WFL-020 | `wfl.sla.warning` | T11 | [t11-wfl-p1.yaml](t11-wfl-p1.yaml) | vigente | T09, T11 |
| EVT-WFL-021 | `wfl.sla.breached` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | T09, T10, T11 |
| EVT-WFL-022 | `wfl.sla.escalated` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | T09, T10 |
| EVT-WFL-023 | `wfl.task.created` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | T09, T11 |
| EVT-WFL-024 | `wfl.task.assigned` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | T09, T11 |
| EVT-WFL-024 | `wfl.task.reassigned` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | T09, T11 |
| EVT-WFL-024 | `wfl.task.claimed` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | T09, T11 |
| EVT-WFL-024 | `wfl.task.released` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | T09, T11 |
| EVT-WFL-025 | `wfl.task.completed` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | M08, T11, T10 |
| EVT-WFL-025 | `wfl.task.cancelled` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | M08, T11, T10 |
| EVT-WFL-025 | `wfl.task.reopened` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | M08, T11, T10 |
| EVT-WFL-026 | `wfl.task.overdue` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | T09, T10, T11 |
| EVT-WFL-027 | `wfl.workItem.orphaned` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | T09, T02 |
| EVT-WFL-027 | `wfl.workItem.reassigned` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | T09, T02 |
| EVT-WFL-028 | `wfl.document.added` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | M01, M02, M05, M07, M09, M10, M12, M16, M17, M18, T10, T11 |
| EVT-WFL-028 | `wfl.document.versionAdded` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | M01, M02, M05, M07, M09, M10, M12, M16, M17, M18, T10, T11 |
| EVT-WFL-029 | `wfl.document.versionAccepted` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | M02, M08, M10, M12, M14, M16, M17 |
| EVT-WFL-030 | `wfl.document.classified` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | T10 |
| EVT-WFL-030 | `wfl.document.sensitivityChanged` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | T10 |
| EVT-WFL-031 | `wfl.document.voided` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | M01, M02, M05, M07, M09, M10, M12, M16, M17, M18, M19 |
| EVT-WFL-031 | `wfl.document.restored` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | M01, M02, M05, M07, M09, M10, M12, M16, M17, M18, M19 |
| EVT-WFL-032 | `wfl.document.retentionExpired` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | T10, T02 |
| EVT-WFL-032 | `wfl.document.purged` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | T10, T02 |
| EVT-WFL-033 | `wfl.document.expired` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | M01, M12, M16, M18, T09 |
| EVT-WFL-033 | `wfl.document.expiring` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | M01, M12, M16, M18, T09 |
| EVT-WFL-034 | `wfl.shareLink.created` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | T02, T10 |
| EVT-WFL-034 | `wfl.shareLink.revoked` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | T02, T10 |
| EVT-WFL-034 | `wfl.shareLink.accessed` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | T02, T10 |
| EVT-WFL-035 | `wfl.legalHold.applied` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | T02, T10 |
| EVT-WFL-035 | `wfl.legalHold.released` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | T02, T10 |
| EVT-WFL-036 | `wfl.template.published` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | M02, M05, M06, M07, M08, M09, M10, M11, M12, M13, M16, M17, M18, T10 |
| EVT-WFL-036 | `wfl.template.retired` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | M02, M05, M06, M07, M08, M09, M10, M11, M12, M13, M16, M17, M18, T10 |
| EVT-WFL-037 | `wfl.render.completed` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | M02, M05, M06, M07, M08, M09, M10, M11, M12, M13, M16, M17, M18 |
| EVT-WFL-038 | `wfl.render.failed` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | M02, M05, M06, M07, M08, M09, M10, M11, M12, M13, M16, M17, M18, T11 |
| EVT-WFL-039 | `wfl.number.voided` | T11 | [t11-wfl-p2.yaml](t11-wfl-p2.yaml) | vigente | M09, M17, M05, M06, T10 |
| EVT-WFL-040 | `wfl.sequence.thresholdReached` | T11 | [t11-wfl-p3.yaml](t11-wfl-p3.yaml) | vigente | T09, M05, M06 |
| EVT-WFL-040 | `wfl.sequence.adjusted` | T11 | [t11-wfl-p3.yaml](t11-wfl-p3.yaml) | vigente | T09, M05, M06 |
| EVT-WFL-041 | `wfl.signature.requested` | T11 | [t11-wfl-p3.yaml](t11-wfl-p3.yaml) | vigente | T09, T11, M16 |
| EVT-WFL-041 | `wfl.signature.participantSigned` | T11 | [t11-wfl-p3.yaml](t11-wfl-p3.yaml) | vigente | T09, T11, M16 |
| EVT-WFL-042 | `wfl.signature.completed` | T11 | [t11-wfl-p3.yaml](t11-wfl-p3.yaml) | vigente | M16, M10, M14, M17, M08, M02, M12 |
| EVT-WFL-043 | `wfl.signature.rejected` | T11 | [t11-wfl-p3.yaml](t11-wfl-p3.yaml) | vigente | M02, M08, M10, M12, M14, M16, M17, T09 |
| EVT-WFL-043 | `wfl.signature.expired` | T11 | [t11-wfl-p3.yaml](t11-wfl-p3.yaml) | vigente | M02, M08, M10, M12, M14, M16, M17, T09 |
| EVT-WFL-043 | `wfl.signature.cancelled` | T11 | [t11-wfl-p3.yaml](t11-wfl-p3.yaml) | vigente | M02, M08, M10, M12, M14, M16, M17, T09 |
| EVT-WFL-044 | `wfl.dossier.opened` | T11 | [t11-wfl-p3.yaml](t11-wfl-p3.yaml) | vigente | M09, M17, T10 |
| EVT-WFL-044 | `wfl.dossier.closed` | T11 | [t11-wfl-p3.yaml](t11-wfl-p3.yaml) | vigente | M09, M17, T10 |
| EVT-WFL-044 | `wfl.dossier.archived` | T11 | [t11-wfl-p3.yaml](t11-wfl-p3.yaml) | vigente | M09, M17, T10 |
| EVT-WFL-045 | `wfl.dossier.exported` | T11 | [t11-wfl-p3.yaml](t11-wfl-p3.yaml) | vigente | T02, T10 |
| EVT-WFL-046 | `wfl.operationalInbox.itemOpened` | T11 | [t11-wfl-p3.yaml](t11-wfl-p3.yaml) | vigente | T09, T01, T11 |
| EVT-WFL-046 | `wfl.operationalInbox.itemResolved` | T11 | [t11-wfl-p3.yaml](t11-wfl-p3.yaml) | vigente | T09, T01, T11 |
| EVT-WFL-047 | `wfl.jobSchedule.changed` | T11 | [t11-wfl-p3.yaml](t11-wfl-p3.yaml) | vigente | T01, T02 |
| EVT-WFL-048 | `wfl.bulkRun.completed` | T11 | [t11-wfl-p3.yaml](t11-wfl-p3.yaml) | vigente | M01, M19, T02, T04, T06, T07, T08, T09, T10, T11 |
| EVT-WFL-048 | `wfl.bulkRun.paused` | T11 | [t11-wfl-p3.yaml](t11-wfl-p3.yaml) | vigente | M01, M19, T02, T04, T06, T07, T08, T09, T10, T11 |
| EVT-WFL-048 | `wfl.bulkRun.failed` | T11 | [t11-wfl-p3.yaml](t11-wfl-p3.yaml) | vigente | M01, M19, T02, T04, T06, T07, T08, T09, T10, T11 |
| EVT-WFL-048 | `wfl.bulkRun.cancelled` | T11 | [t11-wfl-p3.yaml](t11-wfl-p3.yaml) | vigente | M01, M19, T02, T04, T06, T07, T08, T09, T10, T11 |
| EVT-PER-01 | `per.person.created` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M17, M19, T10 |
| EVT-PER-02 | `per.person.updated` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M05, M06, M16, T09 |
| EVT-PER-03 | `per.person.deceased` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M02, M08, M09, M17, M18, M19, T09 |
| EVT-PER-04 | `per.person.deathReverted` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M02, M09, M17 |
| EVT-PER-05 | `per.person.mergeRequested` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | T05, M04, M07, M08, M09, M10, M12, M14, M16, M17, M18, T02, T08, T09, T10, T11 |
| EVT-PER-06 | `per.person.merged` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | T05, M04, M07, M08, M09, M10, M12, M14, M16, M17, M18, T02, T08, T09, T10, T11 |
| EVT-PER-06 | `per.person.mergeReverted` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | T05, M04, M07, M08, M09, M10, M12, M14, M16, M17, M18, T02, T08, T09, T10, T11 |
| EVT-PER-07 | `per.person.anonymized` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | T10, T09, M19 |
| EVT-PER-08 | `per.taxId.verified` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M05, M06 |
| EVT-PER-08 | `per.taxId.mismatch` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M05, M06 |
| EVT-PER-09 | `per.holder.created` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M04, M17, M19 |
| EVT-PER-09 | `per.holder.activated` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M04, M17, M19 |
| EVT-PER-10 | `per.holder.closed` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M02, M05, M17, M19 |
| EVT-PER-10 | `per.holder.reopened` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M02, M05, M17, M19 |
| EVT-PER-11 | `per.account.created` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M02, M04, M05, M07 |
| EVT-PER-12 | `per.account.updated` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M05, M06, M07, T09 |
| EVT-PER-13 | `per.account.principalChanged` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M05, M17 |
| EVT-PER-14 | `per.account.closed` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M02, M05, M07 |
| EVT-PER-15 | `per.address.geoConfirmed` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M10, M03, M09 |
| EVT-PER-15 | `per.address.changed` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M10, M03, M09 |
| EVT-PER-16 | `per.premises.created` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M02, M10, M04 |
| EVT-PER-16 | `per.premises.updated` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M02, M10, M04 |
| EVT-PER-17 | `per.servicePoint.created` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M02, M03, M10 |
| EVT-PER-17 | `per.servicePoint.relocated` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M02, M03, M10 |
| EVT-PER-18 | `per.relationship.granted` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | T02, M19, M07, T09 |
| EVT-PER-18 | `per.relationship.revoked` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | T02, M19, M07, T09 |
| EVT-PER-18 | `per.relationship.expired` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | T02, M19, M07, T09 |
| EVT-PER-19 | `per.adherent.added` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | reemplazado por EVT-SOC-01 | M04, M05, M17 |
| EVT-PER-19 | `per.adherent.removed` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | reemplazado por EVT-SOC-01 | M04, M05, M17 |
| EVT-PER-20 | `per.block.applied` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M02, M05, M07, M08, M19 |
| EVT-PER-20 | `per.block.lifted` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M02, M05, M07, M08, M19 |
| EVT-PER-20 | `per.block.expired` | M01 | [m01-per-p1.yaml](m01-per-p1.yaml) | vigente | M02, M05, M07, M08, M19 |
| EVT-PER-21 | `per.document.presented` | M01 | [m01-per-p2.yaml](m01-per-p2.yaml) | vigente | M02, M04, M09 |
| EVT-PER-21 | `per.document.validated` | M01 | [m01-per-p2.yaml](m01-per-p2.yaml) | vigente | M02, M04, M09 |
| EVT-PER-21 | `per.document.expired` | M01 | [m01-per-p2.yaml](m01-per-p2.yaml) | vigente | M02, M04, M09 |
| EVT-PER-22 | `per.transfer.executed` | M01 | [m01-per-p2.yaml](m01-per-p2.yaml) | vigente | M02, M04, M05, M07, M17 |
| EVT-PER-22 | `per.transfer.reverted` | M01 | [m01-per-p2.yaml](m01-per-p2.yaml) | vigente | M02, M04, M05, M07, M17 |
| EVT-PER-23 | `per.ownership.changed` | M01 | [m01-per-p2.yaml](m01-per-p2.yaml) | vigente | M02, M05, M07, M09, M19 |
| EVT-PER-24 | `per.userLink.verified` | M01 | [m01-per-p2.yaml](m01-per-p2.yaml) | vigente | T02, M16, M19 |
| EVT-PER-24 | `per.userLink.revoked` | M01 | [m01-per-p2.yaml](m01-per-p2.yaml) | vigente | T02, M16, M19 |
| EVT-PER-25 | `per.contact.changed` | M01 | [m01-per-p2.yaml](m01-per-p2.yaml) | vigente | T09, M19 |
| EVT-PER-26 | `per.person.fiscalLookupRequested` | M01 | [m01-per-p2.yaml](m01-per-p2.yaml) | vigente | T06, M01 |
| EVT-CAT-01 | `cat.tenantService.enabled` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | T01, T03, M19 |
| EVT-CAT-01 | `cat.tenantService.disabled` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | T01, T03, M19 |
| EVT-CAT-02 | `cat.tenantService.published` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M19, M09, M04 |
| EVT-CAT-03 | `cat.tenantService.withdrawn` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M19, M09 |
| EVT-CAT-04 | `cat.configVersion.published` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M04, M05, M08, M10, M09, M11 |
| EVT-CAT-05 | `cat.plan.published` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M19, M09, M04 |
| EVT-CAT-05 | `cat.plan.discontinued` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M19, M09, M04 |
| EVT-CAT-06 | `cat.contract.requested` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M09, M10 |
| EVT-CAT-07 | `cat.contract.feasibilityRequested` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M10 |
| EVT-CAT-08 | `cat.contract.installationRequested` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M10, M13 |
| EVT-CAT-09 | `cat.contract.activated` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M05, M04, M03, M07, M09, M01, M17, M18, M19, M02 |
| EVT-CAT-10 | `cat.contract.suspended` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M05, M10, M08, M09, M19, M04, M03, M18 |
| EVT-CAT-11 | `cat.contract.reactivationRequested` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M10 |
| EVT-CAT-12 | `cat.contract.reactivated` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M05, M08, M09, M04, M19 |
| EVT-CAT-13 | `cat.contract.terminationRequested` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M10, M09 |
| EVT-CAT-14 | `cat.contract.terminationWithdrawn` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M10, M09 |
| EVT-CAT-15 | `cat.contract.terminated` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M05, M03, M07, M01, M17, M18, M09, M13, M04, M19, M02 |
| EVT-CAT-16 | `cat.contract.cancelled` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M09, M10, M13 |
| EVT-CAT-17 | `cat.contract.transferred` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M05, M07, M01, M03, M18, T06 |
| EVT-CAT-18 | `cat.contract.planChanged` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M04, M05, M10, M19, M09, M13 |
| EVT-CAT-19 | `cat.contract.categoryChanged` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M04, M05, M06, M01, M03, M02 |
| EVT-CAT-20 | `cat.contract.addressChanged` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M10, M03, M06, M02 |
| EVT-CAT-21 | `cat.contract.flagChanged` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M05, M04, M03 |
| EVT-CAT-22 | `cat.contract.equipmentAssigned` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M13, M05, M15 |
| EVT-CAT-22 | `cat.contract.equipmentReturned` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M13, M05, M15 |
| EVT-CAT-22 | `cat.contract.equipmentLost` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | M13, M05, M15 |
| EVT-CAT-23 | `cat.contract.memberAdded` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | reemplazado por EVT-SOC-01 | M04, M05, M18 |
| EVT-CAT-23 | `cat.contract.memberRemoved` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | reemplazado por EVT-SOC-01 | M04, M05, M18 |
| EVT-CAT-24 | `cat.bulkOperation.completed` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | T09, M04, M08 |
| EVT-CAT-25 | `cat.serviceCopy.completed` | M02 | [m02-cat-p1.yaml](m02-cat-p1.yaml) | vigente | T01, T04 |
| EVT-CAT-26 | `cat.serviceCopy.prepared` | M02 | [m02-cat-p2.yaml](m02-cat-p2.yaml) | vigente | T04 |
| EVT-CAT-27 | `cat.command.rejected` | M02 | [m02-cat-p2.yaml](m02-cat-p2.yaml) | vigente | M09 |
| EVT-CAT-28 | `cat.contract.meteringRegimeChanged` | M02 | [m02-cat-p2.yaml](m02-cat-p2.yaml) | vigente | M03, M04, M05, M19 |
| EVT-MED-01 | `med.meter.installed` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | M13, M01, T06 |
| EVT-MED-02 | `med.meter.removed` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | M13, M01 |
| EVT-MED-03 | `med.installation.voided` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | M13, M01 |
| EVT-MED-04 | `med.installation.categoryChangeRequested` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | M01, M02 |
| EVT-MED-05 | `med.readingBatch.generated` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | T09 |
| EVT-MED-06 | `med.readingBatch.confirmed` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | M05, T10 |
| EVT-MED-07 | `med.readingBatch.closed` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | M05, M16, T10 |
| EVT-MED-08 | `med.reading.captured` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | T10 |
| EVT-MED-09 | `med.reading.corrected` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | M04, M05 |
| EVT-MED-10 | `med.readingObservation.workOrderRequested` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | M10 |
| EVT-MED-11 | `med.consumption.approved` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | M04, M05, M15 |
| EVT-MED-12 | `med.consumption.blocked` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | M05 |
| EVT-MED-13 | `med.consumption.voided` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | M04, M05 |
| EVT-MED-14 | `med.consumptionException.raised` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | T09, T10, T11 |
| EVT-MED-15 | `med.consumptionAdjustment.approved` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | M04, M05 |
| EVT-MED-16 | `med.point.inspectionRequested` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | M10 |
| EVT-MED-17 | `med.point.suspicionRaised` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | M10, M09 |
| EVT-MED-18 | `med.demand.transgressionDetected` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | M09, M04 |
| EVT-MED-19 | `med.injectionBalance.approved` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | M04, M05, M07, M06 |
| EVT-MED-20 | `med.dgContract.statusChanged` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | M01, M06 |
| EVT-MED-21 | `med.remoteOperation.succeeded` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | M08, M10, M01 |
| EVT-MED-22 | `med.remoteOperation.failed` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | M08, M10, T06 |
| EVT-MED-23 | `med.prepaidTopUp.delivered` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | M07, M19, T09 |
| EVT-MED-24 | `med.prepaidTopUp.failed` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | M07, T09 |
| EVT-MED-25 | `med.prepaidAccount.lowBalance` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | T09 |
| EVT-MED-26 | `med.selfReadingWindow.opened` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | T09 |
| EVT-MED-27 | `med.selfReading.accepted` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | T09, M19 |
| EVT-MED-27 | `med.selfReading.rejected` | M03 | [m03-med-p1.yaml](m03-med-p1.yaml) | vigente | T09, M19 |
| EVT-MED-28 | `med.syncConflict.raised` | M03 | [m03-med-p2.yaml](m03-med-p2.yaml) | vigente | T09, T11 |
| EVT-MED-29 | `med.meteringSystem.healthChanged` | M03 | [m03-med-p2.yaml](m03-med-p2.yaml) | vigente | T06, T01 |
| EVT-MED-30 | `med.readingRoute.published` | M03 | [m03-med-p2.yaml](m03-med-p2.yaml) | vigente | T06 |
| EVT-TAR-001 | `tar.schedule.submitted` | M04 | [m04-tar.yaml](m04-tar.yaml) | vigente | T11, T09 |
| EVT-TAR-002 | `tar.schedule.approved` | M04 | [m04-tar.yaml](m04-tar.yaml) | vigente | T11, T02 |
| EVT-TAR-003 | `tar.schedule.rejected` | M04 | [m04-tar.yaml](m04-tar.yaml) | vigente | T09 |
| EVT-TAR-004 | `tar.schedule.published` | M04 | [m04-tar.yaml](m04-tar.yaml) | vigente | M05, M19, T10 |
| EVT-TAR-005 | `tar.schedule.activated` | M04 | [m04-tar.yaml](m04-tar.yaml) | vigente | M05, M19, T10 |
| EVT-TAR-006 | `tar.schedule.superseded` | M04 | [m04-tar.yaml](m04-tar.yaml) | vigente | T10 |
| EVT-TAR-007 | `tar.rule.published` | M04 | [m04-tar.yaml](m04-tar.yaml) | vigente | T10, T02 |
| EVT-TAR-008 | `tar.calculation.completed` | M04 | [m04-tar.yaml](m04-tar.yaml) | vigente | M05 |
| EVT-TAR-009 | `tar.simulation.completed` | M04 | [m04-tar.yaml](m04-tar.yaml) | vigente | T09 |
| EVT-TAR-010 | `tar.promotion.assigned` | M04 | [m04-tar.yaml](m04-tar.yaml) | vigente | M09, M19 |
| EVT-TAR-011 | `tar.promotion.consumed` | M04 | [m04-tar.yaml](m04-tar.yaml) | vigente | M19 |
| EVT-TAR-012 | `tar.promotion.ended` | M04 | [m04-tar.yaml](m04-tar.yaml) | vigente | T09, M19, M02 |
| EVT-TAR-013 | `tar.subsidyRoll.imported` | M04 | [m04-tar.yaml](m04-tar.yaml) | vigente | M06, T10 |
| EVT-TAR-014 | `tar.enrollment.changed` | M04 | [m04-tar.yaml](m04-tar.yaml) | vigente | M02, M19, T11 |
| EVT-TAR-015 | `tar.retroactiveDiff.computed` | M04 | [m04-tar.yaml](m04-tar.yaml) | vigente | T11 |
| EVT-TAR-016 | `tar.retroactiveDiff.approved` | M04 | [m04-tar.yaml](m04-tar.yaml) | vigente | M05 |
| EVT-TAR-017 | `tar.contractedDemand.updateProposed` | M04 | [m04-tar.yaml](m04-tar.yaml) | vigente | M02, M03 |
| EVT-TAR-018 | `tar.category.changeProposed` | M04 | [m04-tar.yaml](m04-tar.yaml) | vigente | M02 |
| EVT-TAR-019 | `tar.calls.rated` | M04 | [m04-tar.yaml](m04-tar.yaml) | vigente | M10 |
| EVT-TAR-020 | `tar.roundingCarry.confirmed` | M04 | [m04-tar.yaml](m04-tar.yaml) | vigente | M07 |
| EVT-TAR-021 | `tar.injectedCredit.recorded` | M04 | [m04-tar.yaml](m04-tar.yaml) | vigente | M07, M06 |
| EVT-FAC-01 | `fac.billingRun.prepared` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | T10 |
| EVT-FAC-02 | `fac.billingRun.prebilled` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | T09, T07 |
| EVT-FAC-03 | `fac.billingRun.approved` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | T02 |
| EVT-FAC-04 | `fac.billingRun.paused` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | T09 |
| EVT-FAC-05 | `fac.billingRun.issued` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | M06, M07, M17, T10 |
| EVT-FAC-06 | `fac.billingRun.closed` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | M17, T10 |
| EVT-FAC-07 | `fac.invoice.issued` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | M06, M07, M03, M04, M08, M11, M13, M17, M18, M19, M09 |
| EVT-FAC-08 | `fac.invoice.annulled` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | M07, M06, M03, M04, M08, M11, M17, M18 |
| EVT-FAC-09 | `fac.invoice.reversed` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | M07, M06, M17 |
| EVT-FAC-10 | `fac.creditNote.issued` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | M06, M07, M08, M11, M09, M17 |
| EVT-FAC-11 | `fac.debitNote.issued` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | M06, M07, M09 |
| EVT-FAC-12 | `fac.invoice.blocked` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | M07, M14, M08 |
| EVT-FAC-12 | `fac.invoice.unblocked` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | M07, M14, M08 |
| EVT-FAC-13 | `fac.invoice.dueDatesChanged` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | M07, M08, M19 |
| EVT-FAC-14 | `fac.invoice.published` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | M19, T09 |
| EVT-FAC-15 | `fac.invoice.delivered` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | M01, T10, T09 |
| EVT-FAC-15 | `fac.invoice.deliveryFailed` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | M01, T10, T09 |
| EVT-FAC-16 | `fac.billingException.opened` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | M01, M02, M03, M04, M06, M07, T09, T11 |
| EVT-FAC-16 | `fac.billingException.resolved` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | M01, M02, M03, M04, M06, M07, T09, T11 |
| EVT-FAC-17 | `fac.billingCycle.closed` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | M17, T10, M06, M02 |
| EVT-FAC-18 | `fac.paymentSlip.generated` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | M07, M19 |
| EVT-FAC-18 | `fac.paymentSlip.cancelled` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | M07, M19 |
| EVT-FAC-19 | `fac.recategorization.confirmed` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | M02, M04 |
| EVT-FAC-20 | `fac.billableItem.billed` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | M08, M11, M13, M09 |
| EVT-FAC-21 | `fac.billingRun.discarded` | M05 | [m05-fac.yaml](m05-fac.yaml) | vigente | M04, T10 |
| EVT-FIS-01 | `fis.invoice.authorized` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | M05, M07, M15, M19, T10, T09 |
| EVT-FIS-02 | `fis.authorization.rejected` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | M05, M07, T09 |
| EVT-FIS-03 | `fis.authorization.detained` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | M05, M01, T09 |
| EVT-FIS-04 | `fis.authorization.uncertain` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | T06, M05 |
| EVT-FIS-05 | `fis.authorization.reconciled` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | M05, M15, T02 |
| EVT-FIS-06 | `fis.caea.obtained` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | M05 |
| EVT-FIS-06 | `fis.caea.reported` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | M05 |
| EVT-FIS-07 | `fis.contingency.activated` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | M05, T09 |
| EVT-FIS-07 | `fis.contingency.deactivated` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | M05, T09 |
| EVT-FIS-08 | `fis.credential.expiring` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | T09, T01 |
| EVT-FIS-08 | `fis.credential.expired` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | T09, T01 |
| EVT-FIS-09 | `fis.normativeVersion.published` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | T11 |
| EVT-FIS-10 | `fis.normativeAdoption.approved` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | M04, M05, M12 |
| EVT-FIS-11 | `fis.registry.activated` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | M05 |
| EVT-FIS-12 | `fis.withholding.confirmed` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | M12, M14, M15 |
| EVT-FIS-12 | `fis.withholding.cancelled` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | M12, M14, M15 |
| EVT-FIS-13 | `fis.obligation.created` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | M14, T09 |
| EVT-FIS-14 | `fis.filing.generated` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | T09, T02, T10 |
| EVT-FIS-14 | `fis.filing.submitted` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | T09, T02, T10 |
| EVT-FIS-14 | `fis.filing.accepted` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | T09, T02, T10 |
| EVT-FIS-14 | `fis.filing.rejected` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | T09, T02, T10 |
| EVT-FIS-15 | `fis.vatLedger.closed` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | M15, T10 |
| EVT-FIS-15 | `fis.vatLedger.reopened` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | M15, T10 |
| EVT-FIS-16 | `fis.thirdPartyCharge.collected` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | M15 |
| EVT-FIS-17 | `fis.remittance.approved` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | M14, M15 |
| EVT-FIS-17 | `fis.remittance.paid` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | M14, M15 |
| EVT-FIS-18 | `fis.regulatoryReport.generated` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | T09 |
| EVT-FIS-18 | `fis.regulatoryReport.submitted` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | T09 |
| EVT-FIS-19 | `fis.padron.differenceDetected` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | M01, M12 |
| EVT-FIS-20 | `fis.taxCalculation.blocked` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | M04, M05 |
| EVT-FIS-21 | `fis.authorization.globalFailure` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | M05, T09, T11 |
| EVT-FIS-21 | `fis.authorization.globalRecovered` | M06 | [m06-fis-p1.yaml](m06-fis-p1.yaml) | vigente | M05, T09, T11 |
| EVT-FIS-22 | `fis.misComprobantes.reconciled` | M06 | [m06-fis-p2.yaml](m06-fis-p2.yaml) | vigente | M12 |
| EVT-FIS-23 | `fis.withholdingComputation.updated` | M06 | [m06-fis-p2.yaml](m06-fis-p2.yaml) | vigente | M14 |
| EVT-FIS-24 | `fis.thirdPartyAgreement.published` | M06 | [m06-fis-p2.yaml](m06-fis-p2.yaml) | vigente | M08, M05, M15 |
| EVT-FIS-25 | `fis.regimeFile.requested` | M06 | [m06-fis-p2.yaml](m06-fis-p2.yaml) | vigente | T06 |
| EVT-COB-01 | `cob.obligation.registered` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M07, M19, T09 |
| EVT-COB-02 | `cob.obligation.settled` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M08, M05, M07, T09 |
| EVT-COB-03 | `cob.obligation.reopened` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M08, M07 |
| EVT-COB-04 | `cob.payment.confirmed` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M15, M08, T09, M19, M14, M03, M05, M06, M09, M17, M18, M11, T07 |
| EVT-COB-05 | `cob.receipt.voided` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M15, M08, M05, M14, M17, M18 |
| EVT-COB-06 | `cob.allocation.reversed` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M15, M08, M06 |
| EVT-COB-07 | `cob.surcharge.deferred` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M08 |
| EVT-COB-08 | `cob.minimumPayment.evaluated` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M08 |
| EVT-COB-09 | `cob.creditBalance.created` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M15, M05 |
| EVT-COB-09 | `cob.creditBalance.consumed` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M15, M05 |
| EVT-COB-10 | `cob.retention.received` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M06 |
| EVT-COB-11 | `cob.settlement.expected` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M14 |
| EVT-COB-12 | `cob.cashSession.closed` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M14, M15, T10 |
| EVT-COB-13 | `cob.treasuryHandover.delivered` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M14 |
| EVT-COB-14 | `cob.cashDifference.recorded` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M15 |
| EVT-COB-15 | `cob.agencyFee.recorded` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M15, M14 |
| EVT-COB-16 | `cob.directDebit.rejected` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | T09, M08 |
| EVT-COB-17 | `cob.directDebitMandate.changed` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M05, T09, M19 |
| EVT-COB-18 | `cob.chargeback.applied` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M08, M15, T09 |
| EVT-COB-19 | `cob.refund.executed` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M14, M15, M09, M03 |
| EVT-COB-20 | `cob.paymentIntent.statusChanged` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M19, T09, M08 |
| EVT-COB-21 | `cob.thirdPartyCollection.recorded` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M14, M15 |
| EVT-COB-22 | `cob.exception.opened` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | T09, T11 |
| EVT-COB-23 | `cob.audit.*` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | T02 |
| EVT-COB-24 | `cob.payment.informed` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M08, M19 |
| EVT-COB-25 | `cob.cashSession.reopened` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M14 |
| EVT-COB-26 | `cob.unidentified.resolved` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M14 |
| EVT-COB-27 | `cob.refund.approved` | M07 | [m07-cob-p1.yaml](m07-cob-p1.yaml) | vigente | M14, T06 |
| EVT-COB-28 | `cob.paymentIntent.requested` | M07 | [m07-cob-p2.yaml](m07-cob-p2.yaml) | vigente | T06 |
| EVT-COB-29 | `cob.debtPublication.requested` | M07 | [m07-cob-p2.yaml](m07-cob-p2.yaml) | vigente | T06 |
| EVT-COB-30 | `cob.directDebit.batchRequested` | M07 | [m07-cob-p2.yaml](m07-cob-p2.yaml) | vigente | T06 |
| EVT-MOR-01 | `mor.policy.published` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | T04, M05, M07 |
| EVT-MOR-02 | `mor.interest.settled` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M05, M15, M07 |
| EVT-MOR-03 | `mor.deferredInterest.created` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M05, M15, M07 |
| EVT-MOR-03 | `mor.deferredInterest.billed` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M05, M15, M07 |
| EVT-MOR-03 | `mor.deferredInterest.cancelled` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M05, M15, M07 |
| EVT-MOR-04 | `mor.interestRun.completed` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M05, M15, T10 |
| EVT-MOR-04 | `mor.interestRun.failed` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M05, M15, T10 |
| EVT-MOR-05 | `mor.hold.applied` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M07, M19 |
| EVT-MOR-05 | `mor.hold.released` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M07, M19 |
| EVT-MOR-06 | `mor.evaluation.closed` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | T10, M09, M19 |
| EVT-MOR-07 | `mor.batch.generated` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | T10 |
| EVT-MOR-07 | `mor.batch.annulled` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | T10 |
| EVT-MOR-08 | `mor.notice.created` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M07, M19, M09, T09 |
| EVT-MOR-08 | `mor.notice.processed` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M07, M19, M09, T09 |
| EVT-MOR-08 | `mor.notice.paid` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M07, M19, M09, T09 |
| EVT-MOR-08 | `mor.notice.excluded` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M07, M19, M09, T09 |
| EVT-MOR-08 | `mor.notice.closed` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M07, M19, M09, T09 |
| EVT-MOR-09 | `mor.notice.dispatchRequested` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | T09 |
| EVT-MOR-10 | `mor.notice.evidenceMissing` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M09 |
| EVT-MOR-11 | `mor.promise.registered` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M09 |
| EVT-MOR-11 | `mor.promise.broken` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M09 |
| EVT-MOR-11 | `mor.promise.kept` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M09 |
| EVT-MOR-12 | `mor.interruption.requested` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M10, M09, M19, M02, M03 |
| EVT-MOR-12 | `mor.interruption.blocked` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M10, M09, M19, M02, M03 |
| EVT-MOR-12 | `mor.interruption.approved` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M10, M09, M19, M02, M03 |
| EVT-MOR-12 | `mor.interruption.scheduled` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M10, M09, M19, M02, M03 |
| EVT-MOR-13 | `mor.interruption.executed` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M01, M02, M05, T09, M19, M09, M16 |
| EVT-MOR-13 | `mor.interruption.executionFailed` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M01, M02, M05, T09, M19, M09, M16 |
| EVT-MOR-13 | `mor.interruption.cancelled` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M01, M02, M05, T09, M19, M09, M16 |
| EVT-MOR-14 | `mor.agreement.created` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M05, M07, M15, M17, M19 |
| EVT-MOR-14 | `mor.agreement.activated` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M05, M07, M15, M17, M19 |
| EVT-MOR-14 | `mor.agreement.completed` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M05, M07, M15, M17, M19 |
| EVT-MOR-14 | `mor.agreement.defaulted` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M05, M07, M15, M17, M19 |
| EVT-MOR-14 | `mor.agreement.rehabilitated` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M05, M07, M15, M17, M19 |
| EVT-MOR-14 | `mor.agreement.refinanced` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M05, M07, M15, M17, M19 |
| EVT-MOR-14 | `mor.agreement.annulled` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M05, M07, M15, M17, M19 |
| EVT-MOR-15 | `mor.installment.due` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M05, T09 |
| EVT-MOR-15 | `mor.installment.overdue` | M08 | [m08-mor-p1.yaml](m08-mor-p1.yaml) | vigente | M05, T09 |
| EVT-MOR-16 | `mor.guarantee.executed` | M08 | [m08-mor-p2.yaml](m08-mor-p2.yaml) | vigente | M07, M14, M15 |
| EVT-MOR-16 | `mor.guarantee.applied` | M08 | [m08-mor-p2.yaml](m08-mor-p2.yaml) | vigente | M07, M14, M15 |
| EVT-MOR-16 | `mor.guarantee.refunded` | M08 | [m08-mor-p2.yaml](m08-mor-p2.yaml) | vigente | M07, M14, M15 |
| EVT-MOR-17 | `mor.collectionCase.opened` | M08 | [m08-mor-p2.yaml](m08-mor-p2.yaml) | vigente | M15, T10, M01 |
| EVT-MOR-17 | `mor.collectionCase.closed` | M08 | [m08-mor-p2.yaml](m08-mor-p2.yaml) | vigente | M15, T10, M01 |
| EVT-MOR-17 | `mor.collectionCase.costRegistered` | M08 | [m08-mor-p2.yaml](m08-mor-p2.yaml) | vigente | M15, T10, M01 |
| EVT-MOR-18 | `mor.writeOff.approved` | M08 | [m08-mor-p2.yaml](m08-mor-p2.yaml) | vigente | M15, M07 |
| EVT-MOR-18 | `mor.writeOff.reverted` | M08 | [m08-mor-p2.yaml](m08-mor-p2.yaml) | vigente | M15, M07 |
| EVT-MOR-19 | `mor.prescription.executed` | M08 | [m08-mor-p2.yaml](m08-mor-p2.yaml) | vigente | M05, M07, M15 |
| EVT-MOR-20 | `mor.protection.expiring` | M08 | [m08-mor-p2.yaml](m08-mor-p2.yaml) | vigente | M09 |
| EVT-MOR-20 | `mor.protection.expired` | M08 | [m08-mor-p2.yaml](m08-mor-p2.yaml) | vigente | M09 |
| EVT-MOR-21 | `mor.socialCoverage.suspended` | M08 | [m08-mor-p2.yaml](m08-mor-p2.yaml) | vigente | M18, M19, T09 |
| EVT-MOR-21 | `mor.socialCoverage.restored` | M08 | [m08-mor-p2.yaml](m08-mor-p2.yaml) | vigente | M18, M19, T09 |
| EVT-CRM-01 | `crm.case.created` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T09, T10 |
| EVT-CRM-02 | `crm.case.classified` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T10 |
| EVT-CRM-03 | `crm.case.derived` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T09, T11 |
| EVT-CRM-04 | `crm.case.assigned` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T09, T11 |
| EVT-CRM-05 | `crm.case.statusChanged` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T09, T10, M19, T11, M08 |
| EVT-CRM-06 | `crm.case.slaWarning` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T09 |
| EVT-CRM-07 | `crm.case.slaBreached` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T09, T10 |
| EVT-CRM-08 | `crm.case.resolved` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T09, M19 |
| EVT-CRM-09 | `crm.case.closed` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T09, T10, M10 |
| EVT-CRM-10 | `crm.case.reopened` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T10 |
| EVT-CRM-11 | `crm.case.cancelled` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | M11, T10, M02 |
| EVT-CRM-12 | `crm.case.merged` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T10 |
| EVT-CRM-13 | `crm.commandRequest.requested` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | M02, M04, M05, M07, M08, M10, M11 |
| EVT-CRM-14 | `crm.cancellationRequest.received` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T09, T10 |
| EVT-CRM-15 | `crm.cancellationRequest.receiptDelivered` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T10 |
| EVT-CRM-15 | `crm.cancellationRequest.receiptFailed` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T10 |
| EVT-CRM-16 | `crm.incident.confirmed` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T09, M10, T10, M19 |
| EVT-CRM-16 | `crm.incident.updated` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T09, M10, T10, M19 |
| EVT-CRM-16 | `crm.incident.restored` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T09, M10, T10, M19 |
| EVT-CRM-16 | `crm.incident.closed` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T09, M10, T10, M19 |
| EVT-CRM-17 | `crm.message.received` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T10, M19 |
| EVT-CRM-17 | `crm.message.sent` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T10, M19 |
| EVT-CRM-18 | `crm.conversation.handedOff` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T10 |
| EVT-CRM-19 | `crm.aiSuggestion.recorded` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T08, T10 |
| EVT-CRM-19 | `crm.aiSuggestion.decided` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T08, T10 |
| EVT-CRM-20 | `crm.queueTicket.issued` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T09, T10 |
| EVT-CRM-20 | `crm.queueTicket.called` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T09, T10 |
| EVT-CRM-20 | `crm.queueTicket.finished` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T09, T10 |
| EVT-CRM-21 | `crm.activityOccurrence.generated` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T09, T10, T11 |
| EVT-CRM-21 | `crm.activityOccurrence.overdue` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T09, T10, T11 |
| EVT-CRM-21 | `crm.activityOccurrence.closed` | M09 | [m09-crm-p1.yaml](m09-crm-p1.yaml) | vigente | T09, T10, T11 |
| EVT-CRM-22 | `crm.deskEntry.registered` | M09 | [m09-crm-p2.yaml](m09-crm-p2.yaml) | vigente | T10, T11 |
| EVT-CRM-22 | `crm.deskEntry.transferred` | M09 | [m09-crm-p2.yaml](m09-crm-p2.yaml) | vigente | T10, T11 |
| EVT-CRM-22 | `crm.deskEntry.answered` | M09 | [m09-crm-p2.yaml](m09-crm-p2.yaml) | vigente | T10, T11 |
| EVT-CRM-23 | `crm.procedureRecord.expired` | M09 | [m09-crm-p2.yaml](m09-crm-p2.yaml) | vigente | M02, M04, M07 |
| EVT-CRM-24 | `crm.circularRun.generated` | M09 | [m09-crm-p2.yaml](m09-crm-p2.yaml) | vigente | T09 |
| EVT-CRM-25 | `crm.survey.negativeReceived` | M09 | [m09-crm-p2.yaml](m09-crm-p2.yaml) | vigente | T11 |
| EVT-TEC-01 | `tec.feasibility.requested` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M09, T09 |
| EVT-TEC-02 | `tec.feasibility.verdictIssued` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M09, M11, T09, M02 |
| EVT-TEC-03 | `tec.feasibility.cancelled` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M09 |
| EVT-TEC-04 | `tec.workOrder.created` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M09, M15, T09, M19, M02 |
| EVT-TEC-05 | `tec.workOrder.statusChanged` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M09, M19, M13, M18, T11 |
| EVT-TEC-06 | `tec.workOrder.executed` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M09, M13 |
| EVT-TEC-07 | `tec.workOrder.closed` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M09, M05, M03, M15, M01, M02, M04, M08, M11, M13, M16, M18, M19 |
| EVT-TEC-08 | `tec.workOrder.cancelled` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M09, M13, M03, M08 |
| EVT-TEC-09 | `tec.workOrder.reopened` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M09, M05, M16 |
| EVT-TEC-10 | `tec.charge.proposed` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M04 |
| EVT-TEC-11 | `tec.material.requested` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M13, M12 |
| EVT-TEC-11 | `tec.material.returned` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M13, M12 |
| EVT-TEC-11 | `tec.material.used` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M13, M12 |
| EVT-TEC-12 | `tec.equipment.installed` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M13, M02 |
| EVT-TEC-12 | `tec.equipment.retrieved` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M13, M02 |
| EVT-TEC-13 | `tec.visit.statusChanged` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | T09, M19, M09, T11 |
| EVT-TEC-14 | `tec.visit.failed` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M09, M04, M05, M13, M02, M19, M08 |
| EVT-TEC-15 | `tec.conformity.signed` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M09, M02 |
| EVT-TEC-15 | `tec.conformity.refused` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M09, M02 |
| EVT-TEC-16 | `tec.installation.activationConfirmed` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M02, M05, M09, T09, M04 |
| EVT-TEC-17 | `tec.survey.requested` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | T09 |
| EVT-TEC-18 | `tec.disconnection.executed` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M08, M05, M04, M02 |
| EVT-TEC-19 | `tec.reconnection.executed` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M08, M05, M04, M02, M16 |
| EVT-TEC-20 | `tec.dependentDisconnection.requested` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M08, M02 |
| EVT-TEC-21 | `tec.provisioning.confirmed` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M08, M09, M02 |
| EVT-TEC-21 | `tec.provisioning.failed` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M08, M09, M02 |
| EVT-TEC-22 | `tec.meter.changed` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M03, M13 |
| EVT-TEC-23 | `tec.outage.notified` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | T09, T10, M09 |
| EVT-TEC-23 | `tec.outage.finished` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | T09, T10, M09 |
| EVT-TEC-24 | `tec.networkDevice.down` | M10 | [m10-tec-p1.yaml](m10-tec-p1.yaml) | vigente | M09, T09 |
| EVT-TEC-25 | `tec.levy.approved` | M10 | [m10-tec-p2.yaml](m10-tec-p2.yaml) | vigente | M02, M04, T09 |
| EVT-TEC-26 | `tec.inspection.recoveryApproved` | M10 | [m10-tec-p2.yaml](m10-tec-p2.yaml) | vigente | M04, M05 |
| EVT-TEC-27 | `tec.cdr.attributed` | M10 | [m10-tec-p2.yaml](m10-tec-p2.yaml) | vigente | M04 |
| EVT-TEC-28 | `tec.mobileUsage.imported` | M10 | [m10-tec-p2.yaml](m10-tec-p2.yaml) | vigente | M04, M05 |
| EVT-TEC-29 | `tec.syncConflict.opened` | M10 | [m10-tec-p2.yaml](m10-tec-p2.yaml) | vigente | M09, T09, T11 |
| EVT-TEC-29 | `tec.syncConflict.resolved` | M10 | [m10-tec-p2.yaml](m10-tec-p2.yaml) | vigente | M09, T09, T11 |
| EVT-TEC-30 | `tec.geo.pointUpdated` | M10 | [m10-tec-p2.yaml](m10-tec-p2.yaml) | vigente | M01, M03 |
| EVT-TEC-31 | `tec.phoneLine.changed` | M10 | [m10-tec-p2.yaml](m10-tec-p2.yaml) | vigente | M04 |
| EVT-TEC-32 | `tec.crewTimesheet.approved` | M10 | [m10-tec-p2.yaml](m10-tec-p2.yaml) | vigente | M16 |
| EVT-TEC-33 | `tec.provisioning.requested` | M10 | [m10-tec-p2.yaml](m10-tec-p2.yaml) | vigente | T06 |
| EVT-TEC-34 | `tec.work.completed` | M10 | [m10-tec-p2.yaml](m10-tec-p2.yaml) | vigente | M15, M13 |
| EVT-TEC-35 | `tec.emergency.declared` | M10 | [m10-tec-p2.yaml](m10-tec-p2.yaml) | vigente | T09, M09, T10 |
| EVT-TEC-35 | `tec.emergency.closed` | M10 | [m10-tec-p2.yaml](m10-tec-p2.yaml) | vigente | T09, M09, T10 |
| EVT-TEC-36 | `tec.onCall.escalated` | M10 | [m10-tec-p2.yaml](m10-tec-p2.yaml) | vigente | T09, M09 |
| EVT-TEC-37 | `tec.waterSample.outOfLimit` | M10 | [m10-tec-p2.yaml](m10-tec-p2.yaml) | vigente | M09, T09, M06 |
| EVT-TEC-38 | `tec.quotaUsage.reported` | M10 | [m10-tec-p2.yaml](m10-tec-p2.yaml) | vigente | M04 |
| EVT-VEN-01 | `ven.operationCharge.created` | M11 | [m11-ven.yaml](m11-ven.yaml) | vigente | M09 |
| EVT-VEN-02 | `ven.operationCharge.cancelled` | M11 | [m11-ven.yaml](m11-ven.yaml) | vigente | M09, M05 |
| EVT-VEN-03 | `ven.operationCharge.invoiced` | M11 | [m11-ven.yaml](m11-ven.yaml) | vigente | M09 |
| EVT-VEN-04 | `ven.quote.created` | M11 | [m11-ven.yaml](m11-ven.yaml) | vigente | T09, M09 |
| EVT-VEN-04 | `ven.quote.sent` | M11 | [m11-ven.yaml](m11-ven.yaml) | vigente | T09, M09 |
| EVT-VEN-05 | `ven.quote.accepted` | M11 | [m11-ven.yaml](m11-ven.yaml) | vigente | M10, M09, M13, T09 |
| EVT-VEN-06 | `ven.quote.rejected` | M11 | [m11-ven.yaml](m11-ven.yaml) | vigente | M09, M13, T09 |
| EVT-VEN-06 | `ven.quote.expired` | M11 | [m11-ven.yaml](m11-ven.yaml) | vigente | M09, M13, T09 |
| EVT-VEN-06 | `ven.quote.cancelled` | M11 | [m11-ven.yaml](m11-ven.yaml) | vigente | M09, M13, T09 |
| EVT-VEN-07 | `ven.salesOrder.confirmed` | M11 | [m11-ven.yaml](m11-ven.yaml) | vigente | M13, M05, M15, M17, M18 |
| EVT-VEN-08 | `ven.salesOrder.delivered` | M11 | [m11-ven.yaml](m11-ven.yaml) | vigente | M13, M15 |
| EVT-VEN-09 | `ven.salesOrder.returned` | M11 | [m11-ven.yaml](m11-ven.yaml) | vigente | M13, M05, M07 |
| EVT-VEN-10 | `ven.salesOrder.cancelled` | M11 | [m11-ven.yaml](m11-ven.yaml) | vigente | M13, M05, M15, M17 |
| EVT-VEN-11 | `ven.installmentPlan.created` | M11 | [m11-ven.yaml](m11-ven.yaml) | vigente | M07, M15, M05 |
| EVT-VEN-12 | `ven.installment.updated` | M11 | [m11-ven.yaml](m11-ven.yaml) | vigente | M07, M15, M05 |
| EVT-VEN-13 | `ven.posSession.closed` | M11 | [m11-ven.yaml](m11-ven.yaml) | vigente | M07, M15 |
| EVT-VEN-14 | `ven.priceList.updated` | M11 | [m11-ven.yaml](m11-ven.yaml) | vigente | M09 |
| EVT-VEN-15 | `ven.salesOrder.invoiced` | M11 | [m11-ven.yaml](m11-ven.yaml) | vigente | M13, T10 |
| EVT-CMP-01 | `cmp.supplier.created` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | M06, M14, M15 |
| EVT-CMP-01 | `cmp.supplier.updated` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | M06, M14, M15 |
| EVT-CMP-02 | `cmp.supplier.bankAccountApproved` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | M14 |
| EVT-CMP-03 | `cmp.supplyRequest.approved` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | M10, M13, T09 |
| EVT-CMP-03 | `cmp.supplyRequest.cancelled` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | M10, M13, T09 |
| EVT-CMP-04 | `cmp.purchaseOrder.approved` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | M14, M15, T09 |
| EVT-CMP-05 | `cmp.purchaseOrder.cancelled` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | M14, M15 |
| EVT-CMP-05 | `cmp.purchaseOrder.closed` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | M14, M15 |
| EVT-CMP-06 | `cmp.receipt.confirmed` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | M13, M15 |
| EVT-CMP-07 | `cmp.receipt.voided` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | M13, M15 |
| EVT-CMP-08 | `cmp.supplierInvoice.registered` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | M06, M15, M14, M13, M18 |
| EVT-CMP-09 | `cmp.supplierInvoice.released` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | M14, M06, M15, M18 |
| EVT-CMP-09 | `cmp.supplierInvoice.voided` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | M14, M06, M15, M18 |
| EVT-CMP-10 | `cmp.matchException.raised` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | T11, T09, M13 |
| EVT-CMP-10 | `cmp.matchException.decided` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | T11, T09, M13 |
| EVT-CMP-11 | `cmp.paymentOrder.approved` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | M14, M06, M15 |
| EVT-CMP-12 | `cmp.paymentOrder.cancelled` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | M14, M06, M15 |
| EVT-CMP-13 | `cmp.paymentOrder.paid` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | T09, M16 |
| EVT-CMP-14 | `cmp.portalSubmission.received` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | T09 |
| EVT-CMP-14 | `cmp.portalSubmission.decided` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | T09 |
| EVT-CMP-15 | `cmp.paymentOrder.prepared` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | M06 |
| EVT-CMP-16 | `cmp.supplyBalance.approved` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | M03, M06, T10 |
| EVT-CMP-17 | `cmp.signalRightsSettlement.approved` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | M15, M14, T10 |
| EVT-CMP-17 | `cmp.signalRightsSettlement.voided` | M12 | [m12-cmp.yaml](m12-cmp.yaml) | vigente | M15, M14, T10 |
| EVT-STK-01 | `stk.goods.received` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M15, M12, M18 |
| EVT-STK-02 | `stk.materials.consumed` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M15, M10, T10, M18 |
| EVT-STK-03 | `stk.custody.transferred` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M10, T10 |
| EVT-STK-04 | `stk.equipment.applied` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M10, M02, M19, M15, M03 |
| EVT-STK-05 | `stk.equipment.retrieved` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M10, M02, M15 |
| EVT-STK-06 | `stk.equipment.swapped` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M10, M02 |
| EVT-STK-07 | `stk.equipment.returnOverdue` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M09, T09, M02, M04 |
| EVT-STK-08 | `stk.equipment.chargeProposed` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M05, T11, M04 |
| EVT-STK-08 | `stk.equipment.chargeApproved` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M05, T11, M04 |
| EVT-STK-09 | `stk.equipment.sold` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M15 |
| EVT-STK-10 | `stk.reservation.created` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M10, M11 |
| EVT-STK-10 | `stk.reservation.released` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M10, M11 |
| EVT-STK-10 | `stk.reservation.expired` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M10, M11 |
| EVT-STK-11 | `stk.adjustment.posted` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M15 |
| EVT-STK-12 | `stk.item.belowMinimum` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M12, T09 |
| EVT-STK-13 | `stk.reorder.suggested` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M12 |
| EVT-STK-14 | `stk.valuation.changed` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M15 |
| EVT-STK-15 | `stk.period.closed` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M15, T04 |
| EVT-STK-15 | `stk.period.reopened` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M15, T04 |
| EVT-STK-16 | `stk.physicalCount.closed` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M15, T10 |
| EVT-STK-17 | `stk.fixedAsset.registered` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M15 |
| EVT-STK-17 | `stk.fixedAsset.disposed` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M15 |
| EVT-STK-17 | `stk.fixedAsset.valueChanged` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M15 |
| EVT-STK-18 | `stk.depreciation.posted` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M15 |
| EVT-STK-18 | `stk.depreciation.reversed` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M15 |
| EVT-STK-19 | `stk.rma.statusChanged` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | T09, M12 |
| EVT-STK-20 | `stk.manufacturing.inProcess` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M15, M11 |
| EVT-STK-20 | `stk.manufacturing.finished` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M15, M11 |
| EVT-STK-21 | `stk.fieldConflict.raised` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M10, T11 |
| EVT-STK-21 | `stk.fieldConflict.resolved` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M10, T11 |
| EVT-STK-22 | `stk.crewSettlement.closed` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M15, M16 |
| EVT-STK-23 | `stk.reservation.failed` | M13 | [m13-stk-p1.yaml](m13-stk-p1.yaml) | vigente | M10, M11 |
| EVT-STK-24 | `stk.goods.rejected` | M13 | [m13-stk-p2.yaml](m13-stk-p2.yaml) | vigente | M12 |
| EVT-TES-01 | `tes.operation.posted` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M15, T10, M06 |
| EVT-TES-02 | `tes.operation.voided` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M15 |
| EVT-TES-03 | `tes.account.created` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M15, T10 |
| EVT-TES-03 | `tes.account.closed` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M15, T10 |
| EVT-TES-04 | `tes.statement.imported` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M14 |
| EVT-TES-05 | `tes.reconciliation.closed` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M15 |
| EVT-TES-05 | `tes.reconciliation.reopened` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M15 |
| EVT-TES-06 | `tes.statementLine.unidentified` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M07 |
| EVT-TES-07 | `tes.gatewayCredit.reconciled` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M07 |
| EVT-TES-08 | `tes.cashRemittance.accepted` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M07, M15 |
| EVT-TES-08 | `tes.cashRemittance.observed` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M07, M15 |
| EVT-TES-08 | `tes.cashRemittance.voided` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M07, M15 |
| EVT-TES-09 | `tes.deposit.registered` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M15 |
| EVT-TES-09 | `tes.deposit.credited` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M15 |
| EVT-TES-10 | `tes.thirdPartyCheck.stateChanged` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M07, M12, M15 |
| EVT-TES-10 | `tes.thirdPartyCheck.rejected` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M07, M12, M15 |
| EVT-TES-11 | `tes.ownCheck.issued` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M15, M12 |
| EVT-TES-11 | `tes.ownCheck.debited` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M15, M12 |
| EVT-TES-11 | `tes.ownCheck.voided` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M15, M12 |
| EVT-TES-12 | `tes.echeq.stateChanged` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M12, M07 |
| EVT-TES-13 | `tes.cardVoucher.presented` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M12, M07, M15 |
| EVT-TES-13 | `tes.cardSettlement.recorded` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M12, M07, M15 |
| EVT-TES-13 | `tes.cardVoucher.rejected` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M12, M07, M15 |
| EVT-TES-14 | `tes.receivedWithholding.registered` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M06, M15 |
| EVT-TES-14 | `tes.receivedWithholding.presented` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M06, M15 |
| EVT-TES-14 | `tes.receivedWithholding.presentationVoided` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M06, M15 |
| EVT-TES-15 | `tes.paymentExecution.signed` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M12, M06, M07, M15, M17, M18 |
| EVT-TES-15 | `tes.paymentExecution.executed` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M12, M06, M07, M15, M17, M18 |
| EVT-TES-15 | `tes.paymentExecution.rejected` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M12, M06, M07, M15, M17, M18 |
| EVT-TES-15 | `tes.paymentExecution.voided` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M12, M06, M07, M15, M17, M18 |
| EVT-TES-16 | `tes.paymentFile.generated` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | T06, M16 |
| EVT-TES-16 | `tes.paymentFile.sent` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | T06, M16 |
| EVT-TES-16 | `tes.paymentFile.responseReceived` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | T06, M16 |
| EVT-TES-17 | `tes.payrollPayment.confirmed` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M16 |
| EVT-TES-17 | `tes.payrollPayment.rejected` | M14 | [m14-tes-p1.yaml](m14-tes-p1.yaml) | vigente | M16 |
| EVT-TES-18 | `tes.cashClosing.closed` | M14 | [m14-tes-p2.yaml](m14-tes-p2.yaml) | vigente | M15 |
| EVT-TES-18 | `tes.cashClosing.reopened` | M14 | [m14-tes-p2.yaml](m14-tes-p2.yaml) | vigente | M15 |
| EVT-TES-19 | `tes.exchangeRate.published` | M14 | [m14-tes-p2.yaml](m14-tes-p2.yaml) | vigente | M05, M07, M12, M15, M04, T11 |
| EVT-TES-20 | `tes.commitment.created` | M14 | [m14-tes-p2.yaml](m14-tes-p2.yaml) | vigente | M15 |
| EVT-TES-20 | `tes.commitment.consumed` | M14 | [m14-tes-p2.yaml](m14-tes-p2.yaml) | vigente | M15 |
| EVT-TES-20 | `tes.commitment.released` | M14 | [m14-tes-p2.yaml](m14-tes-p2.yaml) | vigente | M15 |
| EVT-TES-21 | `tes.cashFlow.alertRaised` | M14 | [m14-tes-p2.yaml](m14-tes-p2.yaml) | vigente | T09 |
| EVT-TES-22 | `tes.period.closed` | M14 | [m14-tes-p2.yaml](m14-tes-p2.yaml) | vigente | M15, T04 |
| EVT-TES-22 | `tes.period.reopened` | M14 | [m14-tes-p2.yaml](m14-tes-p2.yaml) | vigente | M15, T04 |
| EVT-TES-23 | `tes.advance.paid` | M14 | [m14-tes-p2.yaml](m14-tes-p2.yaml) | vigente | M16 |
| EVT-TES-24 | `tes.bankSync.requested` | M14 | [m14-tes-p2.yaml](m14-tes-p2.yaml) | vigente | T06 |
| EVT-TES-25 | `tes.paymentFile.requested` | M14 | [m14-tes-p2.yaml](m14-tes-p2.yaml) | vigente | T06 |
| EVT-CON-01 | `con.entry.posted` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | M13, M12, M14, M16, M17, M06, T10, M15 |
| EVT-CON-02 | `con.entry.reversed` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | M13, M02, M03, M06, M07, M08, M10, M11, M12, M14, M16, M17, M18, T10 |
| EVT-CON-03 | `con.entry.voided` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | M13, M02, M03, M06, M07, M08, M10, M11, M12, M14, M16, M17, M18, T10 |
| EVT-CON-04 | `con.event.pendingConfiguration` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | T09, T11 |
| EVT-CON-05 | `con.event.failed` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | T09, T08, M16, M17, T11 |
| EVT-CON-06 | `con.period.locked` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | M02, M03, M06, M07, M08, M10, M11, M12, M13, M14, M16, M17, M18, T04 |
| EVT-CON-06 | `con.period.unlocked` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | M02, M03, M06, M07, M08, M10, M11, M12, M13, M14, M16, M17, M18, T04 |
| EVT-CON-07 | `con.period.closed` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | M02, M03, M06, M07, M08, M10, M11, M12, M13, M14, M16, M17, M18, T10 |
| EVT-CON-08 | `con.period.reopened` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | M02, M03, M06, M07, M08, M10, M11, M12, M13, M14, M16, M17, M18, T10 |
| EVT-CON-09 | `con.fiscalYear.closed` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | M17, T10 |
| EVT-CON-09 | `con.fiscalYear.reopened` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | M17, T10 |
| EVT-CON-10 | `con.chart.approved` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | M06, M07, M08, M10, M16, M17 |
| EVT-CON-10 | `con.chart.promoted` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | M06, M07, M08, M10, M16, M17 |
| EVT-CON-11 | `con.config.published` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | M15 |
| EVT-CON-12 | `con.inflationAdjustment.posted` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | T10 |
| EVT-CON-13 | `con.reconciliation.differenceDetected` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | T09 |
| EVT-CON-14 | `con.budget.approved` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | M12, M14, M16, T10 |
| EVT-CON-14 | `con.budget.reformulated` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | M12, M14, M16, T10 |
| EVT-CON-15 | `con.commitment.exceeded` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | M12, T11 |
| EVT-CON-15 | `con.commitment.excessAuthorized` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | M12, T11 |
| EVT-CON-16 | `con.simulation.completed` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | T09 |
| EVT-CON-17 | `con.export.completed` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | T06 |
| EVT-CON-17 | `con.export.failed` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | T06 |
| EVT-CON-18 | `con.statements.issued` | M15 | [m15-con.yaml](m15-con.yaml) | vigente | M17, M19, T10 |
| EVT-SUE-01 | `sue.employee.hired` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | T02, M10, T09 |
| EVT-SUE-02 | `sue.employee.assignmentChanged` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | M10, T10, T11 |
| EVT-SUE-03 | `sue.employee.terminated` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | T02, M13, M10, T09, T11 |
| EVT-SUE-04 | `sue.employee.reinstated` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | T02, M10 |
| EVT-SUE-05 | `sue.payrollConfig.published` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | T10 |
| EVT-SUE-06 | `sue.salaryScale.published` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | M16, M15 |
| EVT-SUE-07 | `sue.novelty.approved` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | T10 |
| EVT-SUE-08 | `sue.leave.requested` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | T09, M10, T11 |
| EVT-SUE-08 | `sue.leave.approved` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | T09, M10, T11 |
| EVT-SUE-08 | `sue.leave.rejected` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | T09, M10, T11 |
| EVT-SUE-09 | `sue.payrollRun.calculated` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | T09 |
| EVT-SUE-10 | `sue.payrollRun.submitted` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | T11 |
| EVT-SUE-11 | `sue.payrollRun.approved` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | M15, T10 |
| EVT-SUE-12 | `sue.payrollRun.voided` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | M15 |
| EVT-SUE-13 | `sue.payrollRun.closed` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | T10, M06 |
| EVT-SUE-14 | `sue.payslip.issued` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | T09, M19 |
| EVT-SUE-15 | `sue.payslip.acknowledged` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | T10 |
| EVT-SUE-16 | `sue.payslip.voided` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | T09 |
| EVT-SUE-17 | `sue.paymentRequest.created` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | M14 |
| EVT-SUE-18 | `sue.filing.generated` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | M14, T10 |
| EVT-SUE-18 | `sue.filing.filed` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | M14, T10 |
| EVT-SUE-19 | `sue.incomeTax.annualSettled` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | T09 |
| EVT-SUE-20 | `sue.termination.approved` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | M13, T02, M16 |
| EVT-SUE-21 | `sue.certificate.issued` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | T09 |
| EVT-SUE-22 | `sue.accident.reported` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | T09, T10 |
| EVT-SUE-23 | `sue.lawsuit.provisionChanged` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | M15, M08 |
| EVT-SUE-24 | `sue.externalPayroll.approved` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | M15, M14 |
| EVT-SUE-25 | `sue.laborCost.projected` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | M15 |
| EVT-SUE-26 | `sue.serviceDebt.deducted` | M16 | [m16-sue-p1.yaml](m16-sue-p1.yaml) | vigente | M07 |
| EVT-SUE-27 | `sue.paymentRequest.cancelled` | M16 | [m16-sue-p2.yaml](m16-sue-p2.yaml) | vigente | M14 |
| EVT-SUE-28 | `sue.payrollFiles.requested` | M16 | [m16-sue-p2.yaml](m16-sue-p2.yaml) | vigente | T06 |
| EVT-INS-01 | `ins.membership.requested` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | T09, T11 |
| EVT-INS-02 | `ins.membership.approved` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | M01, M04, M05, M19, T09 |
| EVT-INS-03 | `ins.membership.rejected` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | T09 |
| EVT-INS-04 | `ins.membership.suspended` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | M19, M01 |
| EVT-INS-04 | `ins.membership.reinstated` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | M19, M01 |
| EVT-INS-05 | `ins.membership.exitRequested` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | T11 |
| EVT-INS-06 | `ins.membership.exited` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | M01, M04, M05, M18, M19 |
| EVT-INS-07 | `ins.member.withoutServices` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | T11 |
| EVT-INS-08 | `ins.capitalMovement.recorded` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | M15, M19 |
| EVT-INS-09 | `ins.capitalMovement.reversed` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | M15 |
| EVT-INS-10 | `ins.capitalTransfer.executed` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | M15, M01 |
| EVT-INS-11 | `ins.capitalRefund.approved` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | M14, M05 |
| EVT-INS-12 | `ins.capitalRefund.paid` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | M15, T09 |
| EVT-INS-13 | `ins.surplusDistribution.approved` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | M15, M07, M14 |
| EVT-INS-13 | `ins.surplusDistribution.executed` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | M15, M07, M14 |
| EVT-INS-14 | `ins.meeting.convened` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | T09, M19, T11 |
| EVT-INS-15 | `ins.meeting.closed` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | T11 |
| EVT-INS-16 | `ins.minute.signed` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | T11 |
| EVT-INS-17 | `ins.resolution.created` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | M09, M17 |
| EVT-INS-18 | `ins.roster.finalized` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | M19, T09 |
| EVT-INS-19 | `ins.mandate.started` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | T02, M17, T11 |
| EVT-INS-19 | `ins.mandate.ended` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | T02, M17, T11 |
| EVT-INS-20 | `ins.fee.settled` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | M14, M15, M06 |
| EVT-INS-21 | `ins.inaesReport.submitted` | M17 | [m17-ins.yaml](m17-ins.yaml) | vigente | T11 |
| EVT-SOC-01 | `soc.dependent.added` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M04, M19, M17 |
| EVT-SOC-01 | `soc.dependent.ended` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M04, M19, M17 |
| EVT-SOC-01 | `soc.dependent.categoryChanged` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M04, M19, M17 |
| EVT-SOC-01 | `soc.dependent.restored` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M04, M19, M17 |
| EVT-SOC-02 | `soc.dependent.majorityReached` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | T09 |
| EVT-SOC-03 | `soc.benefitRequest.decided` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M04, M05, T09, M19 |
| EVT-SOC-04 | `soc.deathSubsidy.approved` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M14, M15 |
| EVT-SOC-05 | `soc.burialRight.formalized` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M02, M04, M19, M15 |
| EVT-SOC-05 | `soc.burialRight.holderChanged` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M02, M04, M19, M15 |
| EVT-SOC-05 | `soc.burialRight.extinguished` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M02, M04, M19, M15 |
| EVT-SOC-06 | `soc.cemeteryAct.performed` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M05, M19, M04, T09 |
| EVT-SOC-07 | `soc.trip.completed` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M04, M05, M15 |
| EVT-SOC-08 | `soc.housing.allocated` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M04, M05, M07, M19 |
| EVT-SOC-08 | `soc.housing.delivered` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M04, M05, M07, M19 |
| EVT-SOC-08 | `soc.housing.terminated` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M04, M05, M07, M19 |
| EVT-SOC-08 | `soc.housing.transferred` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M04, M05, M07, M19 |
| EVT-SOC-08 | `soc.housing.planChanged` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M04, M05, M07, M19 |
| EVT-SOC-09 | `soc.housing.materialWithdrawn` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M13, M15 |
| EVT-SOC-09 | `soc.housing.materialReturned` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M13, M15 |
| EVT-SOC-10 | `soc.housing.certificateLiquidated` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M12, M14, M15 |
| EVT-SOC-11 | `soc.housing.priceUpdated` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M04 |
| EVT-SOC-12 | `soc.vehicle.usageRecorded` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M15, M10, M16 |
| EVT-SOC-13 | `soc.vehicle.unfit` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M10 |
| EVT-SOC-13 | `soc.vehicle.fit` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M10 |
| EVT-SOC-14 | `soc.tripSettlement.approved` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M16, M15 |
| EVT-SOC-15 | `soc.driver.timeReported` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M16 |
| EVT-SOC-16 | `soc.agreementCost.recorded` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M12, M15 |
| EVT-SOC-17 | `soc.vehicle.usageVoided` | M18 | [m18-soc.yaml](m18-soc.yaml) | vigente | M15, M16, M10 |
| EVT-POR-01 | `por.accountAccess.granted` | M19 | [m19-por.yaml](m19-por.yaml) | vigente | T09, T02, T10 |
| EVT-POR-02 | `por.accountAccess.revoked` | M19 | [m19-por.yaml](m19-por.yaml) | vigente | T09, T10 |
| EVT-POR-03 | `por.accountAccess.expired` | M19 | [m19-por.yaml](m19-por.yaml) | vigente | T09 |
| EVT-POR-04 | `por.accountAccess.suspended` | M19 | [m19-por.yaml](m19-por.yaml) | vigente | T09 |
| EVT-POR-05 | `por.linkAttempt.blocked` | M19 | [m19-por.yaml](m19-por.yaml) | vigente | T02, T09 |
| EVT-POR-06 | `por.delegation.invited` | M19 | [m19-por.yaml](m19-por.yaml) | vigente | T09 |
| EVT-POR-06 | `por.delegation.accepted` | M19 | [m19-por.yaml](m19-por.yaml) | vigente | T09 |
| EVT-POR-06 | `por.delegation.revoked` | M19 | [m19-por.yaml](m19-por.yaml) | vigente | T09 |
| EVT-POR-07 | `por.formSubmission.submitted` | M19 | [m19-por.yaml](m19-por.yaml) | vigente | M09, T09, T10 |
| EVT-POR-08 | `por.formSubmission.accepted` | M19 | [m19-por.yaml](m19-por.yaml) | vigente | T09, T10 |
| EVT-POR-08 | `por.formSubmission.rejected` | M19 | [m19-por.yaml](m19-por.yaml) | vigente | T09, T10 |
| EVT-POR-08 | `por.formSubmission.cancelled` | M19 | [m19-por.yaml](m19-por.yaml) | vigente | T09, T10 |
| EVT-POR-09 | `por.publicSubmission.received` | M19 | [m19-por.yaml](m19-por.yaml) | vigente | M09, T09 |
| EVT-POR-10 | `por.publicSubmission.receiptIssued` | M19 | [m19-por.yaml](m19-por.yaml) | vigente | T09, T10 |
| EVT-POR-11 | `por.publicSubmission.deadlineAtRisk` | M19 | [m19-por.yaml](m19-por.yaml) | vigente | M09, T09 |
| EVT-POR-12 | `por.landing.published` | M19 | [m19-por.yaml](m19-por.yaml) | vigente | T10 |
| EVT-POR-13 | `por.legacyImport.completed` | M19 | [m19-por.yaml](m19-por.yaml) | vigente | T07, T10 |
| EVT-POR-14 | `por.legacyUser.activated` | M19 | [m19-por.yaml](m19-por.yaml) | vigente | T10 |
| EVT-POR-15 | `por.memberView.opened` | M19 | [m19-por.yaml](m19-por.yaml) | vigente | T02 |
| EVT-POR-16 | `por.kiosk.statusChanged` | M19 | [m19-por.yaml](m19-por.yaml) | vigente | M07, T09 |
| EVT-PLA-01 | `pla.tenant.created` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T02, T03, T09, T01, T04, M01 |
| EVT-PLA-02 | `pla.tenant.statusChanged` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T02, T10, T09 |
| EVT-PLA-03 | `pla.tenant.suspended` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T11, T09, M19 |
| EVT-PLA-04 | `pla.tenant.reactivated` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T11, T09 |
| EVT-PLA-05 | `pla.tenant.closed` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T02, T06, T09 |
| EVT-PLA-06 | `pla.capability.activated` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T03, T09, T04, T02, T11 |
| EVT-PLA-07 | `pla.capability.deactivated` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T03, T04, T02, M02, T11 |
| EVT-PLA-08 | `pla.license.updated` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T01, T09, T02, M02, T03, T10 |
| EVT-PLA-09 | `pla.saasContract.approved` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T01, M15 |
| EVT-PLA-10 | `pla.usage.thresholdReached` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T01, T09 |
| EVT-PLA-11 | `pla.supportCase.opened` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T09, T01 |
| EVT-PLA-11 | `pla.supportCase.updated` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T09, T01 |
| EVT-PLA-11 | `pla.supportCase.resolved` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T09, T01 |
| EVT-PLA-12 | `pla.supportGrant.requested` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T02, T09, T01 |
| EVT-PLA-12 | `pla.supportGrant.approved` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T02, T09, T01 |
| EVT-PLA-12 | `pla.supportGrant.activated` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T02, T09, T01 |
| EVT-PLA-12 | `pla.supportGrant.revoked` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T02, T09, T01 |
| EVT-PLA-12 | `pla.supportGrant.expired` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T02, T09, T01 |
| EVT-PLA-13 | `pla.backup.completed` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T01 |
| EVT-PLA-13 | `pla.backup.failed` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T01 |
| EVT-PLA-14 | `pla.restore.requested` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | M06, M10, T09 |
| EVT-PLA-14 | `pla.restore.completed` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | M06, M10, T09 |
| EVT-PLA-15 | `pla.sandbox.created` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T09 |
| EVT-PLA-16 | `pla.release.deployed` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T09 |
| EVT-PLA-17 | `pla.alert.raised` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T09 |
| EVT-PLA-17 | `pla.alert.resolved` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T09 |
| EVT-PLA-18 | `pla.tenantExport.ready` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T09 |
| EVT-PLA-19 | `pla.incident.updated` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T01, T09 |
| EVT-PLA-20 | `pla.checklist.changed` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T09, T10 |
| EVT-PLA-21 | `pla.branch.created` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | reemplazado por EVT-CFG-20 | T03, T04 |
| EVT-PLA-21 | `pla.branch.updated` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | reemplazado por EVT-CFG-20 | T03, T04 |
| EVT-PLA-22 | `pla.tenantProfile.updated` | T01 | [t01-pla-p1.yaml](t01-pla-p1.yaml) | vigente | T03, T11, M06 |
| EVT-IAM-01 | `iam.identity.created` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09, M01, M19 |
| EVT-IAM-01 | `iam.identity.activated` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09, M01, M19 |
| EVT-IAM-02 | `iam.identity.locked` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09 |
| EVT-IAM-02 | `iam.identity.unlocked` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09 |
| EVT-IAM-03 | `iam.membership.invited` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09, T11, M19, M10, M16, T10 |
| EVT-IAM-03 | `iam.membership.activated` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09, T11, M19, M10, M16, T10 |
| EVT-IAM-03 | `iam.membership.suspended` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09, T11, M19, M10, M16, T10 |
| EVT-IAM-03 | `iam.membership.revoked` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09, T11, M19, M10, M16, T10 |
| EVT-IAM-04 | `iam.role.assigned` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T02, T09, T11, T03, T10 |
| EVT-IAM-04 | `iam.role.unassigned` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T02, T09, T11, T03, T10 |
| EVT-IAM-05 | `iam.role.changed` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T02, T03, T10, T11 |
| EVT-IAM-05 | `iam.profile.changed` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T02, T03, T10, T11 |
| EVT-IAM-06 | `iam.session.started` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T10 |
| EVT-IAM-06 | `iam.session.revoked` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T10 |
| EVT-IAM-07 | `iam.login.failed` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T08 |
| EVT-IAM-08 | `iam.mfa.enrolled` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09 |
| EVT-IAM-08 | `iam.mfa.removed` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09 |
| EVT-IAM-09 | `iam.password.changed` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09 |
| EVT-IAM-09 | `iam.password.resetCompleted` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09 |
| EVT-IAM-10 | `iam.authorization.requested` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09, T02, M01, M02, M07, M08, T11 |
| EVT-IAM-10 | `iam.authorization.granted` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09, T02, M01, M02, M07, M08, T11 |
| EVT-IAM-10 | `iam.authorization.rejected` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09, T02, M01, M02, M07, M08, T11 |
| EVT-IAM-10 | `iam.authorization.expired` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09, T02, M01, M02, M07, M08, T11 |
| EVT-IAM-10 | `iam.authorization.consumed` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09, T02, M01, M02, M07, M08, T11 |
| EVT-IAM-11 | `iam.supportAccess.requested` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09, T01 |
| EVT-IAM-11 | `iam.supportAccess.granted` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09, T01 |
| EVT-IAM-11 | `iam.supportAccess.started` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09, T01 |
| EVT-IAM-11 | `iam.supportAccess.ended` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09, T01 |
| EVT-IAM-11 | `iam.supportAccess.revoked` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09, T01 |
| EVT-IAM-12 | `iam.apiClient.created` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T10 |
| EVT-IAM-12 | `iam.apiClient.credentialRotated` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T10 |
| EVT-IAM-12 | `iam.apiClient.revoked` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T10 |
| EVT-IAM-13 | `iam.idp.activated` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T10 |
| EVT-IAM-13 | `iam.idp.disabled` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T10 |
| EVT-IAM-14 | `iam.securityAlert.raised` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T09, T01 |
| EVT-IAM-15 | `iam.portal.accountLinked` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | M01, M19, M16 |
| EVT-IAM-15 | `iam.portal.accountUnlinked` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | M01, M19, M16 |
| EVT-IAM-16 | `iam.audit.integrityFailed` | T02 | [t02-iam-p1.yaml](t02-iam-p1.yaml) | vigente | T08, T09 |
| EVT-CFG-01 | `cfg.configVersion.created` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | T10 |
| EVT-CFG-02 | `cfg.configVersion.submitted` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | T11 |
| EVT-CFG-03 | `cfg.configVersion.approved` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | T09 |
| EVT-CFG-03 | `cfg.configVersion.rejected` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | T09 |
| EVT-CFG-04 | `cfg.configVersion.scheduled` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | T10 |
| EVT-CFG-05 | `cfg.configVersion.published` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | M01, M19, T01, T02, T03, T06, T07, T08, T09, T10, T11, M02, M04, M05 |
| EVT-CFG-06 | `cfg.configVersion.failed` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | T09 |
| EVT-CFG-06 | `cfg.configVersion.cancelled` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | T09 |
| EVT-CFG-06 | `cfg.configVersion.rolledBack` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | T09 |
| EVT-CFG-07 | `cfg.parameter.changed` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | M01, M19, T01, T02, T03, T06, T07, T08, T09, T10, T11, M04 |
| EVT-CFG-08 | `cfg.masterRecord.changed` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | M01, M19, T09, T10 |
| EVT-CFG-09 | `cfg.masterRecord.merged` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | M01, M03, M10 |
| EVT-CFG-10 | `cfg.platformTable.updated` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | M06, M08, M16 |
| EVT-CFG-11 | `cfg.holiday.changed` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | M05, M08, M09, M10, T11 |
| EVT-CFG-12 | `cfg.economicIndex.valuePublished` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | M08, M15, M05, M14, M04, M13 |
| EVT-CFG-12 | `cfg.economicIndex.valueRevised` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | M08, M15, M05, M14, M04, M13 |
| EVT-CFG-13 | `cfg.taxRegistry.imported` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | M06 |
| EVT-CFG-14 | `cfg.geo.streetProposed` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | M01, T09 |
| EVT-CFG-14 | `cfg.geo.streetDecided` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | M01, T09 |
| EVT-CFG-15 | `cfg.geoReference.updated` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | M01, M10, T10 |
| EVT-CFG-16 | `cfg.customField.defined` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | T04, M01, M02, M09, M10, M12, M13, M16, T10, T11 |
| EVT-CFG-16 | `cfg.customField.deprecated` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | T04, M01, M02, M09, M10, M12, M13, M16, T10, T11 |
| EVT-CFG-17 | `cfg.seedPack.applied` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | T01 |
| EVT-CFG-17 | `cfg.seedPack.removed` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | T01 |
| EVT-CFG-18 | `cfg.integrity.issueDetected` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | T01, T09 |
| EVT-CFG-19 | `cfg.legalEntity.created` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | M06, M05, M15, M14, M16, T03, T10 |
| EVT-CFG-19 | `cfg.legalEntity.updated` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | M06, M05, M15, M14, M16, T03, T10 |
| EVT-CFG-19 | `cfg.legalEntity.deactivated` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | M06, M05, M15, M14, M16, T03, T10 |
| EVT-CFG-20 | `cfg.branch.created` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | T02, T03, M06, M07, M09, M13 |
| EVT-CFG-20 | `cfg.branch.updated` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | T02, T03, M06, M07, M09, M13 |
| EVT-CFG-20 | `cfg.branch.deactivated` | T04 | [t04-cfg-p1.yaml](t04-cfg-p1.yaml) | vigente | T02, T03, M06, M07, M09, M13 |
| EVT-INT-01 | `int.connection.activated` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M03, M06, M07, M09, M10, M14, T09, T11, T01, T02 |
| EVT-INT-01 | `int.connection.suspended` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M03, M06, M07, M09, M10, M14, T09, T11, T01, T02 |
| EVT-INT-01 | `int.connection.modeChanged` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M03, M06, M07, M09, M10, M14, T09, T11, T01, T02 |
| EVT-INT-02 | `int.connection.blocked` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M05, M06, M07, T09 |
| EVT-INT-03 | `int.operation.succeeded` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M03, M06, M07, M09, M10, M14, T09, T11 |
| EVT-INT-03 | `int.operation.failed` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M03, M06, M07, M09, M10, M14, T09, T11 |
| EVT-INT-03 | `int.operation.uncertain` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M03, M06, M07, M09, M10, M14, T09, T11 |
| EVT-INT-03 | `int.operation.manuallyResolved` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M03, M06, M07, M09, M10, M14, T09, T11 |
| EVT-INT-03 | `int.operation.cancelled` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M03, M06, M07, M09, M10, M14, T09, T11 |
| EVT-INT-04 | `int.circuit.opened` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | T11, M07, T09, T06 |
| EVT-INT-04 | `int.circuit.closed` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | T11, M07, T09, T06 |
| EVT-INT-05 | `int.certificate.expiring` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | T09, T04 |
| EVT-INT-05 | `int.certificate.expired` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | T09, T04 |
| EVT-INT-05 | `int.credential.expiring` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | T09, T04 |
| EVT-INT-05 | `int.credential.rotated` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | T09, T04 |
| EVT-INT-06 | `int.arca.caeObtained` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M05, M06 |
| EVT-INT-06 | `int.arca.caeRejected` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M05, M06 |
| EVT-INT-06 | `int.arca.caeaObtained` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M05, M06 |
| EVT-INT-06 | `int.arca.caeaInformed` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M05, M06 |
| EVT-INT-06 | `int.arca.paramsSynced` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M05, M06 |
| EVT-INT-07 | `int.padron.personaRetrieved` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M01, M12 |
| EVT-INT-08 | `int.paymentIntent.created` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M07, M19 |
| EVT-INT-08 | `int.payment.confirmed` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M07, M19 |
| EVT-INT-08 | `int.payment.rejected` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M07, M19 |
| EVT-INT-08 | `int.payment.reversed` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M07, M19 |
| EVT-INT-08 | `int.payment.refunded` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M07, M19 |
| EVT-INT-08 | `int.payment.unmatched` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M07, M19 |
| EVT-INT-09 | `int.debtPublication.acknowledged` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M07 |
| EVT-INT-09 | `int.debtPublication.rejected` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M07 |
| EVT-INT-10 | `int.remittance.lineReceived` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M07 |
| EVT-INT-10 | `int.remittance.fileApplied` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M07 |
| EVT-INT-11 | `int.directDebit.adhesionUpdated` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M07, M01 |
| EVT-INT-11 | `int.directDebit.resultReceived` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M07, M01 |
| EVT-INT-12 | `int.bank.movementsReceived` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M14 |
| EVT-INT-12 | `int.bank.balancesReceived` | T06 | [t06-int-p1.yaml](t06-int-p1.yaml) | vigente | M14 |
| EVT-INT-13 | `int.message.sent` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | T09, M09 |
| EVT-INT-13 | `int.message.delivered` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | T09, M09 |
| EVT-INT-13 | `int.message.read` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | T09, M09 |
| EVT-INT-13 | `int.message.bounced` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | T09, M09 |
| EVT-INT-13 | `int.message.failed` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | T09, M09 |
| EVT-INT-13 | `int.message.inboundReceived` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | T09, M09 |
| EVT-INT-14 | `int.meter.readingReceived` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | M03, M08, M10 |
| EVT-INT-14 | `int.meter.commandResult` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | M03, M08, M10 |
| EVT-INT-14 | `int.prepaid.creditIssued` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | M03, M08, M10 |
| EVT-INT-15 | `int.network.provisioningResult` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | M10, M08 |
| EVT-INT-16 | `int.cdr.batchReceived` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | M10, M04 |
| EVT-INT-17 | `int.fleet.positionsReceived` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | M18 |
| EVT-INT-18 | `int.signature.completed` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | T11, M16, M08, M12 |
| EVT-INT-18 | `int.signature.rejected` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | T11, M16, M08, M12 |
| EVT-INT-19 | `int.file.generated` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | M03, M06, M07, M14 |
| EVT-INT-19 | `int.file.delivered` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | M03, M06, M07, M14 |
| EVT-INT-19 | `int.file.received` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | M03, M06, M07, M14 |
| EVT-INT-19 | `int.file.rejected` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | M03, M06, M07, M14 |
| EVT-INT-20 | `int.reconciliation.closed` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | M07, M14, M06 |
| EVT-INT-20 | `int.reconciliation.differencesFound` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | M07, M14, M06 |
| EVT-INT-21 | `int.contingency.started` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | M05, M06, M07 |
| EVT-INT-21 | `int.contingency.ended` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | M05, M06, M07 |
| EVT-INT-22 | `int.agent.online` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | M09, M07, M11 |
| EVT-INT-22 | `int.agent.offline` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | M09, M07, M11 |
| EVT-INT-22 | `int.agent.commandResult` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | M09, M07, M11 |
| EVT-INT-23 | `int.ai.completionReady` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | T09, M09, T10 |
| EVT-INT-24 | `int.serviceUsage.received` | T06 | [t06-int-p2.yaml](t06-int-p2.yaml) | vigente | M10, M04 |
| EVT-MIG-01 | `mig.snapshot.ready` | T07 | [t07-mig.yaml](t07-mig.yaml) | vigente | T07, T04 |
| EVT-MIG-02 | `mig.run.started` | T07 | [t07-mig.yaml](t07-mig.yaml) | vigente | T09, T02 |
| EVT-MIG-02 | `mig.run.loaded` | T07 | [t07-mig.yaml](t07-mig.yaml) | vigente | T09, T02 |
| EVT-MIG-02 | `mig.run.failed` | T07 | [t07-mig.yaml](t07-mig.yaml) | vigente | T09, T02 |
| EVT-MIG-02 | `mig.run.accepted` | T07 | [t07-mig.yaml](t07-mig.yaml) | vigente | T09, T02 |
| EVT-MIG-03 | `mig.issue.assigned` | T07 | [t07-mig.yaml](t07-mig.yaml) | vigente | T11 |
| EVT-MIG-04 | `mig.reconciliation.approved` | T07 | [t07-mig.yaml](t07-mig.yaml) | vigente | T07, T10 |
| EVT-MIG-04 | `mig.reconciliation.rejected` | T07 | [t07-mig.yaml](t07-mig.yaml) | vigente | T07, T10 |
| EVT-MIG-05 | `mig.parallel.compared` | T07 | [t07-mig.yaml](t07-mig.yaml) | vigente | T07, T10 |
| EVT-MIG-05 | `mig.parallel.approved` | T07 | [t07-mig.yaml](t07-mig.yaml) | vigente | T07, T10 |
| EVT-MIG-06 | `mig.domain.switched` | T07 | [t07-mig.yaml](t07-mig.yaml) | vigente | M01, M19, M07, T06 |
| EVT-MIG-07 | `mig.cutover.completed` | T07 | [t07-mig.yaml](t07-mig.yaml) | vigente | M05, M06, M07, M19, T09 |
| EVT-MIG-08 | `mig.rollback.executed` | T07 | [t07-mig.yaml](t07-mig.yaml) | vigente | M01, M19, T02, T04 |
| EVT-MIG-09 | `mig.person.merged` | T07 | [t07-mig.yaml](t07-mig.yaml) | vigente | M01 |
| EVT-UXD-01 | `uxd.branding.published` | T03 | [t03-uxd.yaml](t03-uxd.yaml) | vigente | M05, T09, T11 |
| EVT-UXD-02 | `uxd.branding.reverted` | T03 | [t03-uxd.yaml](t03-uxd.yaml) | vigente | M05, T09, T11 |
| EVT-UXD-03 | `uxd.asset.processed` | T03 | [t03-uxd.yaml](t03-uxd.yaml) | vigente | T03, T10 |
| EVT-UXD-04 | `uxd.dictionary.published` | T03 | [t03-uxd.yaml](t03-uxd.yaml) | vigente | T09, M05, T10, M09, T11 |
| EVT-UXD-05 | `uxd.dictionary.reverted` | T03 | [t03-uxd.yaml](t03-uxd.yaml) | vigente | T09, M05, T10, M09, T11 |
| EVT-UXD-06 | `uxd.dictionary.missingKeyDetected` | T03 | [t03-uxd.yaml](t03-uxd.yaml) | vigente | T03, T10 |
| EVT-UXD-07 | `uxd.flag.changed` | T03 | [t03-uxd.yaml](t03-uxd.yaml) | vigente | T02 |
| EVT-UXD-08 | `uxd.catalog.updated` | T03 | [t03-uxd.yaml](t03-uxd.yaml) | vigente | T03 |
| EVT-NFR-01 | `nfr.privacyNotice.published` | T08 | [t08-nfr.yaml](t08-nfr.yaml) | vigente | M19, T09 |
| EVT-NFR-02 | `nfr.consent.granted` | T08 | [t08-nfr.yaml](t08-nfr.yaml) | vigente | T09, M09 |
| EVT-NFR-03 | `nfr.consent.revoked` | T08 | [t08-nfr.yaml](t08-nfr.yaml) | vigente | T09, T10 |
| EVT-NFR-04 | `nfr.dataSubjectRequest.received` | T08 | [t08-nfr.yaml](t08-nfr.yaml) | vigente | T09, T11 |
| EVT-NFR-05 | `nfr.dataSubjectRequest.completed` | T08 | [t08-nfr.yaml](t08-nfr.yaml) | vigente | M19, T02 |
| EVT-NFR-05 | `nfr.dataSubjectRequest.rejected` | T08 | [t08-nfr.yaml](t08-nfr.yaml) | vigente | M19, T02 |
| EVT-NFR-06 | `nfr.personData.erasureRequested` | T08 | [t08-nfr.yaml](t08-nfr.yaml) | vigente | T05, M01, M19, T01, T02, T04, T07, T08, T09, T10, T11 |
| EVT-NFR-07 | `nfr.legalHold.activated` | T08 | [t08-nfr.yaml](t08-nfr.yaml) | vigente | M01, M19, T02, T09, T10, T11 |
| EVT-NFR-07 | `nfr.legalHold.released` | T08 | [t08-nfr.yaml](t08-nfr.yaml) | vigente | M01, M19, T02, T09, T10, T11 |
| EVT-NFR-08 | `nfr.retentionRun.completed` | T08 | [t08-nfr.yaml](t08-nfr.yaml) | vigente | T02 |
| EVT-NFR-09 | `nfr.securityIncident.notified` | T08 | [t08-nfr.yaml](t08-nfr.yaml) | vigente | T09 |
| EVT-NFR-10 | `nfr.restoreDrill.completed` | T08 | [t08-nfr.yaml](t08-nfr.yaml) | vigente | T10 |
| EVT-NFR-11 | `nfr.key.rotated` | T08 | [t08-nfr.yaml](t08-nfr.yaml) | vigente | T08 |
| EVT-NFR-12 | `nfr.alert.fired` | T08 | [t08-nfr.yaml](t08-nfr.yaml) | vigente | T01, T09 |
| EVT-NFR-12 | `nfr.alert.resolved` | T08 | [t08-nfr.yaml](t08-nfr.yaml) | vigente | T01, T09 |
| EVT-NFR-13 | `nfr.invariant.violated` | T08 | [t08-nfr.yaml](t08-nfr.yaml) | vigente | T11 |
| EVT-NFR-14 | `nfr.quota.exceeded` | T08 | [t08-nfr.yaml](t08-nfr.yaml) | vigente | T01 |
| EVT-NFR-15 | `nfr.subprocessor.added` | T08 | [t08-nfr.yaml](t08-nfr.yaml) | vigente | T09 |
| EVT-NFR-16 | `nfr.file.infected` | T08 | [t08-nfr.yaml](t08-nfr.yaml) | vigente | T11 |
| EVT-NFR-17 | `nfr.auditChain.broken` | T08 | [t08-nfr.yaml](t08-nfr.yaml) | vigente | T09 |
| EVT-COM-01 | `com.post.published` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | M19, T10, T09 |
| EVT-COM-02 | `com.post.reviewRequested` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | T11, T09 |
| EVT-COM-03 | `com.post.decided` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | T09 |
| EVT-COM-04 | `com.post.archived` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | M19 |
| EVT-COM-05 | `com.comment.created` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | T10 |
| EVT-COM-06 | `com.comment.replied` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | T09 |
| EVT-COM-07 | `com.comment.moderated` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | T09, T10 |
| EVT-COM-08 | `com.mention.created` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | T09 |
| EVT-COM-09 | `com.report.created` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | T09 |
| EVT-COM-10 | `com.report.resolved` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | T09 |
| EVT-COM-11 | `com.sanction.applied` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | T09, T02 |
| EVT-COM-11 | `com.sanction.revoked` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | T09, T02 |
| EVT-COM-11 | `com.sanction.expired` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | T09, T02 |
| EVT-COM-12 | `com.sanction.appealDecided` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | T09 |
| EVT-COM-13 | `com.newsletter.issued` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | T10 |
| EVT-COM-14 | `com.survey.published` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | M19, T10 |
| EVT-COM-14 | `com.survey.closed` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | M19, T10 |
| EVT-COM-15 | `com.survey.responseSubmitted` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | M09, M10, T10 |
| EVT-COM-16 | `com.survey.criticalAlertRaised` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | M09 |
| EVT-COM-17 | `com.event.registrationChanged` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | T09, T10, T11 |
| EVT-COM-18 | `com.event.changed` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | T09, M19, T11 |
| EVT-COM-18 | `com.event.cancelled` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | T09, M19, T11 |
| EVT-COM-19 | `com.event.finished` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | T10 |
| EVT-COM-20 | `com.benefit.redemptionIssued` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | T09, T10 |
| EVT-COM-21 | `com.benefit.redeemed` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | T10 |
| EVT-COM-22 | `com.outage.published` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | M09, M19, T10 |
| EVT-COM-23 | `com.outage.started` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | M09, M19 |
| EVT-COM-24 | `com.outage.rescheduled` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | M09, M19 |
| EVT-COM-24 | `com.outage.cancelled` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | M09, M19 |
| EVT-COM-25 | `com.outage.restored` | T09 | [t09-com-p1.yaml](t09-com-p1.yaml) | vigente | M09, M19, T10 |
| EVT-COM-26 | `com.outage.criticalAffected` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | M01, M08, M09 |
| EVT-COM-27 | `com.communication.accepted` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | M05, M08, M09, M01, T02, T10, T11 |
| EVT-COM-27 | `com.communication.delivered` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | M05, M08, M09, M01, T02, T10, T11 |
| EVT-COM-27 | `com.communication.read` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | M05, M08, M09, M01, T02, T10, T11 |
| EVT-COM-27 | `com.communication.failed` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | M05, M08, M09, M01, T02, T10, T11 |
| EVT-COM-27 | `com.communication.bounced` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | M05, M08, M09, M01, T02, T10, T11 |
| EVT-COM-27 | `com.communication.expired` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | M05, M08, M09, M01, T02, T10, T11 |
| EVT-COM-27 | `com.communication.undeliverable` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | M05, M08, M09, M01, T02, T10, T11 |
| EVT-COM-27 | `com.communication.statusChanged` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | M05, M08, M09, M01, T02, T10, T11 |
| EVT-COM-28 | `com.communication.milestoneReached` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | M08, T11 |
| EVT-COM-29 | `com.communication.allChannelsFailed` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | M08, M05, M09, T02, T11 |
| EVT-COM-30 | `com.consent.changed` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | M01, T10 |
| EVT-COM-31 | `com.preference.changed` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | M05, M19 |
| EVT-COM-32 | `com.suppression.added` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | M01 |
| EVT-COM-32 | `com.suppression.lifted` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | M01 |
| EVT-COM-33 | `com.campaign.statusChanged` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | T11, T10 |
| EVT-COM-34 | `com.campaign.completed` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | T10 |
| EVT-COM-35 | `com.template.published` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | T02 |
| EVT-COM-36 | `com.messagingUsage.thresholdReached` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | T01, T09 |
| EVT-COM-37 | `com.comment.derivedToCrm` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | M09 |
| EVT-COM-38 | `com.platformNotice.published` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | T09, T10, T11 |
| EVT-COM-39 | `com.invoiceMessage.activated` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | M05 |
| EVT-COM-39 | `com.invoiceMessage.expired` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | M05 |
| EVT-COM-40 | `com.message.dispatchRequested` | T09 | [t09-com-p2.yaml](t09-com-p2.yaml) | vigente | T06 |
| EVT-BIA-01 | `bia.report.published` | T10 | [t10-bia.yaml](t10-bia.yaml) | vigente | T10, T02 |
| EVT-BIA-02 | `bia.report.deprecated` | T10 | [t10-bia.yaml](t10-bia.yaml) | vigente | T09 |
| EVT-BIA-03 | `bia.reportRun.completed` | T10 | [t10-bia.yaml](t10-bia.yaml) | vigente | T09, T10 |
| EVT-BIA-04 | `bia.reportRun.failed` | T10 | [t10-bia.yaml](t10-bia.yaml) | vigente | T09, T01 |
| EVT-BIA-05 | `bia.export.ready` | T10 | [t10-bia.yaml](t10-bia.yaml) | vigente | T09 |
| EVT-BIA-06 | `bia.export.downloaded` | T10 | [t10-bia.yaml](t10-bia.yaml) | vigente | T02 |
| EVT-BIA-07 | `bia.schedule.suspended` | T10 | [t10-bia.yaml](t10-bia.yaml) | vigente | T09 |
| EVT-BIA-08 | `bia.indicator.certified` | T10 | [t10-bia.yaml](t10-bia.yaml) | vigente | T10 |
| EVT-BIA-09 | `bia.kpiAlert.opened` | T10 | [t10-bia.yaml](t10-bia.yaml) | vigente | T09 |
| EVT-BIA-10 | `bia.kpiAlert.resolved` | T10 | [t10-bia.yaml](t10-bia.yaml) | vigente | T09 |
| EVT-BIA-11 | `bia.apiClient.activated` | T10 | [t10-bia.yaml](t10-bia.yaml) | vigente | T02 |
| EVT-BIA-11 | `bia.apiClient.suspended` | T10 | [t10-bia.yaml](t10-bia.yaml) | vigente | T02 |
| EVT-BIA-11 | `bia.apiClient.revoked` | T10 | [t10-bia.yaml](t10-bia.yaml) | vigente | T02 |
| EVT-BIA-12 | `bia.webhookSubscription.disabled` | T10 | [t10-bia.yaml](t10-bia.yaml) | vigente | T09 |
| EVT-BIA-13 | `bia.dataset.freshnessBreached` | T10 | [t10-bia.yaml](t10-bia.yaml) | vigente | T01 |
| EVT-BIA-14 | `bia.reconciliation.mismatch` | T10 | [t10-bia.yaml](t10-bia.yaml) | vigente | T01 |
| EVT-BIA-15 | `bia.customReport.submitted` | T10 | [t10-bia.yaml](t10-bia.yaml) | vigente | T11 |
| EVT-BIA-15 | `bia.customReport.published` | T10 | [t10-bia.yaml](t10-bia.yaml) | vigente | T11 |
| EVT-BIA-16 | `bia.bulkExport.ready` | T10 | [t10-bia.yaml](t10-bia.yaml) | vigente | T01 |
| EVT-BIA-17 | `bia.openData.published` | T10 | [t10-bia.yaml](t10-bia.yaml) | vigente | M19 |
| EVT-BIA-17 | `bia.openData.withdrawn` | T10 | [t10-bia.yaml](t10-bia.yaml) | vigente | M19 |
| EVT-BIA-18 | `bia.exitExport.delivered` | T10 | [t10-bia.yaml](t10-bia.yaml) | vigente | T01 |
