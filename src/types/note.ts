// BIND Standard — Note Resource
// Activity notes and communications attached to insurance resources.

import type { Attachment, CodeableConcept, Reference, Resource } from "./base";

/**
 * A note or communication attached to an insurance resource.
 * Captures activity log entries, underwriter notes, broker instructions, etc.
 * @example
 * {
 *   "resourceType": "Note",
 *   "id": "note-001",
 *   "subject": { "reference": "Policy/pol-2025-1001" },
 *   "author": { "reference": "PersonRole/pr-001", "display": "Sarah Chen" },
 *   "created": "2025-06-15T14:30:00Z",
 *   "category": { "coding": [{ "code": "underwriting", "display": "Underwriting Note" }] },
 *   "text": "Confirmed sprinkler system coverage meets protective safeguard requirements."
 * }
 */
export interface Note extends Resource {
  resourceType: "Note";
  subject: Reference;
  author?: Reference;
  /** @format date-time */
  created: string;
  category?: CodeableConcept;
  text: string;
  attachments?: Attachment[];
}
