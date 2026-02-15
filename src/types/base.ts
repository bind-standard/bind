/**
 * Base resource interface for all BIND resources.
 * Every resource in the BIND standard extends this base type.
 *
 * @example
 * {
 *   "resourceType": "Policy",
 *   "id": "pol-abc-123",
 *   "meta": {
 *     "versionId": "1",
 *     "lastUpdated": "2025-01-15T10:30:00Z",
 *     "source": "https://carrier.example.com"
 *   }
 * }
 */
export interface Resource {
  /** Discriminator field identifying the BIND resource type */
  resourceType: string;

  /**
   * Logical id of this resource.
   * Assigned by the server or originating system.
   */
  id?: string;

  /** Metadata about the resource */
  meta?: Meta;
}

/**
 * Metadata about a resource instance.
 * Tracks versioning, provenance, and timestamps.
 */
export interface Meta {
  /**
   * Version-specific identifier for this resource version.
   * Changes each time the resource is updated.
   */
  versionId?: string;

  /**
   * When this resource was last updated.
   * @format date-time
   */
  lastUpdated?: string;

  /**
   * URI identifying the originating system that created or last modified this resource.
   * @format uri
   */
  source?: string;

  /** Security or access control tags */
  tag?: Coding[];
}

/**
 * A coded value from a defined code system.
 * Used throughout BIND for standardized enumerations.
 *
 * @example
 * {
 *   "system": "https://bind.codes/line-of-business",
 *   "code": "GL",
 *   "display": "General Liability"
 * }
 */
export interface Coding {
  /**
   * The code system URI that defines the code.
   * @format uri
   */
  system?: string;

  /** The code value from the code system */
  code: string;

  /** Human-readable display text for the code */
  display?: string;
}

/**
 * A concept with a coding and optional text.
 * Wraps one or more Coding values with a human-readable summary.
 */
export interface CodeableConcept {
  /** Code(s) from formal code systems */
  coding?: Coding[];

  /** Plain text representation of the concept */
  text?: string;
}

/**
 * A reference from one BIND resource to another.
 *
 * @example
 * {
 *   "reference": "Insured/ins-789",
 *   "display": "Acme Corp"
 * }
 */
export interface Reference {
  /**
   * Relative or absolute reference to another resource.
   * Format: `{ResourceType}/{id}` for relative references.
   */
  reference?: string;

  /** The resource type being referenced */
  type?: string;

  /** Text alternative for the reference (e.g. display name) */
  display?: string;
}

/**
 * A time period defined by a start and/or end date.
 * Used for policy terms, coverage periods, etc.
 *
 * @example
 * {
 *   "start": "2025-01-01",
 *   "end": "2026-01-01"
 * }
 */
export interface Period {
  /**
   * Start of the period (inclusive).
   * @format date
   */
  start?: string;

  /**
   * End of the period (inclusive).
   * @format date
   */
  end?: string;
}

/**
 * A monetary amount with currency.
 *
 * @example
 * {
 *   "value": 1000000,
 *   "currency": "USD"
 * }
 */
export interface Money {
  /**
   * Numeric amount.
   * Represented as a number; precision should be maintained by the consuming system.
   */
  value: number;

  /**
   * ISO 4217 currency code.
   * @default "USD"
   */
  currency?: string;
}

/**
 * A quantity with a value and unit.
 *
 * @example
 * {
 *   "value": 50000,
 *   "unit": "sqft"
 * }
 */
export interface Quantity {
  /** Numeric value */
  value: number;

  /** Unit of measure (e.g. "sqft", "vehicles", "employees") */
  unit?: string;

  /**
   * Code system URI for the unit.
   * @format uri
   */
  system?: string;

  /** Coded form of the unit */
  code?: string;
}

/**
 * A geographic point in WGS84 coordinates.
 * Used for precise location of insured properties, loss locations, etc.
 */
export interface GeoPoint {
  /**
   * Latitude in decimal degrees.
   * @minimum -90
   * @maximum 90
   */
  latitude: number;

  /**
   * Longitude in decimal degrees.
   * @minimum -180
   * @maximum 180
   */
  longitude: number;

  /** Altitude in meters above sea level */
  altitude?: number;
}

/**
 * A business identifier for an entity (e.g., NAIC code, EIN, NPN, policy number).
 * Separates business identifiers from coded concepts.
 *
 * @example
 * {
 *   "system": "urn:oid:2.16.840.1.113883.6.300",
 *   "value": "29459",
 *   "type": { "text": "NAIC" }
 * }
 */
export interface Identifier {
  /**
   * The namespace for the identifier value.
   * @format uri
   */
  system?: string;

  /** The identifier value within the namespace */
  value: string;

  /** The kind of identifier (e.g., EIN, NAIC, NPN, FEIN) */
  type?: CodeableConcept;

  /** Period during which this identifier is/was valid */
  period?: Period;
}

/**
 * A physical or mailing address.
 *
 * @example
 * {
 *   "use": "work",
 *   "type": "both",
 *   "line": ["123 Main St", "Suite 400"],
 *   "city": "Hartford",
 *   "state": "CT",
 *   "postalCode": "06103",
 *   "country": "US",
 *   "district": "Hartford County"
 * }
 */
export interface Address {
  /** Purpose of this address */
  use?: "work" | "mailing" | "billing" | "loss-location" | "home" | "old";

  /** The type of address (postal, physical, or both) */
  type?: "postal" | "physical" | "both";

  /** Full unstructured text representation of the address */
  text?: string;

  /** Street address lines */
  line?: string[];

  /** City or municipality */
  city?: string;

  /**
   * County or district.
   * Critical for insurance rating territories and jurisdiction determination.
   */
  district?: string;

  /** State, province, or region */
  state?: string;

  /** Postal / ZIP code */
  postalCode?: string;

  /**
   * ISO 3166-1 alpha-2 country code.
   * @default "US"
   */
  country?: string;

  /** Period during which this address was/is in use */
  period?: Period;

  /** Geographic coordinates of this address */
  geoPoint?: GeoPoint;
}

/**
 * Contact information for a person or organization.
 */
export interface ContactPoint {
  /** The type of contact point */
  system?: "phone" | "fax" | "email" | "url";

  /** The actual contact value (phone number, email address, etc.) */
  value: string;

  /** Purpose of this contact point */
  use?: "work" | "home" | "mobile";
}

/**
 * An attachment or document reference.
 * Used for loss runs, applications, endorsement forms, etc.
 */
export interface Attachment {
  /**
   * MIME type of the content.
   * @example "application/pdf"
   */
  contentType?: string;

  /**
   * URI where the attachment data can be retrieved.
   * @format uri
   */
  url?: string;

  /** Human-readable title for the attachment */
  title?: string;

  /**
   * Date the attachment was created.
   * @format date-time
   */
  creation?: string;
}
