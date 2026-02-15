// BIND Standard — PersonRole Resource
// Connects a Person to an Organization in a specific capacity.

import type { CodeableConcept, ContactPoint, Money, Period, Reference, Resource } from "./base";

/**
 * The role a Person plays within an Organization.
 * Handles relationships like "Sarah is an underwriter at Hartford for commercial property."
 * Includes binding authority and reporting structure.
 *
 * @example
 * {
 *   "resourceType": "PersonRole",
 *   "id": "pr-001",
 *   "status": "active",
 *   "person": { "reference": "Person/per-001", "display": "Sarah Chen" },
 *   "organization": { "reference": "Organization/carrier-200", "display": "Hartford" },
 *   "role": { "coding": [{ "code": "underwriter", "display": "Underwriter" }] },
 *   "specialty": [{ "coding": [{ "code": "commercial-property", "display": "Commercial Property" }] }],
 *   "bindingAuthority": {
 *     "maxPremium": { "value": 500000, "currency": "USD" },
 *     "maxLimit": { "value": 10000000, "currency": "USD" }
 *   }
 * }
 */
export interface PersonRole extends Resource {
  /** Fixed resource type discriminator */
  resourceType: "PersonRole";

  /** Whether this role assignment is currently active */
  status: "active" | "inactive" | "on-leave";

  /** Reference to the person fulfilling this role */
  person: Reference;

  /** Reference to the organization the person works for/with */
  organization: Reference;

  /**
   * The role the person plays (underwriter, broker, producer, adjuster, actuary, etc.)
   * @terminology https://bind.codes/producer-role preferred
   */
  role: CodeableConcept;

  /** Lines of business or areas of specialization */
  specialty?: CodeableConcept[];

  /** Period during which this role assignment is/was effective */
  period?: Period;

  /** Role-specific contact information (may differ from Person.contact) */
  contact?: ContactPoint[];

  /** Binding authority granted under this role */
  bindingAuthority?: {
    /** Maximum premium amount this person can bind */
    maxPremium?: Money;
    /** Maximum limit of insurance this person can bind */
    maxLimit?: Money;
    /** Lines of business this person can bind */
    linesOfBusiness?: CodeableConcept[];
    /** Geographic territories this person can bind */
    territory?: string[];
  };

  /** Reference to the person this role reports to (PersonRole reference) */
  reportsTo?: Reference;

  /** Subtype of producer role for distribution channel tracking */
  producerType?: "producing-agent" | "servicing-agent" | "sub-producer" | "wholesaler";
}
