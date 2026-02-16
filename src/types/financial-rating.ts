// BIND Standard — Financial Rating
// Structured financial strength ratings from rating agencies.

import type { CodeableConcept, Coding } from "./base";

/**
 * A financial strength rating from a recognized rating agency.
 * Supersedes inline `Coding` fields like `amBestRating` and `spRating`
 * on Organization, providing richer context including outlook and effective date.
 *
 * @example
 * {
 *   "agency": { "code": "am-best", "display": "A.M. Best" },
 *   "rating": "A+",
 *   "outlook": "stable",
 *   "financialSizeCategory": "XV",
 *   "effectiveDate": "2025-01-15"
 * }
 */
export interface FinancialRating {
  /**
   * Rating agency (am-best, sp, moodys, fitch).
   * @terminology https://bind.codes/FinancialRatingAgency extensible
   */
  agency: Coding;

  /** The rating value (e.g., "A+", "AA-", "Aa3") */
  rating: string;

  /**
   * Rating outlook.
   * @terminology https://bind.codes/FinancialRatingOutlook extensible
   */
  outlook?: CodeableConcept;

  /** AM Best Financial Size Category (I through XV) */
  financialSizeCategory?: string;

  /**
   * Date the rating was issued or last affirmed.
   * @format date
   */
  effectiveDate?: string;
}
