# Ciclos FK detectados — 2026-11-19

Total FK: **1912** | En ciclo (NOCHECK): **90**
| Intra-módulo: **942** |

Las restricciones en ciclo se crean con `ALTER TABLE ... WITH NOCHECK` para permitir el despliegue inicial; EF/migraciones pueden endurecer después.

## Aristas en ciclo

- `iam.AuthFactors.IdentityId->iam.Identities`
- `wfl.FormVersions.FormDefinitionId->wfl.FormDefinitions`
- `cob.AccountStatements.PaymentCouponId->cob.PaymentCoupons`
- `sue.AdministrativeInquiries.ResultingActionIdsId->sue.DisciplinaryActions`
- `mor.Agreements.GuaranteeIdsId->mor.Guarantees`
- `com.AudienceSegments.LastSnapshotId->com.AudienceSnapshots`
- `com.AudienceSnapshots.OwnerId->com.Posts`
- `com.AudienceSnapshots.SegmentId->com.AudienceSegments`
- `stk.BomStructureVersions.BomStructureId->stk.BomStructures`
- `stk.BomStructures.CurrentVersionId->stk.BomStructureVersions`
- `cat.BundleSubscriptions.ContractIdsId->cat.ServiceContracts`
- `soc.BurialRights.UnitId->soc.BurialUnits`
- `soc.BurialUnits.CurrentRightId->soc.BurialRights`
- `tes.CardPresentations.VoucherIdsId->tes.CardVouchers`
- `tes.CardSettlements.VoucherIdsId->tes.CardVouchers`
- `tes.CardVouchers.PresentationId->tes.CardPresentations`
- `tes.CardVouchers.SettlementId->tes.CardSettlements`
- `cob.CashOperations.ReceiptIdsId->cob.Receipts`
- `cob.CashRegisters.CollectorId->cob.Collectors`
- `cob.CashRegisters.StaticQrCodeId->cob.StaticQrCodes`
- `cob.CashSessions.HandoverId->cob.TreasuryHandovers`
- `con.ChartOfAccounts.ScenarioId->con.SimulationScenarios`
- `cob.CollectionAgencies.CashRegisterId->cob.CashRegisters`
- `cob.Collectors.CashRegisterId->cob.CashRegisters`
- `con.CostCenterGroups.CostCenterIdsId->con.CostCenters`
- `con.CostCenters.GroupIdsId->con.CostCenterGroups`
- `sue.DisciplinaryActions.InquiryId->sue.AdministrativeInquiries`
- `wfl.DocumentTemplates.CurrentVersionId->wfl.TemplateVersions`
- `sue.ExternalPayrollImports.PaymentRequestId->sue.PayrollPaymentRequests`
- `tec.FieldEvidence.EntityId->tec.WorkOrders`
- `fis.FiscalAuthorizations.DocumentRefId->fis.GatewayDocuments`
- `soc.FleetVehicles.GpsDeviceId->soc.GpsDevices`
- `wfl.FormDefinitions.FormDefinitionId->wfl.FormVersions`
- `cob.GatewayConnectors.SettlementAgencyId->cob.CollectionAgencies`
- `fis.GatewayDocuments.FiscalAuthorizationId->fis.FiscalAuthorizations`
- `cob.GatewayTransactions.IntentId->cob.PaymentIntents`
- `soc.GpsDevices.VehicleId->soc.FleetVehicles`
- `mor.Guarantees.AgreementId->mor.Agreements`
- `iam.Identities.MfaId->iam.AuthFactors`
- `sue.IncomeTaxCalculations.PayslipId->sue.Payslips`
- `sue.IncomeTaxCalculations.OverrideNoveltyId->sue.Novelties`
- `sue.LaborAgreements.SeniorityScaleId->sue.SeniorityScales`
- `por.LandingPageVersions.LandingPageId->por.LandingPages`
- `por.LandingPages.DraftVersionId->por.LandingPageVersions`
- `int.LocalAgents.WorkstationId->cfg.Workstations`
- `ins.MeetingAgendaItems.VotingSessionId->ins.VotingSessions`
- `ins.MeetingAgendaItems.ResolutionId->ins.Resolutions`
- `com.MessageTemplateVersions.TemplateId->com.MessageTemplates`
- `com.MessageTemplates.CurrentVersionId->com.MessageTemplateVersions`
- `mig.MigStagingRecords.IssuesId->mig.MigrationIssues`
- `mig.MigrationIssues.StagingRecordId->mig.MigStagingRecords`
- `tec.NetworkDevices.NetworkElementId->tec.NetworkElements`
- `tec.NetworkElements.NetworkDeviceId->tec.NetworkDevices`
- `sue.Novelties.SettledPayslipId->sue.Payslips`
- `cob.PaymentCoupons.StatementId->cob.AccountStatements`
- `cob.PaymentIntents.TransactionIdsId->cob.GatewayTransactions`
- `tes.PayrollPaymentBatches.PayrollRunId->sue.PayrollRuns`
- `sue.PayrollPaymentRequests.PayrollRunId->sue.PayrollRuns`
- `sue.PayrollPaymentRequests.ExternalImportId->sue.ExternalPayrollImports`
- `sue.PayrollPaymentRequests.TreasuryRequestId->tes.PayrollPaymentBatches`
- `sue.PayrollRuns.PaymentRequestId->sue.PayrollPaymentRequests`
- `sue.Payslips.IncomeTaxCalculationId->sue.IncomeTaxCalculations`
- `com.Posts.AudienceSnapshotId->com.AudienceSnapshots`
- `com.Posts.AudienceSegmentId->com.AudienceSegments`
- `cmp.QuoteRequests.SourcingEventId->cmp.SourcingEvents`
- `cob.Receipts.CashOperationId->cob.CashOperations`
- `tes.ReceivedWithholdings.PresentationId->tes.WithholdingPresentations`
- `ins.Resolutions.AgendaItemId->ins.MeetingAgendaItems`
- `sue.SalaryIncreaseBatches.ResultingScaleId->sue.SalaryScales`
- `sue.SalaryScales.IncreaseBatchId->sue.SalaryIncreaseBatches`
- `ven.SalesInstallments.OriginId->ven.SalesOrders`
- `ven.SalesOrders.InstallmentIdsId->ven.SalesInstallments`
- `sue.SeniorityScales.LaborAgreementId->sue.LaborAgreements`
- `tec.ServiceConformities.SignatureEvidenceId->tec.FieldEvidence`
- `cat.ServiceContracts.BundleSubscriptionId->cat.BundleSubscriptions`
- `con.SimulationScenarios.ChartId->con.ChartOfAccounts`
- `cmp.SourcingEvents.QuoteRequestId->cmp.QuoteRequests`
- `cob.StaticQrCodes.CashRegisterId->cob.CashRegisters`
- `cob.StaticQrCodes.GatewayConnectorId->cob.GatewayConnectors`
- `wfl.TemplateVersions.DocumentTemplateId->wfl.DocumentTemplates`
- … y 10 más
