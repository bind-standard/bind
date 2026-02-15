import type { Address, CodeableConcept, Coding, ContactPoint, Reference, Resource } from "./base";
import type { HumanName } from "./datatypes";
import type { LossHistory } from "./loss-history";

/**
 * An insured entity in the BIND system.
 * Represents the policyholder — a business or individual seeking or holding insurance coverage.
 * @example
 * {
 *   "resourceType": "Insured",
 *   "id": "ins-001",
 *   "status": "active",
 *   "name": "Acme Manufacturing Corp",
 *   "type": "organization",
 *   "taxId": { "system": "urn:oid:2.16.840.1.113883.4.4", "value": "12-3456789" },
 *   "naicsCode": { "code": "332710", "display": "Machine Shops" },
 *   "address": [{ "line": ["123 Industrial Blvd"], "city": "Hartford", "state": "CT", "postalCode": "06103" }],
 *   "contact": [{ "system": "email", "value": "risk@acme.com", "use": "work" }],
 *   "yearEstablished": 1985,
 *   "annualRevenue": { "value": 25000000, "currency": "USD" }
 * }
 */
export interface Insured extends Resource {
  /** Fixed resource type discriminator */
  resourceType: "Insured";

  /** Whether this insured record is currently active */
  status: "active" | "inactive" | "prospect";

  /** Legal name of the insured entity */
  name: string;

  /** Whether the insured is an individual or an organization */
  type: "individual" | "organization";

  /**
   * Doing-business-as name, if different from the legal name.
   */
  dba?: string;

  /**
   * Federal Tax Identification Number (EIN or SSN).
   * Stored as a coded value with system identifier.
   */
  taxId?: Coding;

  /**
   * NAICS (North American Industry Classification System) code
   * describing the insured's primary business activity.
   *
   * @see https://www.census.gov/naics/
   */
  naicsCode?: Coding;

  /**
   * SIC (Standard Industrial Classification) code.
   * Legacy classification system still used by some carriers.
   */
  sicCode?: Coding;

  /** Physical and mailing addresses */
  address?: Address[];

  /** Contact information (phone, email, etc.) */
  contact?: ContactPoint[];

  /**
   * Year the business was established.
   * @minimum 1600
   * @maximum 2100
   */
  yearEstablished?: number;

  /**
   * Total number of employees.
   * @minimum 0
   */
  employeeCount?: number;

  /** Annual revenue of the insured entity */
  annualRevenue?: {
    /** Revenue amount */
    value: number;
    /**
     * ISO 4217 currency code.
     * @default "USD"
     */
    currency?: string;
  };

  /** The entity's website */
  website?: string;

  /** Legal entity type */
  entityType?: CodeableConcept;

  /** Reference to a parent organization, if this insured is a subsidiary */
  partOf?: Reference;

  // --- Personal Lines Fields (populated when type === "individual") ---

  /** Structured name for individual insureds */
  individualName?: HumanName;

  /**
   * Date of birth of the individual insured.
   * @format date
   */
  dateOfBirth?: string;

  /** Gender of the individual insured */
  gender?: "male" | "female" | "other" | "unknown";

  /** Marital status of the individual insured */
  maritalStatus?: "single" | "married" | "divorced" | "widowed" | "domestic-partner";

  /** Occupation of the individual insured */
  occupation?: string;

  /** Credit score tier for rating purposes */
  creditScoreTier?: CodeableConcept;

  /** Portable loss history across policies for this insured */
  lossHistory?: LossHistory[];
}
