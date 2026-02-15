import type { CodeableConcept, Money, Period, Reference, Resource } from "./base";

/**
 * A quote represents a carrier's offer to provide insurance coverage
 * at a specified premium. Quotes are produced in response to a Submission
 * and contain the proposed terms, pricing, and conditions.
 *
 * @example
 * {
 *   "resourceType": "Quote",
 *   "id": "qt-2025-042",
 *   "status": "offered",
 *   "submission": { "reference": "Submission/sub-2025-001" },
 *   "insured": { "reference": "Insured/ins-001", "display": "Acme Manufacturing Corp" },
 *   "carrier": { "reference": "Organization/carrier-200", "display": "Hartford Financial" },
 *   "proposedEffective": { "start": "2025-07-01", "end": "2026-07-01" },
 *   "totalPremium": { "value": 85000, "currency": "USD" },
 *   "quoteDate": "2025-05-01T14:30:00Z",
 *   "validUntil": "2025-06-15"
 * }
 */
export interface Quote extends Resource {
  /** Fixed resource type discriminator */
  resourceType: "Quote";

  /**
   * Current status of the quote.
   *
   * - `draft` — Being prepared by the underwriter
   * - `offered` — Sent to the broker as a formal offer
   * - `accepted` — Broker/insured has accepted the quote
   * - `rejected` — Broker/insured has declined the quote
   * - `expired` — Quote validity period has passed
   * - `bound` — Quote has been bound into a policy
   * - `superseded` — Replaced by a newer version of the quote
   */
  status: "draft" | "offered" | "accepted" | "rejected" | "expired" | "bound" | "superseded";

  /** Reference to the submission that triggered this quote */
  submission?: Reference;

  /** Reference to the insured entity */
  insured: Reference;

  /** Reference to the quoting carrier */
  carrier: Reference;

  /** Reference to the underwriter who prepared this quote */
  underwriter?: Reference;

  /** Proposed policy effective period */
  proposedEffective?: Period;

  /**
   * Total annual premium for all coverages.
   */
  totalPremium?: Money;

  /** Breakdown of premium by line of business */
  premiumBreakdown?: PremiumLineItem[];

  /**
   * Date/time the quote was issued.
   * @format date-time
   */
  quoteDate?: string;

  /**
   * Date after which this quote is no longer valid.
   * @format date
   */
  validUntil?: string;

  /** Conditions or subjectivities that must be met before binding */
  subjectivities?: Subjectivity[];

  /** Free-text terms, conditions, or exclusions */
  termsAndConditions?: string;

  /** Reference to the resulting policy, if bound */
  resultingPolicy?: Reference;

  /**
   * Quote version number. Incremented when the quote is revised.
   * @minimum 1
   */
  version?: number;

  /** References to Risk resources included in this quote */
  risks?: Reference[];
}

/**
 * A premium line item breaking down the cost by coverage line.
 */
export interface PremiumLineItem {
  /** Line of business this premium applies to */
  lineOfBusiness: CodeableConcept;

  /** Premium amount for this line */
  premium: Money;

  /** Rate basis description (e.g. "per $1,000 of payroll") */
  rateBasis?: string;

  /** The rate applied */
  rate?: number;

  /** Exposure base value (e.g. total payroll, total sales) */
  exposureBase?: number;
}

/**
 * A condition that must be satisfied before a quote can be bound.
 * Common in insurance — e.g., "Provide updated loss runs"
 * or "Install fire suppression system within 90 days."
 *
 * @example
 * {
 *   "description": "Provide audited financial statements for last 3 years",
 *   "type": "pre-bind",
 *   "status": "outstanding"
 * }
 */
export interface Subjectivity {
  /** Description of what must be done or provided */
  description: string;

  /** Whether this must be resolved before or after binding */
  type: "pre-bind" | "post-bind";

  /** Current status of the subjectivity */
  status: "outstanding" | "satisfied" | "waived";

  /**
   * Deadline for satisfying this subjectivity.
   * @format date
   */
  dueDate?: string;
}
