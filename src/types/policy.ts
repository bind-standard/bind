import type { AdditionalInterest } from "./additional-interest";
import type { Attachment, CodeableConcept, Money, Period, Reference, Resource } from "./base";
import type { Commission } from "./commission";
import type { Classification, CoverageExtension, CoverageLimit } from "./coverage";
import type { Deductible } from "./deductible";
import type { InsuranceForm } from "./form";
import type { PolicyTransaction } from "./policy-transaction";

/**
 * A bound insurance policy — the central resource in the BIND standard.
 * Represents an active (or historical) contract between a carrier and an insured,
 * providing specific coverages for a defined period.
 *
 * @example
 * {
 *   "resourceType": "Policy",
 *   "id": "pol-2025-1001",
 *   "status": "active",
 *   "policyNumber": "CGL-2025-001001",
 *   "insured": { "reference": "Insured/ins-001", "display": "Acme Manufacturing Corp" },
 *   "carrier": { "reference": "Organization/carrier-200", "display": "Hartford Financial" },
 *   "effectivePeriod": { "start": "2025-07-01", "end": "2026-07-01" },
 *   "linesOfBusiness": [
 *     { "coding": [{ "code": "GL", "display": "General Liability" }] }
 *   ],
 *   "totalPremium": { "value": 85000, "currency": "USD" },
 *   "boundDate": "2025-06-10T16:00:00Z"
 * }
 */
export interface Policy extends Resource {
  /** Fixed resource type discriminator */
  resourceType: "Policy";

  /**
   * Current status of the policy.
   *
   * - `active` — Policy is currently in force
   * - `pending` — Bound but not yet effective
   * - `cancelled` — Policy has been cancelled
   * - `expired` — Policy term has ended
   * - `non-renewed` — Carrier or insured chose not to renew
   */
  status: "active" | "pending" | "cancelled" | "expired" | "non-renewed";

  /**
   * The policy number assigned by the carrier.
   * This is the primary business identifier.
   */
  policyNumber: string;

  /** Reference to the insured entity */
  insured: Reference;

  /** Reference to the issuing carrier */
  carrier: Reference;

  /** Reference to the broker/agent of record */
  broker?: Reference;

  /** Reference to the managing general agent (MGA), if applicable */
  mga?: Reference;

  /** The period during which this policy provides coverage */
  effectivePeriod: Period;

  /** Lines of business covered by this policy */
  linesOfBusiness?: CodeableConcept[];

  /** Total annual premium */
  totalPremium?: Money;

  /** Minimum earned premium (if applicable) */
  minimumPremium?: Money;

  /** Structured commission arrangement (replaces commissionPercentage) */
  commission?: Commission;

  /** References to Risk resources associated with this policy */
  risks?: Reference[];

  /** Reference to the underwriter (PersonRole) assigned to this policy */
  underwriter?: Reference;

  /** Reference to the account manager (PersonRole) for this policy */
  accountManager?: Reference;

  /**
   * Date/time the policy was bound.
   * @format date-time
   */
  boundDate?: string;

  /**
   * Date/time the policy was cancelled, if applicable.
   * @format date-time
   */
  cancelledDate?: string;

  /** Reason for cancellation, if applicable */
  cancellationReason?: CodeableConcept;

  /** Policy form (e.g., occurrence, claims-made) */
  coverageForm?: "occurrence" | "claims-made";

  /**
   * Retroactive date for claims-made policies.
   * @format date
   */
  retroactiveDate?: string;

  /** References to the individual coverage sections */
  coverages?: Reference[];

  /** Endorsements applied to this policy */
  endorsements?: Endorsement[];

  /** Reference to the quote that this policy was bound from */
  originatingQuote?: Reference;

  /** Policy documents (dec page, forms, endorsements) */
  documents?: Attachment[];

  /** Type of policy transaction (new-business, endorsement, renewal, etc.) */
  transactionType?: "new-business" | "endorsement" | "renewal" | "reinstatement" | "reissue" | "cancellation" | "non-renewal";

  /** Billing method for premium collection */
  billingMethod?: "direct-bill" | "agency-bill" | "pay-as-you-go" | "premium-finance";

