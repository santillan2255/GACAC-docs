# Modelo entidad-relación — M10 TEC Técnica, campo y redes (parte 2 de 2)

Continuación de [`M10-TEC-tecnica-campo-redes.md`](M10-TEC-tecnica-campo-redes.md). Anexo dueño: [`M10-TEC-tecnica-campo-redes.md`](../../especificacion/anexos/M10-TEC-tecnica-campo-redes.md). Versión 2.1 (05-11-2026).

## 7. Relaciones con otros módulos y entre diagramas

Referencias que salen de una colección de este módulo hacia una entidad de otro módulo o de otro diagrama del mismo módulo (no se dibujan para mantener cada diagrama dentro de su módulo y subdominio).

| Colección origen | Campo | Cardinalidad (destino a origen) | Destino | COL-ID destino | Módulo destino |
|---|---|---|---|---|---|
| `feasibilityRequests` | `serviceId` | 1 a N | `tenantServices` | COL-CAT-02 | M02 |
| `feasibilityRequests` | `personId` | 1 a N | `persons` | COL-PER-01 | M01 |
| `feasibilityRequests` | `accountId` | 0..1 a N | `accounts` | COL-PER-05 | M01 |
| `feasibilityRequests` | `crmCaseId` | 0..1 a N | `crmCases` | COL-CRM-01 | M09 |
| `feasibilityRequests` | `technicalResponsibleId` | 1 a N | `fieldResources` | COL-TEC-24 | mismo módulo, diagrama 2 |
| `feasibilityRequests` | `usedByContractId` | 0..1 a N | `serviceContracts` | COL-CAT-18 | M02 |
| `feasibilityRequests` | `closedBy`, `cancelledBy` | 1 a N | `memberships` | COL-IAM-04 | T02 |
| `connectionEstimates` | `templateId` | 0..1 a N | `documentTemplates` | COL-WFL-41 | T11 |
| `technicalNotes` | `authorUserId`, `responsibleId` | 1 a N | `memberships` | COL-IAM-04 | T02 |
| `workOrderOperationTypes` | `serviceId` | 1 a N | `tenantServices` | COL-CAT-02 | M02 |
| `workOrderOperationTypes` | `resultingServiceStatusId` | 0..1 a N | `serviceStatuses` | COL-CAT-14 | M02 |
| `workOrderOperationTypes` | `defaultWorkTypeId`, `visitTypeId` | 0..1 a N | `workTypes` | COL-TEC-05 | mismo módulo, diagrama 2 |
| `workOrderOperationTypes` | `defaultResolutionIds`, `requiredTaskIds`, `checklistFormIds` | N a N | `workTypes` | COL-TEC-05 | mismo módulo, diagrama 2 |
| `incidentCategories` | `serviceId` | 1 a N | `tenantServices` | COL-CAT-02 | M02 |
| `incidentCategories` | `defaultOperationTypeId` | 1 a N | `workOrderOperationTypes` | COL-TEC-04 | mismo módulo, diagrama 1 |
| `incidentCategories` | `debitAccountId`, `creditAccountId` | 1 a N | `ledgerAccounts` | COL-CON-04 | M15 |
| `resolutionCodes` | `serviceId` | 0..1 a N | `tenantServices` | COL-CAT-02 | M02 |
| `resolutionCodes` | `operationTypeId` | 0..1 a N | `operationTypes` | COL-WFL-08 | T11 |
| `taskCatalog` | `serviceId` | 0..1 a N | `tenantServices` | COL-CAT-02 | M02 |
| `workOrderPrintTemplates` | `serviceId` | 1 a N | `tenantServices` | COL-CAT-02 | M02 |
| `workOrderPrintTemplates` | `operationTypeId` | 1 a N | `workOrderOperationTypes` | COL-TEC-04 | mismo módulo, diagrama 1 |
| `workOrderPrintTemplates` | `templateVersionId` | 1 a N | `templateVersions` | COL-WFL-42 | T11 |
| `chainedOrderRules` | `sourceServiceId`, `targetServiceId` | 1 a N | `tenantServices` | COL-CAT-02 | M02 |
| `chainedOrderRules` | `sourceOperationTypeId` | 0..1 a N | `workOrderOperationTypes` | COL-TEC-04 | mismo módulo, diagrama 1 |
| `chainedOrderRules` | `targetOperationTypeId`, `operationTypeId` | 1 a N | `workOrderOperationTypes` | COL-TEC-04 | mismo módulo, diagrama 1 |
| `chainedOrderRules` | `targetIntakeChannelId` | 1 a N | `crmChannels` | COL-CRM-23 | M09 |
| `workOrders` | `serviceId` | 1 a N | `tenantServices` | COL-CAT-02 | M02 |
| `workOrders` | `contractId` | 1 a N | `serviceContracts` | COL-CAT-18 | M02 |
| `workOrders` | `accountId` | 1 a N | `accounts` | COL-PER-05 | M01 |
| `workOrders` | `personId` | 1 a N | `persons` | COL-PER-01 | M01 |
| `workOrders` | `crmCaseId` | 1 a N | `crmCases` | COL-CRM-01 | M09 |
| `workOrders` | `inspectionCaseId` | 1 a N | `inspectionCases` | COL-TEC-49 | mismo módulo, diagrama 3 |
| `workOrders` | `intakeChannelId` | 1 a N | `crmChannels` | COL-CRM-23 | M09 |
| `workOrders` | `provisioningCommandIds` | N a N | `provisioningCommands` | COL-TEC-45 | mismo módulo, diagrama 3 |
| `workOrders` | `cancelledBy` | 1 a N | `memberships` | COL-IAM-04 | T02 |
| `workOrderMaterials` | `workId` | 1 a N | `works` | COL-TEC-46 | mismo módulo, diagrama 3 |
| `workOrderMaterials` | `inventoryItemId` | 1 a N | `inventoryItems` | COL-STK-05 | M13 |
| `workOrderMaterials` | `serial`, `serialUnitId` | 1 a N | `serialUnits` | COL-STK-13 | M13 |
| `workOrderMaterials` | `stockMovementIds` | N a N | `stockMovements` | COL-STK-11 | M13 |
| `fieldEvidence` | `storedFileId` | 1 a N | `storedFiles` | COL-PLA-29 | T01 |
| `fieldEvidence` | `capturedBy` | 1 a N | `memberships` | COL-IAM-04 | T02 |
| `fieldEvidence` | `documentId` | 1 a N | `documents` | COL-WFL-34 | T11 |
| `fieldEvidence` | `supersededBy` | 0..1 a N | `memberships` | COL-IAM-04 | T02 |
| `serviceConformities` | `signatureRequestId` | 1 a N | `signatureRequests` | COL-WFL-48 | T11 |
| `serviceConformities` | `installerId` | 1 a N | `certifiedInstallers` | COL-TEC-26 | mismo módulo, diagrama 2 |
| `damageAssessments` | `crmCaseId` | 1 a N | `crmCases` | COL-CRM-01 | M09 |
| `technicalProcedures` | `installerId` | 1 a N | `certifiedInstallers` | COL-TEC-26 | mismo módulo, diagrama 2 |
| `technicalProcedures` | `serviceId` | 1 a N | `tenantServices` | COL-CAT-02 | M02 |
| `technicalProcedures` | `externalUserRef` | 1 a N | `memberships` | COL-IAM-04 | T02 |
| `technicalProcedures` | `dossierId` | 1 a N | `dossiers` | COL-WFL-51 | T11 |
| `visitTypes` | `serviceIds` | N a N | `tenantServices` | COL-CAT-02 | M02 |
| `schedulingZones` | `zoneIds` | N a N | `zones` | COL-CFG-16 | T04 |
| `schedulingZones` | `localityIds` | N a N | `localities` | COL-CFG-10 | T04 |
| `schedulingZones` | `neighborhoodIds` | N a N | `neighborhoods` | COL-CFG-15 | T04 |
| `resourceCalendars` | `zoneIds` | N a N | `schedulingZones` | COL-TEC-19 | mismo módulo, diagrama 2 |
| `resourceCalendars` | `visitTypeIds` | N a N | `visitTypes` | COL-TEC-18 | mismo módulo, diagrama 2 |
| `visits` | `visitTypeId` | 1 a N | `visitTypes` | COL-TEC-18 | mismo módulo, diagrama 2 |
| `visits` | `zoneId` | 1 a N | `schedulingZones` | COL-TEC-19 | mismo módulo, diagrama 2 |
| `visits` | `assignedCrewId` | 0..1 a N | `crews` | COL-TEC-23 | mismo módulo, diagrama 2 |
| `visits` | `assignedResourceIds` | N a N | `crews` | COL-TEC-23 | mismo módulo, diagrama 2 |
| `crews` | `serviceIds` | N a N | `tenantServices` | COL-CAT-02 | M02 |
| `crews` | `defaultVehicleId` | 1 a N | `fleetVehicles` | COL-SOC-43 | M18 |
| `crews` | `custodyWarehouseId`, `warehouseId` | 1 a N | `warehouses` | COL-STK-07 | M13 |
| `crews` | `employeeIds` | N a N | `employees` | COL-SUE-02 | M16 |
| `fieldResources` | `userId` | 1 a N | `memberships` | COL-IAM-04 | T02 |
| `fieldResources` | `custodyWarehouseId` | 1 a N | `warehouses` | COL-STK-07 | M13 |
| `fieldResources` | `serviceIds` | N a N | `tenantServices` | COL-CAT-02 | M02 |
| `fieldResources` | `operationTypeIds` | N a N | `workOrderOperationTypes` | COL-TEC-04 | mismo módulo, diagrama 1 |
| `fieldResources` | `employeeId` | 0..1 a N | `employees` | COL-SUE-02 | M16 |
| `fieldResources` | `vehicleId` | 1 a N | `fleetVehicles` | COL-SOC-43 | M18 |
| `responsibleNotificationRules` | `serviceId` | 1 a N | `tenantServices` | COL-CAT-02 | M02 |
| `responsibleNotificationRules` | `operationTypeIds` | N a N | `workOrderOperationTypes` | COL-TEC-04 | mismo módulo, diagrama 1 |
| `certifiedInstallers` | `serviceIds` | N a N | `tenantServices` | COL-CAT-02 | M02 |
| `certifiedInstallers` | `personId` | 1 a N | `persons` | COL-PER-01 | M01 |
| `fieldForms` | `serviceIds` | N a N | `tenantServices` | COL-CAT-02 | M02 |
| `fieldForms` | `operationTypeIds` | N a N | `workOrderOperationTypes` | COL-TEC-04 | mismo módulo, diagrama 1 |
| `fieldForms` | `formVersionId` | 1 a N | `formVersions` | COL-WFL-19 | T11 |
| `fieldDevices` | `userId`, `revokedBy` | 1 a N | `memberships` | COL-IAM-04 | T02 |
| `syncMutations` | `userId` | 1 a N | `memberships` | COL-IAM-04 | T02 |
| `syncConflicts` | `workOrderId` | 1 a N | `workOrders` | COL-TEC-12 | mismo módulo, diagrama 1 |
| `syncConflicts` | `mutationIds` | N a N | `syncMutations` | COL-TEC-29 | mismo módulo, diagrama 1 |
| `syncConflicts` | `evidenceIds` | N a N | `documents` | COL-WFL-34 | T11 |
| `syncConflicts` | `assigneeId`, `resolvedBy` | 1 a N | `memberships` | COL-IAM-04 | T02 |
| `syncConflicts` | `followUpWorkOrderId` | 0..1 a N | `workOrders` | COL-TEC-12 | mismo módulo, diagrama 1 |
| `syncConflicts` | `syncMutationId` | 1 a N | `syncMutations` | COL-TEC-29 | mismo módulo, diagrama 1 |
| `maintenancePlans` | `operationTypeId` | 1 a N | `workOrderOperationTypes` | COL-TEC-04 | mismo módulo, diagrama 1 |
| `maintenancePlans` | `lastGeneratedWorkOrderId` | 1 a N | `workOrders` | COL-TEC-12 | mismo módulo, diagrama 1 |
| `maintenancePlans` | `responsibleId` | 1 a N | `memberships` | COL-IAM-04 | T02 |
| `maintenancePlans` | `networkElementIds` | N a N | `networkElements` | COL-TEC-38 | mismo módulo, diagrama 3 |
| `outagePlans` | `networkElementIds` | N a N | `networkElements` | COL-TEC-38 | mismo módulo, diagrama 3 |
| `outagePlans` | `approvedBy` | 1 a N | `memberships` | COL-IAM-04 | T02 |
| `outagePlans` | `workOrderIds` | N a N | `workOrders` | COL-TEC-12 | mismo módulo, diagrama 1 |
| `outagePlans` | `outageNoticeId` | 1 a N | `outageNotices` | COL-COM-56 | T09 |
| `networks` | `serviceIds` | N a N | `tenantServices` | COL-CAT-02 | M02 |
| `networks` | `serviceId` | 1 a N | `tenantServices` | COL-CAT-02 | M02 |
| `networkElements` | `networkId` | 1 a N | `networks` | COL-TEC-33 | mismo módulo, diagrama 2 |
| `networkElements` | `layerId` | 1 a N | `networkLayers` | COL-TEC-34 | mismo módulo, diagrama 2 |
| `networkElements` | `componentTypeId` | 1 a N | `networkComponentTypes` | COL-TEC-35 | mismo módulo, diagrama 2 |
| `serviceNetworkConnections` | `contractId` | 1 a N | `serviceContracts` | COL-CAT-18 | M02 |
| `serviceNetworkConnections` | `workOrderId` | 1 a N | `workOrders` | COL-TEC-12 | mismo módulo, diagrama 1 |
| `gisExportTemplates` | `serviceId` | 1 a N | `tenantServices` | COL-CAT-02 | M02 |
| `networkDevices` | `credentialRef` | 1 a N | `integrationSecrets` | COL-INT-03 | T06 |
| `networkDevices` | `serialUnitId` | 1 a N | `serialUnits` | COL-STK-13 | M13 |
| `provisioningSystems` | `serviceIds` | N a N | `tenantServices` | COL-CAT-02 | M02 |
| `provisioningSystems` | `credentialRef` | 1 a N | `integrationSecrets` | COL-INT-03 | T06 |
| `provisioningSystems` | `connectorId`, `connectionId` | 1 a N | `integrationConnections` | COL-INT-02 | T06 |
| `provisioningProfiles` | `planId` | 1 a N | `servicePlans` | COL-CAT-07 | M02 |
| `serviceTechnicalProfiles` | `contractId` | 1 a 0..1 | `serviceContracts` | COL-CAT-18 | M02 |
| `serviceTechnicalProfiles` | `serviceId` | 1 a N | `tenantServices` | COL-CAT-02 | M02 |
| `serviceTechnicalProfiles` | `credentialRef` | 1 a N | `integrationSecrets` | COL-INT-03 | T06 |
| `serviceTechnicalProfiles` | `registeredBy` | 1 a N | `memberships` | COL-IAM-04 | T02 |
| `provisioningCommands` | `contractId` | 1 a N | `serviceContracts` | COL-CAT-18 | M02 |
| `provisioningCommands` | `workOrderId` | 0..1 a N | `workOrders` | COL-TEC-12 | mismo módulo, diagrama 1 |
| `works` | `serviceId` | 1 a N | `tenantServices` | COL-CAT-02 | M02 |
| `works` | `costCenterId` | 1 a N | `costCenters` | COL-CON-16 | M15 |
| `workGroups` | `debitAccountId`, `creditAccountId` | 1 a N | `ledgerAccounts` | COL-CON-04 | M15 |
| `workBeneficiaries` | `premiseId` | 1 a N | `premises` | COL-PER-08 | M01 |
| `workBeneficiaries` | `accountId` | 1 a N | `accounts` | COL-PER-05 | M01 |
| `workBeneficiaries` | `holderId` | 1 a N | `holders` | COL-PER-04 | M01 |
| `inspectionCases` | `contractId` | 1 a N | `serviceContracts` | COL-CAT-18 | M02 |
| `inspectionCases` | `serviceId` | 1 a N | `tenantServices` | COL-CAT-02 | M02 |
| `inspectionCases` | `alertRef` | 1 a N | `alerts` | COL-PLA-16 | T01 |
| `inspectionCases` | `workOrderIds` | N a N | `workOrders` | COL-TEC-12 | mismo módulo, diagrama 1 |
| `inspectionCases` | `meteringPointId` | 1 a N | `meteringPoints` | COL-MED-08 | M03 |
| `phoneStripPositions` | `contractId` | 0..1 a N | `serviceContracts` | COL-CAT-18 | M02 |
| `phoneNumbers` | `reservedByWorkOrderId` | 0..1 a N | `workOrders` | COL-TEC-12 | mismo módulo, diagrama 1 |
| `phoneLines` | `contractId` | 1 a N | `serviceContracts` | COL-CAT-18 | M02 |
| `phoneLines` | `tariffPlanId` | 1 a N | `servicePlans` | COL-CAT-07 | M02 |
| `phoneLines` | `workOrderId` | 0..1 a N | `workOrders` | COL-TEC-12 | mismo módulo, diagrama 1 |
| `numberingPlan` | `provinceId` | 1 a N | `provinces` | COL-CFG-08 | T04 |
| `numberingPlan` | `operatorId` | 1 a N | `memberships` | COL-IAM-04 | T02 |
| `telecomOperators` | `accountId` | 0..1 a N | `accounts` | COL-PER-05 | M01 |
| `cdrImports` | `exchangeId` | 0..1 a N | `phoneExchanges` | COL-TEC-51 | mismo módulo, diagrama 3 |
| `cdrImports` | `operatorId` | 0..1 a N | `memberships` | COL-IAM-04 | T02 |
| `callRecords` | `operatorId` | 1 a N | `memberships` | COL-IAM-04 | T02 |
| `callRecords` | `attributedLineId` | 1 a N | `phoneLines` | COL-TEC-61 | mismo módulo, diagrama 3 |
| `callRecords` | `attributedContractId` | 1 a N | `serviceContracts` | COL-CAT-18 | M02 |
| `mobileUsageImports` | `serviceId` | 1 a N | `tenantServices` | COL-CAT-02 | M02 |
| `mobileUsageImports` | `contractId` | 1 a N | `serviceContracts` | COL-CAT-18 | M02 |
| `mobileUsageImports` | `operatorId` | 1 a N | `memberships` | COL-IAM-04 | T02 |
| `providedMailboxes` | `contractId` | 1 a N | `serviceContracts` | COL-CAT-18 | M02 |
| `providedMailboxes` | `userId`, `registeredBy` | 1 a N | `memberships` | COL-IAM-04 | T02 |
| `providedMailboxes` | `credentialRef` | 1 a N | `integrationSecrets` | COL-INT-03 | T06 |
| `onCallShifts` | `serviceIds` | N a N | `tenantServices` | COL-CAT-02 | M02 |
| `emergencyProtocols` | `serviceIds` | N a N | `tenantServices` | COL-CAT-02 | M02 |
| `numberPortings` | `phoneNumberId` | 0..1 a N | `phoneNumbers` | COL-TEC-60 | mismo módulo, diagrama 3 |
| `numberPortings` | `contractId` | 1 a N | `serviceContracts` | COL-CAT-18 | M02 |
| `numberPortings` | `documentIds` | N a N | `documents` | COL-WFL-34 | T11 |
| `numberPortings` | `workOrderId` | 0..1 a N | `workOrders` | COL-TEC-12 | mismo módulo, diagrama 1 |
| `numberPortings` | `portId` | 1 a 0..1 | `phonePorts` | COL-TEC-58 | mismo módulo, diagrama 3 |
| `waterSamplingPoints` | `networkElementId` | 0..1 a N | `networkElements` | COL-TEC-38 | mismo módulo, diagrama 3 |
| `waterSamples` | `workOrderId` | 1 a N | `workOrders` | COL-TEC-12 | mismo módulo, diagrama 1 |
| `waterSamples` | `takenBy` | 1 a N | `memberships` | COL-IAM-04 | T02 |
| `waterSamples` | `labReportDocumentId` | 1 a N | `documents` | COL-WFL-34 | T11 |

## 8. Colecciones absorbidas y renombradas

| COL-ID | Colección declarada | Destino (no se crea) | Detalle en T05 |
|---|---|---|---|
| COL-TEC-76 | `intakeChannels` | `crmChannels` (COL-CRM-23, M09) | (vías de ingreso compartidas con M09: canónica `crmChannels`) |

## 9. Observaciones e inconsistencias detectadas

- Campos que T05 cita en "Claves y referencias" o "Únicos" y que la ficha del anexo no declara con ese nombre (posible diferencia de nombre; a verificar en el anexo): `provisioningSystems`: `integrationConnections`.
