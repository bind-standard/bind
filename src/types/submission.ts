import type { Attachment, CodeableConcept, Money, Period, Reference, Resource } from "./base";
import type { LossHistory } from "./loss-history";
import type { QuestionResponse } from "./question-response";

/**
 * A submission represents a request for insurance coverage sent from a broker to a carrier.
 * This is the starting point of the insurance workflow.
 *
 * A submission contains the information needed for a carrier to evaluate risk
 * and produce a quote, including the insured's details, requested coverages,
 * and supporting documents.
 *
 * @example
 * {
 *   "resourceType": "Submission",
 *   "id": "sub-2025-001",
 *   "status": "submitted",
 *   "insured": { "reference": "Insured/ins-001", "display": "Acme Manufacturing Corp" },
 *   "broker": { "reference": "Organization/broker-100", "display": "Marsh McLennan" },
 *   "carrier": { "reference": "Organization/carrier-200", "display": "Hartford Financial" },
 *   "requestedEffective": { "start": "2025-07-01", "end": "2026-07-01" },
 *   "linesOfBusiness": [
 *     { "coding": [{ "system": "https://bind.codes/lob", "code": "GL", "display": "General Liability" }] }
 *   ],
 *   "submittedDate": "2025-04-15T09:00:00Z"
 * }
 */
export interface Submission extends Resource {
  /** Fixed resource type discriminator */
  resourceType: "Submission";

  /**
   * Current status of the submission in the workflow.
   *
   * - `draft` — Being prepared, not yet sent
   * - `submitted` — Sent to carrier for review
   * - `in-review` — Carrier is actively evaluating
   * - `quoted` — Carrier has responded with a quote
   * - `declined` — Carrier has declined to quote
   * - `bound` — Coverage has been bound from this submission
   * - `withdrawn` — Broker has withdrawn the submission
   * - `expired` — Submission has expired without action
   */
  status:
    | "draft"
    | "submitted"
    | "in-review"
    | "quoted"
    | "declined"
    | "bound"
    | "withdrawn"
    | "expired";

  /** Reference to the insured entity */
  insured: Reference;

  /** Reference to the submitting broker/agent organization */
  broker?: Reference;

  /** Reference to the target carrier/underwriter organization */
  carrier?: Reference;

  /** Requested policy effective period */
  requestedEffective?: Period;

  /** Lines of business being requested (GL, Property, Auto, WC, etc.) */
  linesOfBusiness?: CodeableConcept[];

  /**
   * Target premium range, if the broker has a budget in mind.
   */
  targetPremium?: Money;

  /** Is this a new business submission or a renewal? */
  submissionType?: "new-business" | "renewal" | "remarket";

  /**
   * Date/time the submission was sent to the carrier.
   * @format date-time
   */
  submittedDate?: string;

  /**
   * Date by which the carrier should respond.
   * @format date
   */
  responseDeadline?: string;

  /** Supporting documents (applications, loss runs, SOVs, etc.) */
  supportingDocuments?: Attachment[];

  /** Free-text notes or special instructions from the broker */
  notes?: string;

  /**
   * Reference to the expiring policy, if this is a renewal.
   */
  expiringPolicy?: Reference;

  /** Reference to the resulting quote(s), if any */
  resultingQuotes?: Reference[];

  /** References to Risk resources included in this submission */
  risks?: Reference[];

  /** Historical loss experience for underwriting evaluation */
  lossHistory?: LossHistory[];

  /** Underwriting question responses */
  questions?: QuestionResponse[];
}
