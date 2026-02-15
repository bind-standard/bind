// BIND Standard — Scheduled Item
// High-value personal property items that exceed standard sublimits.

import type { Attachment, CodeableConcept, Money } from "./base";

/**
 * A scheduled personal property item.
 * High-value items (jewelry, art, musical instruments, firearms, etc.)
 * that exceed standard personal property sublimits and require individual scheduling.
 *
 * @example
 * {
 *   "category": { "text": "Jewelry" },
 *   "description": "Diamond engagement ring, 2.5 carat princess cut",
 *   "value": { "value": 15000, "currency": "USD" },
 *   "appraisalDate": "2024-11-01"
 * }
 */
export interface ScheduledItem {
  /** Category of the item (jewelry, fine-art, musical-instruments, firearms, etc.) */
  category: CodeableConcept;

  /** Description of the specific item */
  description: string;

  /** Appraised or agreed value of the item */
  value: Money;

  /** Serial number or other unique identifier for the item */
  serialNumber?: string;

  /** Reference to an appraisal document */
  appraisal?: Attachment;

  /**
   * Date of the most recent appraisal.
   * @format date
   */
  appraisalDate?: string;

  /** Manufacturer or maker */
  make?: string;

  /** Model name or number */
  model?: string;

  /** Year of manufacture or creation */
  year?: number;
}
