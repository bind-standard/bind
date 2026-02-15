import type { CodeableConcept, Money, Quantity, Reference, Resource } from "./base";
import type { Deductible } from "./deductible";
import type { Exclusion, PolicyCondition } from "./exclusion";
import type { InsuranceForm } from "./form";
import type { InsuranceSpecialty, SplitLimitComponent } from "./insurance-common";
import type { Premium } from "./premium";
import type { ScheduledItem } from "./scheduled-item";

/**
 * A specific coverage section within a policy.
 * Each coverage defines the limits, deductibles, and terms for a particular
 * line of business or coverage part (e.g., General Liability, Property, Auto).
 *
 * @example
 * {
 *   "resourceType": "Coverage",
 *   "id": "cov-gl-001",
 *   "status": "active",
 *   "policy": { "reference": "Policy/pol-2025-1001" },
 *   "lineOfBusiness": { "coding": [{ "code": "GL", "display": "General Liability" }] },
 *   "limits": [
 *     { "type": { "text": "Each Occurrence" }, "amount": { "value": 1000000, "currency": "USD" } },
 *     { "type": { "text": "General Aggregate" }, "amount": { "value": 2000000, "currency": "USD" } }
 *   ],
 *   "deductible": { "value": 5000, "currency": "USD" },
 *   "premium": { "value": 42000, "currency": "USD" }
 * }
 */
export interface Coverage extends Resource {
  /** Fixed resource type discriminator */
  resourceType: "Coverage";

  /** Whether this coverage is currently active */
  status: "active" | "inactive" | "pending";

  /** Reference to the parent policy */
  policy: Reference;

  /**
   * Line of business for this coverage (GL, Property, WC, Auto, etc.)
   * @terminology https://bind.codes/line-of-business preferred
   */
  lineOfBusiness: CodeableConcept;

  /** Coverage limits */
  limits?: CoverageLimit[];

  /** Structured deductible definition */
  deductible?: Deductible;

  /** Structured premium definition */
  premium?: Premium;

  /** Specific coverage features or extensions */
  coverageExtensions?: CoverageExtension[];

  /** Locations or classes covered under this section */
  classifications?: Classification[];

  /** Coinsurance percentage, if applicable */
  coinsurancePercentage?: number;

  /** References to Risk resources covered under this coverage section */
  risks?: Reference[];

  /** Insurance specialty / line-of-business detail for this coverage */
  specialty?: InsuranceSpecialty;

  /** Coverage part identifier (e.g., HO: A=Dwelling, B=Other Structures, C=Personal Property, D=Loss of Use, E=Personal Liability, F=Medical Payments) */
  coveragePart?: CodeableConcept;

  /** Scheduled personal property items under this coverage */
  scheduledItems?: ScheduledItem[];

  /** Exclusions applicable to this coverage */
  exclusions?: Exclusion[];

  /** Conditions, warranties, and protective safeguard requirements */
  conditions?: PolicyCondition[];

  /** Standard form references applicable to this coverage */
  forms?: InsuranceForm[];
}

/**
 * A specific limit of insurance within a coverage.
 * Commercial policies typically have multiple limit types
 * (e.g., per-occurrence, aggregate, per-person).
 *
 * @example
 * {
 *   "type": { "text": "Each Occurrence" },
 *   "amount": { "value": 1000000, "currency": "USD" }
 * }
 */
export interface CoverageLimit {
  /** The type of limit (Each Occurrence, Aggregate, Per Person, etc.) */
  type: CodeableConcept;

  /** The limit amount (either amount or splitAmounts should be present) */
  amount?: Money;

  /** Split limit components (e.g., auto liability 100/300/100) */
  splitAmounts?: SplitLimitComponent[];

  /** Whether this limit is shared across multiple coverages */
  shared?: boolean;

  /** Basis type for the limit (e.g., "per occurrence", "per location", "per project") */
  basisType?: string;

  /** Whether this is a sublimit of a broader coverage limit */
  isSublimit?: boolean;

  /** The parent limit this sublimit falls under */
  parentLimit?: CodeableConcept;

  /** Attachment point for excess/umbrella layers */
  attachmentPoint?: Money;

  /** Amount of the limit that has been eroded by losses */
  eroded?: Money;

  /** Remaining limit after erosion */
  remaining?: Money;

  /** Number of times the limit can be reinstated after a loss */
  reinstatements?: number;
}

/**
 * An additional coverage feature, extension, or sublimit.
 * Examples: Hired & Non-Owned Auto, Employee Benefits Liability,
 * Blanket Additional Insured.
 */
export interface CoverageExtension {
  /** Name or type of the extension */
  type: CodeableConcept;

  /** Whether this extension is included or excluded */
  included: boolean;

  /** Sublimit for this extension, if applicable */
  sublimit?: Money;

  /** Additional premium for this extension */
  additionalPremium?: Money;

  /** Description or notes about this extension */
  description?: string;
}

/**
 * A classification or class code within a coverage.
 * Used to categorize exposure units, particularly in GL and WC.
 *
 * @example
 * {
 *   "classCode": { "code": "91580", "display": "Machine Shop NOC" },
 *   "exposure": { "value": 1500000, "unit": "payroll" },
 *   "rate": 2.45,
 *   "premium": { "value": 36750, "currency": "USD" }
 * }
 */
export interface Classification {
  /** The classification or class code */
  classCode: CodeableConcept;

  /** Exposure measure for this classification */
  exposure?: Quantity;

  /** Rate applied to this classification */
  rate?: number;

  /** Premium for this classification */
  premium?: Money;

  /** Location reference, if class is location-specific */
  location?: Reference;

  /** Description of operations at this classification */
  description?: string;
}
