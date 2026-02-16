// BIND Standard — Additional Interests
// Mortgagees, loss payees, additional insureds, and other interested parties.

import type { CodeableConcept, Reference } from "./base";

/**
 * An additional interested party on a policy or coverage.
 * @example
 * {
 *   "party": { "reference": "Organization/bank-001", "display": "First National Bank" },
 *   "role": "mortgagee",
 *   "rank": 1,
 *   "loanNumber": "MORT-2024-56789"
 * }
 */
export interface AdditionalInterest {
  party: Reference;
  /** @terminology https://bind.codes/AdditionalInterestRole extensible */
  role: CodeableConcept;
  rank?: number;
  /** @terminology https://bind.codes/AdditionalInterestSubtype extensible */
  subtypes?: CodeableConcept[];
  loanNumber?: string;
  notificationPreference?: CodeableConcept;
}
