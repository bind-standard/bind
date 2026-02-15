import type { Address, Attachment, CodeableConcept, Money, Reference, Resource } from "./base";

/**
 * A claim represents an insured's report of a loss or incident
 * that may be covered under their policy. This is the starting point
 * of the claims workflow in insurance.
 *
 * @example
 * {
 *   "resourceType": "Claim",
 *   "id": "clm-2025-5001",
 *   "status": "open",
 *   "claimNumber": "CLM-2025-005001",
 *   "policy": { "reference": "Policy/pol-2025-1001" },
 *   "insured": { "reference": "Insured/ins-001", "display": "Acme Manufacturing Corp" },
 *   "dateOfLoss": "2025-09-15",
 *   "dateReported": "2025-09-16T08:30:00Z",
 *   "lossType": { "coding": [{ "code": "BI", "display": "Bodily Injury" }] },
 *   "description": "Employee slip and fall in warehouse area",
 *   "lossLocation": { "line": ["123 Industrial Blvd"], "city": "Hartford", "state": "CT" }
 * }
 */
export interface Claim extends Resource {
  /** Fixed resource type discriminator */
  resourceType: "Claim";

  /**
   * Current status of the claim.
   *
   * - `open` — Claim is active and being handled
   * - `closed` — Claim has been resolved and closed
   * - `reopened` — Previously closed claim has been reopened
   * - `denied` — Claim coverage has been denied
   * - `subrogation` — In subrogation recovery phase
   */
  status: "open" | "closed" | "reopened" | "denied" | "subrogation";

  /** Carrier-assigned claim number */
  claimNumber: string;

  /** Reference to the policy under which the claim is filed */
  policy: Reference;

  /** Reference to the coverage section applicable to this claim */
  coverage?: Reference;

  /** Reference to the insured */
  insured: Reference;

  /**
   * Date the loss or incident occurred.
   * @format date
   */
  dateOfLoss: string;

  /**
   * Date/time the claim was reported to the carrier.
   * @format date-time
   */
  dateReported?: string;

  /**
   * Type/cause of loss.
   * @terminology https://bind.codes/loss-cause preferred
   */
  lossType: CodeableConcept;

  /** Narrative description of the loss or incident */
  description?: string;

  /** Location where the loss occurred */
  lossLocation?: Address;

  /**
   * Reference to the assigned adjuster.
   * @deprecated Use `assignments` for richer multi-party claim handling.
   */
  adjuster?: Reference;

  /** Claimant(s) — parties making the claim */
  claimants?: Claimant[];

  /** Financial reserves and payment summary */
  financials?: ClaimFinancials;

  /** Litigation status */
  litigationStatus?: "none" | "threatened" | "filed" | "settled" | "judgment";

  /** Supporting documents (photos, police reports, medical records, etc.) */
  documents?: Attachment[];

  /**
   * Structured cause of loss.
   * @terminology https://bind.codes/loss-cause preferred
   */
  lossCause?: CodeableConcept;

  /**
   * High-level loss category (property, liability, medical, auto, workers-comp).
   * @terminology https://bind.codes/loss-kind preferred
   */
  lossKind?: CodeableConcept;

  /**
   * Time of day the loss occurred.
   * @format time
   */
  lossTime?: string;

  /**
   * Assigned parties with roles — replaces single adjuster field for complex claims.
   * @see adjuster for backward-compatible single adjuster reference
   */
  assignments?: ClaimsAssignment[];

  /** Police, fire, incident, and appraisal reports related to this claim */
  reports?: ClaimReport[];

  /** Subrogation recovery tracking */
  subrogation?: SubrogationDetail;
}

/**
 * A party making a claim or involved in a claim.
 *
 * @example
 * {
 *   "name": "John Smith",
 *   "role": "injured-party",
 *   "contact": { "line": ["456 Oak St"], "city": "Hartford", "state": "CT" }
 * }
 */
export interface Claimant {
  /** Name of the claimant */
  name: string;

  /** Role of the claimant in the loss */
  role: "insured" | "employee" | "third-party" | "injured-party" | "property-owner";

  /** Claimant's address */
  contact?: Address;

  /** Attorney information, if represented */
  attorney?: {
    /** Attorney's name */
    name: string;
    /** Law firm name */
    firm?: string;
  };
}

/**
 * Financial summary of a claim, including reserves and payments.
 *
 * @example
 * {
 *   "totalIncurred": { "value": 150000, "currency": "USD" },
 *   "totalPaid": { "value": 75000, "currency": "USD" },
 *   "totalReserves": { "value": 75000, "currency": "USD" }
 * }
 */
export interface ClaimFinancials {
  /** Total incurred (paid + outstanding reserves) */
  totalIncurred?: Money;

  /** Total amount paid to date */
  totalPaid?: Money;

  /** Outstanding reserves */
  totalReserves?: Money;

  /** Amount recovered through subrogation */
  subrogationRecovery?: Money;

  /** Deductible amount applicable to this claim */
  deductibleApplied?: Money;

  /** Individual payment transactions */
  payments?: ClaimPayment[];
}

/**
 * An individual payment made on a claim.
 */
export interface ClaimPayment {
  /**
   * Date the payment was made.
   * @format date
   */
  paymentDate: string;

  /** Amount of the payment */
  amount: Money;

  /** Type of payment */
  paymentType: "indemnity" | "expense" | "medical" | "legal" | "salvage";

  /** Payee — who received the payment */
  payee?: string;

  /** Description of what the payment covers */
  description?: string;
}

/**
 * An assignment of a person to handle part of a claim.
 */
export interface ClaimsAssignment {
  person: Reference;
  role: "adjuster" | "appraiser" | "investigator" | "defense-counsel" | "expert";
  /** @format date */
  assignedDate?: string;
  status?: "active" | "completed" | "reassigned";
}

/**
 * A report filed in connection with a claim.
 */
export interface ClaimReport {
  reportType: "police" | "fire" | "incident" | "appraisal";
  reportNumber?: string;
  agency?: string;
  /** @format date */
  date?: string;
  attachment?: Attachment;
}

/**
 * Subrogation tracking details for recovery from responsible parties.
 */
export interface SubrogationDetail {
  responsibleParty?: string;
  thirdPartyInsurer?: string;
  thirdPartyPolicyNumber?: string;
  potentialRecovery?: Money;
  actualRecovery?: Money;
  status?: "identified" | "in-progress" | "recovered" | "abandoned";
}
