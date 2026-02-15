// BIND Standard — Named Driver
// A named driver on a personal auto policy.

import type { CodeableConcept, Reference } from "./base";
import type { HumanName } from "./datatypes";

/**
 * A named driver on a personal auto policy.
 * Structured type because drivers have enough fields to warrant
 * dedicated modeling beyond generic RiskCharacteristics.
 *
 * @example
 * {
 *   "name": { "family": "Smith", "given": ["John"] },
 *   "dateOfBirth": "1985-03-15",
 *   "licenseNumber": "D123-4567-8901",
 *   "licenseState": "CA",
 *   "licenseStatus": "valid",
 *   "driverStatus": "rated",
 *   "primaryUse": "commute",
 *   "annualMileage": 12000
 * }
 */
export interface NamedDriver {
  /** The driver's name */
  name: HumanName;

  /**
   * The driver's date of birth.
   * @format date
   */
  dateOfBirth?: string;

  /** The driver's gender */
  gender?: "male" | "female" | "other" | "unknown";

  /** Driver's license number */
  licenseNumber?: string;

  /** Two-letter state code where the license was issued */
  licenseState?: string;

  /** Current status of the driver's license */
  licenseStatus?: "valid" | "suspended" | "revoked" | "expired" | "permit" | "unlicensed";

  /**
   * Date the driver was first licensed.
   * @format date
   */
  dateFirstLicensed?: string;

  /** How this driver is rated on the policy */
  driverStatus: "rated" | "excluded" | "permitted" | "not-rated";

  /** Relationship of this driver to the named insured (spouse, child, household-member, employee) */
  relationshipToInsured?: CodeableConcept;

  /** Primary use of the vehicle by this driver */
  primaryUse?: "commute" | "business" | "pleasure" | "farm";

  /**
   * Estimated annual mileage driven.
   * @minimum 0
   */
  annualMileage?: number;

  /** Driving violations and incidents on this driver's record */
  violations?: DrivingViolation[];

  /** Whether the driver has completed a defensive driving course */
  defensiveDrivingCourse?: boolean;

  /** Whether the driver qualifies for a good student discount */
  goodStudentDiscount?: boolean;

  /** Optional reference to a Person resource for this driver */
  person?: Reference;

  /** Whether an SR-22 filing is required for this driver */
  sr22Required?: boolean;
}

/**
 * A driving violation or incident on a driver's record.
 *
 * @example
 * {
 *   "type": { "text": "Speeding" },
 *   "date": "2024-06-15",
 *   "points": 2,
 *   "atFault": false
 * }
 */
export interface DrivingViolation {
  /** Type of violation (speeding, DUI, at-fault-accident, etc.) */
  type: CodeableConcept;

  /**
   * Date the violation occurred.
   * @format date
   */
  date?: string;

  /** Number of points assessed */
  points?: number;

  /** Whether the driver was at fault */
  atFault?: boolean;

  /** Free-text description of the violation */
  description?: string;
}
