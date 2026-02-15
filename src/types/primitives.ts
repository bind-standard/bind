// BIND Standard — Primitive Types
// Semantic type aliases with JSDoc constraints for JSON Schema generation.
// Adapted for insurance.

/**
 * A resource identifier constrained to safe characters.
 * Used for logical IDs of all BIND resources.
 *
 * @pattern ^[A-Za-z0-9\-\.]+$
 */
export type BindId = string;

/**
 * General-purpose string with no additional constraints.
 */
export type BindString = string;

/**
 * A URI identifying a code system, naming system, or other namespace.
 *
 * @format uri
 */
export type BindUri = string;

/**
 * A URL pointing to an attachment, document, or external resource.
 *
 * @format uri
 */
export type BindUrl = string;

/**
 * Markdown-formatted long-form text.
 * Used for descriptions, notes, and narrative content.
 */
export type BindMarkdown = string;

/**
 * Base64-encoded binary content.
 * Used for inline documents, signatures, or small attachments.
 *
 * @pattern ^[A-Za-z0-9+/]+=*$
 */
export type BindBase64Binary = string;

/**
 * A date value supporting partial dates.
 * Valid formats: `YYYY`, `YYYY-MM`, `YYYY-MM-DD`.
 *
 * @pattern ^\d{4}(-\d{2}(-\d{2})?)?$
 */
export type BindDate = string;

/**
 * A date-time value with timezone information.
 * Used for event timestamps and audit records.
 *
 * @format date-time
 */
export type BindDateTime = string;

/**
 * An instant in time with full precision.
 * Used for audit-precision timestamps requiring sub-second accuracy.
 *
 * @format date-time
 */
export type BindInstant = string;

/**
 * A time-of-day value without a date component.
 *
 * @format time
 */
export type BindTime = string;

/**
 * A boolean value.
 */
export type BindBoolean = boolean;

/**
 * A whole number (integer).
 *
 * @asType integer
 */
export type BindInteger = number;

/**
 * A positive integer (1 or greater).
 * Used for version numbers, counts, and sequence numbers.
 *
 * @minimum 1
 */
export type BindPositiveInt = number;

/**
 * A decimal number with arbitrary precision.
 * Used for rates, factors, and precise calculations.
 */
export type BindDecimal = number;

/**
 * A percentage value between 0 and 100.
 * Used for commission percentages, coinsurance rates, and loss ratios.
 *
 * @minimum 0
 * @maximum 100
 */
export type BindPercentage = number;

/**
 * A year value for date-only-year fields.
 * Used for yearBuilt, yearEstablished, and similar fields.
 *
 * @minimum 1600
 * @maximum 2100
 */
export type BindYear = number;
