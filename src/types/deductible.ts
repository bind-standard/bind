// BIND Standard — Deductible
// Structured deductible information replacing inline Money on Coverage.

import type { CodeableConcept, Money } from "./base";

/**
 * A structured deductible definition for a coverage section.
 * Replaces the inline `Money` deductible and separate `deductibleType` fields,
 * capturing the full complexity of insurance deductible structures
 * including SIRs, corridors, franchises, and disappearing deductibles.
 *
 * @example
 * {
 *   "amount": { "value": 25000, "currency": "USD" },
 *   "type": "per-occurrence",
 *   "application": "loss-only",
 *   "isSIR": false,
 *   "aggregateAmount": { "value": 100000, "currency": "USD" }
 * }
 */
export interface Deductible {
  /** The deductible amount (required for fixed-amount deductibles, optional for percentage-based) */
  amount?: Money;

  /** How the deductible applies */
  type:
    | "per-occurrence"
    | "per-claim"
    | "aggregate"
    | "annual-aggregate"
    | "per-employee"
    | "per-project"
    | "percentage"
    | "hurricane"
    | "wind-hail"
    | "earthquake"
    | "all-perils";

  /** How loss adjustment expenses (ALAE/LAE) interact with the deductible */
  application?: "loss-only" | "alae-inclusive" | "alae-exclusive";

  /**
   * Whether this is a Self-Insured Retention (SIR) rather than a traditional deductible.
   * SIRs require the insured to handle claims within the retention before the carrier responds.
   */
  isSIR?: boolean;

  /** Aggregate cap on deductible obligations in a policy period */
  aggregateAmount?: Money;

  /**
   * Corridor percentage (used in corridor deductible structures).
   * Expressed as a percentage of the loss amount.
   */
  corridorPercentage?: number;

  /** Franchise deductible threshold — losses below this are fully retained; above, fully covered */
  franchiseAmount?: Money;

  /** Disappearing deductible threshold — deductible phases out above this loss amount */
  disappearingThreshold?: Money;

  /**
   * Percentage-based deductible (e.g., 2% hurricane deductible).
   * @minimum 0
   * @maximum 100
   */
  percentage?: number;

  /** What the percentage is applied to (e.g., "Coverage A dwelling value", "total insured value") */
  percentageBasis?: CodeableConcept;

  /** Free-text description of deductible terms */
  description?: string;
}
