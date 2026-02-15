// BIND Standard — Loss History
// Historical loss experience for underwriting evaluation.

import type { CodeableConcept, Money, Period, Reference } from "./base";
import type { BindPercentage } from "./primitives";

/**
 * A large individual loss event within a loss history period.
 * @example
 * {
 *   "dateOfLoss": "2023-03-15",
 *   "description": "Warehouse fire caused by electrical fault",
 *   "lossType": { "coding": [{ "code": "fire", "display": "Fire" }] },
 *   "totalIncurred": { "value": 450000, "currency": "USD" },
 *   "status": "closed"
 * }
 */
export interface LargeLoss {
  /** @format date */
  dateOfLoss: string;
  description: string;
  lossType?: CodeableConcept;
  totalIncurred: Money;
  status?: "open" | "closed" | "reserved";
}

/**
 * Summary of historical loss experience for a specific period and line of business.
 * Used in submissions and underwriting to evaluate risk quality.
 * @example
 * {
 *   "period": { "start": "2022-01-01", "end": "2023-01-01" },
 *   "carrier": { "reference": "Organization/carrier-200", "display": "Hartford" },
 *   "policyNumber": "CGL-2022-001",
 *   "lineOfBusiness": { "coding": [{ "code": "GL", "display": "General Liability" }] },
 *   "totalClaims": 3,
 *   "totalIncurred": { "value": 125000, "currency": "USD" },
 *   "totalPaid": { "value": 95000, "currency": "USD" }
 * }
 */
export interface LossHistory {
  period: Period;
  carrier?: Reference;
  policyNumber?: string;
  lineOfBusiness?: CodeableConcept;
  totalClaims?: number;
  totalIncurred?: Money;
  totalPaid?: Money;
  openClaims?: number;
  largeLosses?: LargeLoss[];
  /** @minimum 0 @maximum 100 */
  lossRatio?: BindPercentage;
}
