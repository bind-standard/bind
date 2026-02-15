// BIND Standard — Risk Resource
// Represents an insurable risk item with polymorphic value characteristics.

import type {
  Address,
  CodeableConcept,
  Coding,
  Money,
  Period,
  Quantity,
  Reference,
  Resource,
} from "./base";
import type { Lienholder } from "./lienholder";
import type { NamedDriver } from "./named-driver";

/**
 * An insurable risk item — the most architecturally significant domain resource.
 * - `riskType` identifies what kind of insurable thing this is
 * - `characteristics[]` capture structured attributes
 * - `values[]` capture financial valuations
 *
 * Risk is deliberately generic to handle vehicles, properties, marine cargo,
 * professional liability exposures, cyber risks, workers' comp classes, equipment, etc.
 *
 * @example
 * {
 *   "resourceType": "Risk",
 *   "id": "risk-veh-001",
 *   "status": "active",
 *   "riskType": { "coding": [{ "code": "vehicle", "display": "Vehicle" }] },
 *   "characteristics": [
 *     { "code": { "text": "VIN" }, "valueString": "1HGBH41JXMN109186" },
 *     { "code": { "text": "Year" }, "valueInteger": 2023 },
 *     { "code": { "text": "Make" }, "valueString": "Honda" },
 *     { "code": { "text": "Model" }, "valueString": "Civic" }
 *   ],
 *   "values": [
 *     { "type": { "text": "Stated Value" }, "amount": { "value": 28000, "currency": "USD" } }
 *   ]
 * }
 */
export interface Risk extends Resource {
  /** Fixed resource type discriminator */
  resourceType: "Risk";

  /** Current status of this risk item */
  status: "active" | "inactive" | "pending" | "disposed";

  /**
   * The type of insurable risk.
   * Examples: vehicle, property, marine-cargo, professional-liability,
   * cyber, workers-comp-class, equipment, fine-art, livestock.
   * @terminology https://bind.codes/risk-type preferred
   */
  riskType: CodeableConcept;

  /** Free-text description of the risk */
  description?: string;

  /** Reference to the insured who owns or is responsible for this risk */
  insured?: Reference;

  /** Reference to the physical location of this risk (for property-based risks) */
  location?: Reference;

  /** Structured attributes of the risk (polymorphic value pattern) */
  characteristics?: RiskCharacteristic[];

  /** Financial valuations of the risk */
  values?: AssetValuation[];

  /** Risk classifications (e.g., ISO class codes, NAICS codes, fleet codes) */
  classifications?: CodeableConcept[];

  /** Period during which this risk is/was active or covered */
  effectivePeriod?: Period;

  /** References to Coverage resources that cover this risk */
  coverages?: Reference[];

  /** Reference to a parent risk (e.g., equipment within a building, trailer attached to a vehicle) */
  partOf?: Reference;

  /** Free-text notes about this risk */
  notes?: string;

  // --- Personal Lines Fields ---

  /** Named drivers on a personal auto policy risk */
  namedDrivers?: NamedDriver[];

  /** Financial interest parties (lienholders, loss payees) on this risk */
  lienholders?: Lienholder[];

  /** Primary garaging location for mobile risks (vehicles, trailers) */
  garagingAddress?: Address;
}

/**
 * A structured characteristic of a risk item.
 * Uses a polymorphic value pattern — exactly one `value*` field
 * should be populated per characteristic.
 *
 * @example
 * { "code": { "text": "Construction Type" }, "valueCodeableConcept": { "text": "Fire Resistive" } }
 *
 * @example
 * { "code": { "text": "Year Built" }, "valueInteger": 1995 }
 *
 * @example
 * { "code": { "text": "Sprinklered" }, "valueBoolean": true }
 */
export interface RiskCharacteristic {
  /** What aspect of the risk this characteristic describes (VIN, Make, Year, Construction Type, etc.) */
  code: CodeableConcept;

  /** String value */
  valueString?: string;

  /** Integer value */
  valueInteger?: number;

  /** Decimal value */
  valueDecimal?: number;

  /** Boolean value */
  valueBoolean?: boolean;

  /** Coded concept value */
  valueCodeableConcept?: CodeableConcept;

  /** Quantity value (with units) */
  valueQuantity?: Quantity;

  /** Monetary value */
  valueMoney?: Money;

  /** Coded value (single code, no text) */
  valueCoding?: Coding;

  /** Time period value */
  valuePeriod?: Period;
}

/**
 * A financial valuation of a risk or location asset.
 * Captures different valuation methods (replacement cost, ACV, agreed value, etc.)
 * and their provenance.
 *
 * @example
 * {
 *   "type": { "coding": [{ "code": "replacement-cost", "display": "Replacement Cost" }] },
 *   "amount": { "value": 5000000, "currency": "USD" },
 *   "effectiveDate": "2025-01-15",
 *   "source": "appraisal"
 * }
 */
export interface AssetValuation {
  /** Valuation method (replacement-cost, actual-cash-value, agreed-value, stated-value, market-value) */
  type: CodeableConcept;

  /** The valuation amount */
  amount: Money;

  /**
   * Date this valuation was effective or determined.
   * @format date
   */
  effectiveDate?: string;

  /** Source of the valuation (appraisal, insured-stated, index-adjusted, market-comparable) */
  source?: string;

  /** Notes about the valuation methodology or caveats */
  notes?: string;
}
