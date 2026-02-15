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
  role: "mortgagee" | "loss-payee" | "additional-insured" | "certificate-holder" | "lienholder";
  rank?: number;
  subtypes?: ("blanket" | "scheduled" | "primary-non-contributory")[];
  loanNumber?: string;
  notificationPreference?: CodeableConcept;
}