  /** Premium payment frequency */
  billingFrequency?: "annual" | "semi-annual" | "quarterly" | "monthly";

  /** Preferred language for policy documents (BCP-47 tag, e.g. "en", "fr-CA") */
  language?: string;

  /** Additional interested parties — mortgagees, loss payees, additional insureds */
  additionalInterests?: AdditionalInterest[];

  /** Policy lifecycle transaction history */
  transactions?: PolicyTransaction[];

  /** Standard form references attached to this policy */
  forms?: InsuranceForm[];

  /** References to Note resources for this policy */
  notes?: Reference[];
}

/**
 * An endorsement (amendment) to an insurance policy.
 * Endorsements modify the terms, coverages, or conditions of the base policy.
 *
 * @example
 * {
 *   "endorsementNumber": "END-002",
 *   "type": { "text": "Mid-Term Modification" },
 *   "effectiveDate": "2025-09-01",
 *   "description": "Increase GL limits and add Hired & Non-Owned Auto",
 *   "premiumChange": { "value": 3200, "currency": "USD" },
 *   "changes": [
 *     {
 *       "coverage": { "reference": "Coverage/cov-gl-001", "display": "General Liability" },
 *       "action": "modify",
 *       "limits": [{ "type": { "text": "Each Occurrence" }, "amount": { "value": 2000000, "currency": "USD" } }],
 *       "premiumChange": { "value": 2500, "currency": "USD" },
 *       "description": "Increase each-occurrence limit from $1M to $2M"
 *     },
 *     {
 *       "coverage": { "reference": "Coverage/cov-gl-001", "display": "General Liability" },
 *       "action": "modify",
 *       "coverageExtensions": [{ "type": { "text": "Hired & Non-Owned Auto" }, "included": true, "sublimit": { "value": 1000000, "currency": "USD" }, "additionalPremium": { "value": 700, "currency": "USD" } }],
 *       "premiumChange": { "value": 700, "currency": "USD" },
 *       "description": "Add Hired & Non-Owned Auto extension"
 *     }
 *   ]
 * }
 */
export interface Endorsement {
  /** Endorsement number or identifier */
  endorsementNumber?: string;

  /** Type of endorsement */
  type: CodeableConcept;

  /**
   * Date the endorsement becomes effective.
   * @format date
   */
  effectiveDate: string;

  /** Description of what the endorsement changes */
  description?: string;

  /** Total premium change resulting from this endorsement (positive = additional, negative = return) */
  premiumChange?: Money;

  /** Atomic changes made by this endorsement, broken down by coverage */
  changes?: EndorsementChange[];

  /** Reference to the endorsement document/form */
  document?: Attachment;
}

/**
 * An atomic change within an endorsement, scoped to a single coverage.
 * Captures what was modified, added, or removed, along with the
 * premium impact attributable to this specific change.
 *
 * @example
 * {
 *   "coverage": { "reference": "Coverage/cov-gl-001", "display": "General Liability" },
 *   "action": "modify",
 *   "limits": [
 *     { "type": { "text": "Each Occurrence" }, "amount": { "value": 2000000, "currency": "USD" } }
 *   ],
 *   "premiumChange": { "value": 2500, "currency": "USD" },
 *   "description": "Increase each-occurrence limit from $1M to $2M"
 * }
 */
export interface EndorsementChange {
  /** Reference to the coverage being changed */
  coverage: Reference;

  /**
   * The action being performed on the coverage.
   *
   * - `add` — A new coverage is being added to the policy
   * - `modify` — An existing coverage is being changed
   * - `remove` — A coverage is being removed from the policy
   */
  action: "add" | "modify" | "remove";

  /** Modified or new coverage limits (values after the endorsement takes effect) */
  limits?: CoverageLimit[];

  /** Modified or new deductible */
  deductible?: Deductible;

  /** Modified, added, or removed coverage extensions */
  coverageExtensions?: CoverageExtension[];

  /** Modified classifications */
  classifications?: Classification[];

  /** Premium change attributable to this specific coverage change */
  premiumChange?: Money;

  /** Human-readable description of this specific change */
  description?: string;
}
