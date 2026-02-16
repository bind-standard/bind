// BIND Standard — Policy Transaction
// Lifecycle events that modify a policy over time.

import type { CodeableConcept, Money, Reference } from "./base";

/**
 * A lifecycle transaction on a policy.
 * @example
 * {
 *   "transactionType": "endorsement",
 *   "policy": { "reference": "Policy/pol-2025-1001" },
 *   "effectiveDate": "2025-09-01",
 *   "reason": { "coding": [{ "code": "limit-increase", "display": "Limit Increase" }] },
 *   "premiumChange": { "value": 3200, "currency": "USD" }
 * }
 */
export interface PolicyTransaction {
  /** @terminology https://bind.codes/TransactionType extensible */
  transactionType: "new-business" | "endorsement" | "renewal" | "reinstatement" | "reissue" | "cancellation" | "non-renewal";
  policy: Reference;
  /** @format date */
  effectiveDate: string;
  initiatedBy?: Reference;
  reason?: CodeableConcept;
  description?: string;
  premiumChange?: Money;
}
