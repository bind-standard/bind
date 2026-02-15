// BIND Standard — Person Resource
// Represents an individual in the insurance ecosystem.

import type { Address, CodeableConcept, Coding, ContactPoint, Resource } from "./base";
import type { HumanName } from "./datatypes";

/**
 * An individual person involved in the insurance ecosystem.
 * Represents brokers, underwriters, adjusters, producers, actuaries, and other
 * professionals. Connects to organizations via PersonRole.
 *
 * @example
 * {
 *   "resourceType": "Person",
 *   "id": "per-001",
 *   "status": "active",
 *   "name": {
 *     "use": "official",
 *     "text": "Sarah J. Chen, CPCU, ARM",
 *     "family": "Chen",
 *     "given": ["Sarah", "Jane"],
 *     "suffix": ["CPCU", "ARM"]
 *   },
 *   "npn": "12345678",
 *   "designations": [
 *     { "code": "CPCU", "display": "Chartered Property Casualty Underwriter" },
 *     { "code": "ARM", "display": "Associate in Risk Management" }
 *   ]
 * }
 */
export interface Person extends Resource {
  /** Fixed resource type discriminator */
  resourceType: "Person";

  /** Whether this person record is active */
  status: "active" | "inactive";

  /** The person's name */
  name: HumanName;

  /** Contact information (phone, email, etc.) */
  contact?: ContactPoint[];

  /** Physical and mailing addresses */
  address?: Address[];

  /** Professional designations and certifications (CPCU, ARM, CIC, AU, AINS) */
  designations?: Coding[];

  /** Insurance licenses held by this person */
  licenses?: License[];

  /** National Producer Number from NIPR (National Insurance Producer Registry) */
  npn?: string;

  /** Free-text notes about this person */
  notes?: string;
}

/**
 * An insurance license held by a person.
 * Tracks state-level licensing, lines of authority, and license status.
 *
 * @example
 * {
 *   "state": "CT",
 *   "licenseNumber": "LIC-2345678",
 *   "status": "active",
 *   "lineOfAuthority": { "text": "Property & Casualty" },
 *   "expirationDate": "2026-12-31"
 * }
 */
export interface License {
  /** State or jurisdiction of the license (two-letter state code) */
  state: string;

  /** License number assigned by the state */
  licenseNumber: string;

  /** Line of authority covered by this license */
  lineOfAuthority?: CodeableConcept;

  /** Current status of the license */
  status: "active" | "inactive" | "expired" | "suspended" | "revoked";

  /**
   * License expiration date.
   * @format date
   */
  expirationDate?: string;

  /**
   * Date the license was issued.
   * @format date
   */
  issueDate?: string;
}
