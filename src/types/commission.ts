// BIND Standard — Commission
// Structured commission information replacing commissionPercentage on Policy.

import type { CodeableConcept, Money, Reference } from "./base";

/**
 * A commission arrangement for a policy.
 * Replaces the simple `commissionPercentage` field on Policy,
 * supporting standard, contingent, override, and profit-sharing commissions
 * with tiered structures and multi-party splits.
 *
 * @example
 * {
 *   "type": { "text": "Standard" },
 *   "percentage": 15,
 *   "payableTo": { "reference": "Organization/broker-100", "display": "Marsh McLennan" },
 *   "schedule": "on-effective"
 * }
 */
export interface Commission {
  /** Type of commission (standard, contingent, override, bonus, profit-sharing) */
  type: CodeableConcept;

  /** Commission percentage */
  percentage?: number;

  /** Commission as a fixed dollar amount */
  amount?: Money;

  /** Organization the commission is payable to (broker/agency) */
  payableTo?: Reference;

  /** Individual producer who earned the commission (PersonRole reference) */
  producer?: Reference;

  /** When commission is earned/payable */
  schedule?: "on-binding" | "on-effective" | "on-collection" | "installment";

  /** Tiered commission schedule based on loss ratio */
  tiers?: CommissionTier[];

  /** Commission splits between multiple parties */
  splits?: CommissionSplit[];
}

/**
 * A tier in a sliding-scale commission arrangement.
 * Commission percentage varies based on loss ratio performance.
 */
export interface CommissionTier {
  /** Lower bound of the loss ratio range (inclusive) */
  lossRatioFrom?: number;

  /** Upper bound of the loss ratio range (exclusive) */
  lossRatioTo?: number;

  /** Commission percentage for this tier */
  percentage: number;
}

/**
 * A commission split between multiple parties.
 * Used when commission is shared between wholesaler/retailer,
 * house account/producer, or multiple producers.
 */
export interface CommissionSplit {
  /** Reference to the party receiving this split */
  party: Reference;

  /** Percentage of the total commission allocated to this party */
  percentage: number;

  /** Dollar amount allocated to this party */
  amount?: Money;

  /** Role of this party in the split (e.g., house, producer, wholesaler) */
  role?: CodeableConcept;
}
