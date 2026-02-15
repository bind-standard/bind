// BIND Standard — Core Data Types
// Insurance Interoperability Standard
//
// This barrel file re-exports all BIND resource types.
// Used by the schema generator to discover all types.

// --- Base types ---
export { AdditionalInterest } from "./additional-interest";
export {
  Address,
  Attachment,
  CodeableConcept,
  Coding,
  ContactPoint,
  GeoPoint,
  Identifier,
  Meta,
  Money,
  Period,
  Quantity,
  Reference,
  Resource,
} from "./base";
export {
  Certificate,
  CertificateHolder,
  CoverageSummary,
} from "./certificate";
export {
  Claim,
  Claimant,
  ClaimFinancials,
  ClaimPayment,
  ClaimReport,
  ClaimsAssignment,
  SubrogationDetail,
} from "./claim";
export { Commission, CommissionSplit, CommissionTier } from "./commission";
export {
  Classification,
  Coverage,
  CoverageExtension,
  CoverageLimit,
} from "./coverage";
// --- Complex data types ---
export {
  BIND_INSURANCE_UNITS_SYSTEM,
  DateTimePeriod,
  GeoRegion,
  HumanName,
  InsuranceUnit,
  MoneyWithConversion,
  MultiCurrencyMoney,
  UCUM_SYSTEM,
  UcumUnit,
} from "./datatypes";
export { Deductible } from "./deductible";
export { Exclusion, PolicyCondition } from "./exclusion";
// --- Insurance domain supporting types ---
export { FinancialRating } from "./financial-rating";
export { InsuranceForm } from "./form";
export {
  CarrierAppointment,
  InsuranceSpecialty,
  SplitLimitComponent,
} from "./insurance-common";
// --- Resources ---
export { Insured } from "./insured";
export { Lienholder } from "./lienholder";
export { Location, SprinklerDetail } from "./location";
export { LargeLoss, LossHistory } from "./loss-history";
export { DrivingViolation, NamedDriver } from "./named-driver";
export { Note } from "./note";
export { Organization } from "./organization";
export { License, Person } from "./person";
export { PersonRole } from "./person-role";
export { Endorsement, EndorsementChange, Policy } from "./policy";
export { PolicyTransaction } from "./policy-transaction";
export {
  Premium,
  PremiumAdjustment,
  PremiumAllocation,
  PremiumBasis,
  PremiumInstallment,
} from "./premium";
// --- Primitives ---
export {
  BindBase64Binary,
  BindBoolean,
  BindDate,
  BindDateTime,
  BindDecimal,
  BindId,
  BindInstant,
  BindInteger,
  BindMarkdown,
  BindPercentage,
  BindPositiveInt,
  BindString,
  BindTime,
  BindUri,
  BindUrl,
  BindYear,
} from "./primitives";
export { QuestionResponse } from "./question-response";
export { PremiumLineItem, Quote, Subjectivity } from "./quote";

export { AssetValuation, Risk, RiskCharacteristic } from "./risk";
export { ScheduledItem } from "./scheduled-item";
export { Submission } from "./submission";
