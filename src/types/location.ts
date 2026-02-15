import type { Address, CodeableConcept, Money, Quantity, Reference, Resource } from "./base";
import type { Lienholder } from "./lienholder";
import type { AssetValuation } from "./risk";

/**
 * Detailed sprinkler system information for fire protection rating.
 */
export interface SprinklerDetail {
  /** Type of sprinkler system */
  type?: "wet" | "dry" | "pre-action" | "deluge";
  /** Percentage of building covered by sprinklers */
  coveragePercentage?: number;
  /** Suppression agent type */
  agent?: CodeableConcept;
}

/**
 * A physical location or premises that is insured or relevant to a policy.
 * Used in property, GL, and other location-based coverages.
 * Locations form the basis of a Statement of Values (SOV).
 *
 * @example
 * {
 *   "resourceType": "Location",
 *   "id": "loc-001",
 *   "status": "active",
 *   "name": "Main Manufacturing Plant",
 *   "address": { "line": ["123 Industrial Blvd"], "city": "Hartford", "state": "CT", "postalCode": "06103" },
 *   "occupancy": { "coding": [{ "code": "manufacturing", "display": "Manufacturing" }] },
 *   "constructionType": { "coding": [{ "code": "fire-resistive", "display": "Fire Resistive" }] },
 *   "yearBuilt": 1995,
 *   "squareFootage": { "value": 50000, "unit": "sqft" },
 *   "buildingValue": { "value": 5000000, "currency": "USD" },
 *   "contentsValue": { "value": 2000000, "currency": "USD" }
 * }
 */
export interface Location extends Resource {
  /** Fixed resource type discriminator */
  resourceType: "Location";

  /** Whether this location is currently active/insured */
  status: "active" | "inactive";

  /** Descriptive name for this location */
  name?: string;

  /** Physical address of the location */
  address: Address;

  /**
   * Type of occupancy at this location.
   * @terminology https://bind.codes/occupancy-type preferred
   */
  occupancy?: CodeableConcept;

  /**
   * Construction type (frame, masonry, fire-resistive, etc.)
   * @terminology https://bind.codes/construction-type preferred
   */
  constructionType?: CodeableConcept;

  /**
   * Year the building was constructed.
   * @minimum 1600
   * @maximum 2100
   */
  yearBuilt?: number;

  /**
   * Year of last major renovation, if applicable.
   * @minimum 1600
   * @maximum 2100
   */
  yearRenovated?: number;

  /** Total square footage */
  squareFootage?: Quantity;

  /** Number of stories */
  stories?: number;

  /** Insured value of the building/structure */
  buildingValue?: Money;

  /** Insured value of contents/inventory */
  contentsValue?: Money;

  /** Business income / business interruption value */
  businessIncomeValue?: Money;

  /** Protection class (ISO fire protection rating) */
  protectionClass?: string;

  /** Whether the location has fire sprinklers */
  sprinklered?: boolean;

  /** Whether the location has a fire alarm system */
  fireAlarm?: boolean;

  /** Whether the location has a security system */
  securitySystem?: boolean;

  /** Distance to nearest fire station in miles */
  distanceToFireStation?: number;

  /** Distance to nearest fire hydrant in feet */
  distanceToHydrant?: number;

  /** Flood zone designation (e.g., Zone A, Zone X) */
  floodZone?: string;

  /** Whether the location is in a wind/hurricane-prone area */
  windExposed?: boolean;

  /** Reference to the insured who owns/occupies this location */
  insured?: Reference;

  /** Reference to the policy covering this location */
  policy?: Reference;

  /**
   * Structured asset valuations for this location.
   * Supersedes buildingValue, contentsValue, businessIncomeValue for richer detail
   * including valuation method and provenance.
   */
  values?: AssetValuation[];

  // --- Dwelling Characteristics (Personal Lines) ---

  /** Type of dwelling at this location */
  dwellingType?:
    | "single-family"
    | "condo"
    | "townhouse"
    | "mobile-home"
    | "duplex"
    | "multi-family"
    | "manufactured";

  /**
   * Roof material type.
   * @terminology https://bind.codes/roof-type preferred
   */
  roofType?: CodeableConcept;

  /**
   * Year the roof was installed or last replaced.
   * @minimum 1600
   * @maximum 2100
   */
  roofYear?: number;

  /** Roof shape (gable, hip, flat, mansard, gambrel) */
  roofShape?: CodeableConcept;

  /** Plumbing material type (copper, PVC, PEX, galvanized, polybutylene) */
  plumbingType?: CodeableConcept;

  /**
   * Year the plumbing was installed or last updated.
   * @minimum 1600
   * @maximum 2100
   */
  plumbingYear?: number;

  /** Heating system type (forced-air, radiant, heat-pump, boiler, electric) */
  heatingType?: CodeableConcept;

  /**
   * Year the heating system was installed or last updated.
   * @minimum 1600
   * @maximum 2100
   */
  heatingYear?: number;

  /** Electrical system type (circuit-breaker, fuse-box + amperage) */
  electricalType?: CodeableConcept;

  /**
   * Year the electrical system was installed or last updated.
   * @minimum 1600
   * @maximum 2100
   */
  electricalYear?: number;

  /** Foundation type (slab, crawl-space, basement, piers, stilts) */
  foundationType?: CodeableConcept;

  /** Whether the dwelling has a basement */
  hasBasement?: boolean;

  /** Basement finish level */
  basementType?: "finished" | "unfinished" | "partially-finished" | "walk-out" | "none";

  /** Whether the property has a swimming pool */
  hasPool?: boolean;

  /** Type of swimming pool */
  poolType?: "in-ground" | "above-ground" | "none";

  /** Whether the pool area is fenced */
  poolFenced?: boolean;

  /** Number of fireplaces in the dwelling */
  fireplaces?: number;

  /** Free-text description of detached structures on the property */
  detachedStructures?: string;

  // --- Extended Protective Devices ---

  /** Whether the dwelling has deadbolt locks */
  deadbolts?: boolean;

  /** Whether the dwelling has smoke detectors */
  smokeDetectors?: boolean;

  /** Whether the dwelling has a water leak detection system */
  waterLeakDetection?: boolean;

  /** Whether the dwelling has a burglar alarm */
  burglarAlarm?: boolean;

  /** Whether the dwelling has fire extinguishers */
  fireExtinguisher?: boolean;

  /** Whether the dwelling has a backup generator */
  backupGenerator?: boolean;

  /**
   * Protection class (ISO fire protection rating).
   * @terminology https://bind.codes/protection-class preferred
   */
  protectionClassCode?: CodeableConcept;

  /** Overall physical condition of the property */
  propertyCondition?: "excellent" | "good" | "fair" | "poor";

  /** Detailed sprinkler system information (supplements the `sprinklered` boolean) */
  sprinklerDetail?: SprinklerDetail;

  /**
   * Fire alarm classification.
   * @terminology https://bind.codes/alarm-type preferred
   */
  alarmType?: CodeableConcept;

  // --- Underwriting Hazards ---

  /** Dog breeds present on the property */
  dogBreed?: string[];

  /** Whether the property has a trampoline */
  hasTrampoline?: boolean;

  // --- Financial Interests ---

  /** Mortgage holders and other financial interest parties */
  lienholders?: Lienholder[];
}
