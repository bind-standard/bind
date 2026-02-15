// BIND Standard — Underwriting Questions and Responses
// Structured Q&A for risk assessment.

import type { CodeableConcept } from "./base";

/**
 * An underwriting question and its response.
 * @example
 * {
 *   "questionCode": { "coding": [{ "code": "prior-claims", "display": "Prior Claims" }] },
 *   "questionText": "Have you had any claims in the past 5 years?",
 *   "answer": "Yes - 2 minor property claims totaling $12,000",
 *   "answeredDate": "2025-04-10"
 * }
 */
export interface QuestionResponse {
  questionCode?: CodeableConcept;
  questionText: string;
  answer: string;
  /** @format date */
  answeredDate?: string;
  lineOfBusiness?: CodeableConcept;
  notes?: string;
}
