// BIND Standard — Core Data Types
// Insurance Interoperability Standard
//
// This barrel file re-exports all BIND resource types.
// Used by the schema generator to discover all types.

// --- Primitives ---
export {
  BindId,
  BindString,
  BindUri,
  BindUrl,
  BindMarkdown,
  BindBase64Binary,
  BindDate,
  BindDateTime,
  BindInstant,
  BindTime,
  BindBoolean,
  BindInteger,
  BindPositiveInt,
  BindDecimal,
  BindPercentage,
  BindYear,
} from "./primitives";

// --- Base types ---
export {
  Resource,
  Meta,
  Coding,
  CodeableConcept,
  Reference,
  Period,
  Money,
  Quantity,
  Address,
  ContactPoint,
  Attachment,
  GeoPoint,
  Identifier,
} from "./base";

// --- Complex data types ---
export {
  HumanName,
  GeoRegion,
  MoneyWithConversion,
  MultiCurrencyMoney,
  DateTimePeriod,
  UcumUnit,
  InsuranceUnit,
  UCUM_SYSTEM,
  BIND_INSURANCE_UNITS_SYSTEM,
} from "./datatypes";

// --- Insurance domain supporting types ---
export { FinancialRating } from "./financial-rating";
export {
  InsuranceSpecialty,
  CarrierAppointment,
  SplitLimitComponent,
} from "./insurance-common";
export { Deductible } from "./deductible";
export {
  Premium,
  PremiumBasis,
  PremiumAdjustment,
  PremiumInstallment,
  PremiumAllocation,
} from "./premium";
export { Commission, CommissionTier, CommissionSplit } from "./commission";
export { NamedDriver, DrivingViolation } from "./named-driver";
export { Lienholder } from "./lienholder";
export { ScheduledItem } from "./scheduled-item";

// --- Resources ---
export { Insured } from "./insured";

export { Submission } from "./submission";

export { Quote, PremiumLineItem, Subjectivity } from "./quote";

export { Policy, Endorsement, EndorsementChange } from "./policy";

export {
  Coverage,
  CoverageLimit,
  CoverageExtension,
  Classification,
} from "./coverage";

export {
  Claim,
  Claimant,
  ClaimFinancials,
  ClaimPayment,
} from "./claim";

export { Organization } from "./organization";

export { Location } from "./location";

export { Risk, RiskCharacteristic, AssetValuation } from "./risk";

export { Person, License } from "./person";

export { PersonRole } from "./person-role";
