// BIND Standard — Exclusions and Policy Conditions
// Structured representations of policy exclusions, warranties, and conditions.

import type { CodeableConcept, Period, Reference } from "./base";

/**
 * A structured exclusion on a coverage or policy.
 * @example
 * {
 *   "code": { "coding": [{ "code": "pollution", "display": "Pollution Exclusion" }] },
 *   "description": "Total pollution exclusion per standard ISO form",
 *   "buybackAvailable": true
 * }
 */
export interface Exclusion {
  code: CodeableConcept;
  description?: string;
  effectivePeriod?: Period;
  buybackAvailable?: boolean;
  endorsementRef?: Reference;
}

/**
 * A policy condition, warranty, or protective safeguard requirement.
 * @example
 * {
 *   "code": { "coding": [{ "code": "sprinkler-maintenance", "display": "Sprinkler Maintenance" }] },
 *   "type": "protective-safeguard",
 *   "description": "Automatic sprinkler system must be maintained per NFPA 25"
 * }
 */
export interface PolicyCondition {
  code: CodeableConcept;
  type: "warranty" | "protective-safeguard" | "condition";
  description?: string;
  effectivePeriod?: Period;
}
