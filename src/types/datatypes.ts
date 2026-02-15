// BIND Standard — Complex Data Types
// Reusable structures beyond the base types.

import { Money, Period, GeoPoint } from "./base";

// Re-export GeoPoint so it can be imported from either base or datatypes
export { GeoPoint } from "./base";

/**
 * A human name with structured components.
 * Adapted for insurance industry use (e.g., professional designations like CPCU, ARM, CIC).
 *
 * @example
 * {
 *   "use": "official",
 *   "text": "John A. Smith, CPCU",
 *   "family": "Smith",
 *   "given": ["John", "Andrew"],
 *   "suffix": ["CPCU"]
 * }
 */
export interface HumanName {
  /** Context in which this name is used */
  use?: "official" | "usual" | "nickname" | "maiden" | "old" | "anonymous";

  /** Full text representation of the name (e.g., "John A. Smith, CPCU") */
  text?: string;

  /** Surname / family name */
  family?: string;

  /** Given names (first name, middle names) */
  given?: string[];

  /** Name prefixes (Mr., Dr., etc.) */
  prefix?: string[];

  /** Name suffixes and professional designations (Jr., CPCU, ARM, CIC) */
  suffix?: string[];

  /** Period during which this name was/is in use */
  period?: Period;
}

/**
 * A geographic region defined as a GeoJSON-compatible polygon.
 * Used for coverage territories, catastrophe zones, and rating regions.
 */
export interface GeoRegion {
  /** GeoJSON geometry type — always "Polygon" */
  type: "Polygon";

  /**
   * GeoJSON polygon coordinates.
   * Each ring is an array of [longitude, latitude] coordinate pairs.
   * The first ring is the outer boundary; subsequent rings are holes.
   */
  coordinates: number[][][];
}

/**
 * A monetary amount with currency conversion details.
 * Inspired by ISO 20022 for multi-currency insurance transactions
 * (e.g., London market, international programs).
 *
 * @example
 * {
 *   "original": { "value": 100000, "currency": "GBP" },
 *   "converted": { "value": 127500, "currency": "USD" },
 *   "exchangeRate": 1.275,
 *   "exchangeRateDate": "2025-06-15",
 *   "rateSource": "ECB"
 * }
 */
export interface MoneyWithConversion {
  /** Amount in the transaction (original) currency */
  original: Money;

  /** Amount converted to the reporting currency */
  converted: Money;

  /** Exchange rate: 1 unit of original = rate units of converted */
  exchangeRate: number;

  /**
   * Date the exchange rate was effective.
   * @format date
   */
  exchangeRateDate?: string;

  /** Source of the exchange rate (e.g., "ECB", "Reuters", "Bloomberg") */
  rateSource?: string;
}

/**
 * A monetary amount with optional equivalent representations in other currencies.
 * The primary amount is in the reporting currency; equivalents provide
 * converted amounts for international programs.
 */
export interface MultiCurrencyMoney {
  /** Amount in the primary reporting currency */
  primary: Money;

  /** Equivalent amounts in other currencies */
  equivalents?: MoneyWithConversion[];
}

/**
 * A time period defined by start and/or end date-time values.
 * Higher precision than Period (which uses dates only).
 * Used for event windows, real-time coverage triggers, etc.
 */
export interface DateTimePeriod {
  /**
   * Start of the period (inclusive).
   * @format date-time
   */
  start?: string;

  /**
   * End of the period (inclusive).
   * @format date-time
   */
  end?: string;
}

/**
 * Common UCUM (Unified Code for Units of Measure) unit codes
 * used in insurance contexts.
 *
 * Reference: https://ucum.org/ucum
 *
 * Common codes:
 * - `m` — meters
 * - `km` — kilometers
 * - `[mi_us]` — US miles
 * - `[ft_us]` — US feet
 * - `m2` — square meters
 * - `[sft_i]` — square feet
 * - `kg` — kilograms
 * - `L` — liters
 * - `t` — metric tonnes
 * - `[gal_us]` — US gallons
 */
export type UcumUnit = string;

/**
 * Insurance-specific units of measurement that do not have UCUM equivalents.
 * Used in exposure calculations, rating, and premium computation.
 */
export type InsuranceUnit =
  | "vehicles"
  | "employees"
  | "payroll"
  | "revenue"
  | "sqft"
  | "units"
  | "members"
  | "beds"
  | "students"
  | "admissions"
  | "acres"
  | "dwellings"
  | "locations"
  | "miles"
  | "trips"
  | "passengers"
  | "records"
  | "transactions";

/** UCUM code system URI */
export const UCUM_SYSTEM = "http://unitsofmeasure.org";

/** BIND insurance-specific units code system URI */
export const BIND_INSURANCE_UNITS_SYSTEM =
  "https://bind-standard.org/CodeSystem/insurance-units";
