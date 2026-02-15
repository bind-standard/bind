// BIND Standard — Premium
// Structured premium information replacing inline Money on Coverage.

import type { CodeableConcept, Money, Quantity, Reference } from "./base";

/**
 * Comprehensive premium structure for a coverage section.
 * Replaces the inline `Money` premium, `rate`, `rateBasis`, `exposure`,
 * and `experienceModFactor` fields, capturing the full lifecycle of
 * insurance premium from estimate through audit.
 *
 * @example
 * {
 *   "writtenPremium": { "value": 42000, "currency": "USD" },
 *   "depositPremium": { "value": 21000, "currency": "USD" },
 *   "basis": {
 *     "ratePerUnit": 2.45,
 *     "rateBasis": { "text": "per $100 of payroll" },
 *     "exposureAmount": { "value": 1500000, "unit": "payroll" }
 *   },
 *   "isAuditable": true
 * }
 */
export interface Premium {
  /** The written (booked) premium for this coverage */
  writtenPremium: Money;

  /** Minimum premium — floor below which premium cannot be reduced */
  minimumPremium?: Money;

  /** Deposit premium — amount due at inception for auditable policies */
  depositPremium?: Money;

  /** Estimated premium — projected premium based on estimated exposures */
  estimatedPremium?: Money;

  /** Audited premium — final premium determined by premium audit */
  auditedPremium?: Money;

  /** How the premium was calculated (rate, basis, exposure) */
  basis?: PremiumBasis;

  /** Premium modifications and adjustments (experience mod, schedule credits, etc.) */
  adjustments?: PremiumAdjustment[];

  /** Whether this coverage is subject to premium audit */
  isAuditable?: boolean;

  /** Payment installment schedule */
  installments?: PremiumInstallment[];

  /** Premium allocation by location or classification */
  allocationByLocation?: PremiumAllocation[];
}

/**
 * The rating basis used to calculate premium.
 * Captures the rate, what it's applied to, and the exposure measure.
 */
export interface PremiumBasis {
  /** Rate per unit of exposure (e.g., 2.45 per $100 of payroll) */
  ratePerUnit?: number;

  /** Description of the rate basis (e.g., "per $100 of payroll", "per $1,000 of revenue") */
  rateBasis?: CodeableConcept;

  /** The exposure measure used in the calculation */
  exposureAmount?: Quantity;

  /** Base premium before adjustments (if flat-rated or minimum applies) */
  basePremium?: Money;
}

/**
 * A premium adjustment or modification factor.
 * Represents experience modifications, schedule credits/debits, IRPMs, and similar adjustments.
 *
 * @example
 * {
 *   "type": { "text": "Experience Modification" },
 *   "factor": 0.85,
 *   "description": "15% credit based on 3-year loss history"
 * }
 */
export interface PremiumAdjustment {
  /** Type of adjustment (experience-mod, schedule-credit, schedule-debit, IRPM, etc.) */
  type: CodeableConcept;

  /** Multiplicative factor (e.g., 0.85 = 15% credit, 1.15 = 15% debit) */
  factor?: number;

  /** Fixed dollar adjustment amount */
  amount?: Money;

  /** Description of the adjustment */
  description?: string;
}

/**
 * A premium payment installment.
 */
export interface PremiumInstallment {
  /** Installment sequence number */
  installmentNumber: number;

  /**
   * Date the installment is due.
   * @format date
   */
  dueDate: string;

  /** Installment amount */
  amount: Money;

  /** Payment status */
  status?: "due" | "paid" | "overdue" | "waived";
}

/**
 * Premium allocation to a specific location or classification.
 * Used for multi-location policies and state-by-state breakdowns.
 */
export interface PremiumAllocation {
  /** Reference to the location this premium is allocated to */
  location?: Reference;

  /** Classification or category for this allocation */
  classification?: CodeableConcept;

  /** Reference to the risk this premium is allocated to (for per-vehicle breakdowns) */
  risk?: Reference;

  /** Allocated premium amount */
  amount: Money;
}
