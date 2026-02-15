import type {
  Address,
  CodeableConcept,
  Coding,
  ContactPoint,
  Money,
  Reference,
  Resource,
} from "./base";
import type { FinancialRating } from "./financial-rating";
import type { CarrierAppointment, InsuranceSpecialty } from "./insurance-common";
import type { License } from "./person";

/**
 * An organization involved in the insurance ecosystem.
 * This includes carriers, brokers, MGAs, TPAs, reinsurers, and other entities.
 *
 * @example
 * {
 *   "resourceType": "Organization",
 *   "id": "org-carrier-200",
 *   "status": "active",
 *   "name": "Hartford Financial Services",
 *   "type": { "coding": [{ "code": "carrier", "display": "Insurance Carrier" }] },
 *   "naic": { "code": "29459", "display": "Hartford Fire Insurance Company" },
 *   "amBestRating": { "code": "A+", "display": "Superior" },
 *   "address": [{ "line": ["One Hartford Plaza"], "city": "Hartford", "state": "CT", "postalCode": "06155" }]
 * }
 */
export interface Organization extends Resource {
  /** Fixed resource type discriminator */
  resourceType: "Organization";

  /** Whether this organization record is active */
  status: "active" | "inactive";

  /** Official name of the organization */
  name: string;

  /**
   * Type of organization in the insurance ecosystem.
   * Common types: carrier, broker, mga, tpa, reinsurer, surplus-lines-broker
   */
  type: CodeableConcept;

  /**
   * NAIC (National Association of Insurance Commissioners) company code.
   * Uniquely identifies insurance companies in the US.
   */
  naic?: Coding;

  /**
   * FEIN (Federal Employer Identification Number).
   */
  fein?: Coding;

  /** AM Best financial strength rating */
  amBestRating?: Coding;

  /** S&P financial strength rating */
  spRating?: Coding;

  /** Physical and mailing addresses */
  address?: Address[];

  /** Contact information */
  contact?: ContactPoint[];

  /** States in which this carrier is licensed to write business */
  licensedStates?: string[];

  /** Lines of business this organization writes or handles */
  linesOfBusiness?: CodeableConcept[];

  /** Whether this is an admitted or non-admitted (surplus lines) carrier */
  admittedStatus?: "admitted" | "non-admitted" | "both";

  /** Reference to a parent organization */
  partOf?: Reference;

  /** Structured financial strength ratings (supersedes amBestRating, spRating for richer detail) */
  financialRatings?: FinancialRating[];

  /** Carrier appointments for brokers and MGAs */
  appointments?: CarrierAppointment[];

  /** Reference to the broker's E&O policy */
  eAndOPolicy?: Reference;

  /** Business entity type (LLC, Corp, Mutual, Reciprocal, etc.) */
  entityType?: CodeableConcept;

  /** Organizational hierarchy level */
  organizationLevel?: "legal-entity" | "operating-company" | "group" | "holding-company";

  /** Insurance specialties and lines of business for departments */
  specialties?: InsuranceSpecialty[];

  /** Insurance licenses held by this organization */
  licenses?: License[];

  /** Geographic territories where this organization operates (supersedes licensedStates for richer detail) */
  territories?: string[];

  /** Binding authority limits for MGAs and delegated underwriting authorities */
  bindingAuthority?: {
    /** Maximum premium amount this organization can bind */
    maxPremium?: Money;
    /** Maximum limit of insurance this organization can bind */
    maxLimit?: Money;
    /** Lines of business this organization can bind */
    linesOfBusiness?: CodeableConcept[];
  };
}
