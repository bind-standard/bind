// BIND Standard — Common Insurance Types
// Shared supporting types used across multiple resources.

import type { CodeableConcept, Coding, Money, Period, Reference } from "./base";

/**
 * A specialty or line-of-business classification.
 * Describes the specific insurance products, forms, and rating bureaus
 * associated with a coverage, department, or person's expertise.
 *
 * @example
 * {
 *   "line": { "coding": [{ "code": "GL", "display": "General Liability" }] },
 *   "ratingBureau": { "code": "ISO", "display": "Insurance Services Office" },
 *   "formNumber": "CG 00 01"
 * }
 */
export interface InsuranceSpecialty {
  /** Primary line of business (GL, Property, WC, Auto, etc.) */
  line: CodeableConcept;

  /** Sub-line or coverage part (Products/Completed Ops, Premises, etc.) */
  subLine?: CodeableConcept;

  /** Rating bureau or advisory organization (ISO, NCCI, AAIS) */
  ratingBureau?: Coding;

  /** Standard form number (e.g., CG 00 01, CP 00 10) */
  formNumber?: string;

  /** Named program, if applicable */
  program?: string;
}

/**
 * An appointment between a broker/MGA and a carrier.
 * Tracks which carriers an agency is authorized to write business with.
 *
 * @example
 * {
 *   "carrier": { "reference": "Organization/carrier-200", "display": "Hartford" },
 *   "status": "active",
 *   "linesOfBusiness": [{ "coding": [{ "code": "GL" }] }]
 * }
 */
export interface CarrierAppointment {
  /** Reference to the carrier organization */
  carrier: Reference;

  /** Current status of the appointment */
  status: "active" | "inactive" | "pending" | "terminated";

  /** Lines of business authorized under this appointment */
  linesOfBusiness?: CodeableConcept[];

  /** Period during which this appointment is/was effective */
  effectivePeriod?: Period;

  /** Type of commission arrangement under this appointment */
  commissionType?: CodeableConcept;
}

/**
 * A component of a split limit structure.
 * Used when a coverage has separate limits for different categories
 * (e.g., auto liability split limits: 100/300/100).
 */
export interface SplitLimitComponent {
  /** The category of this split limit component (e.g., Per Person BI, Per Accident BI, PD) */
  category: CodeableConcept;

  /** The limit amount for this component */
  amount: Money;
}
