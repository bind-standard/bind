// BIND Standard — Certificate of Insurance
// Proof of insurance documentation for third parties.

import type { Address, CodeableConcept, Period, Reference, Resource } from "./base";
import type { CoverageLimit } from "./coverage";

/**
 * A third party requesting proof of insurance.
 */
export interface CertificateHolder {
  name: string;
  address?: Address;
  isAdditionalInsured?: boolean;
  waiverOfSubrogation?: boolean;
  primaryNonContributory?: boolean;
}

/**
 * A summary of coverage included on a certificate.
 */
export interface CoverageSummary {
  lineOfBusiness?: CodeableConcept;
  policy?: Reference;
  carrier?: Reference;
  effectivePeriod?: Period;
  limits?: CoverageLimit[];
}

/**
 * A Certificate of Insurance (COI) proving coverage to a third party.
 * @example
 * {
 *   "resourceType": "Certificate",
 *   "id": "cert-001",
 *   "certificateNumber": "COI-2025-001",
 *   "insured": { "reference": "Insured/ins-001", "display": "Acme Corp" },
 *   "holder": { "name": "BigCo Contracting", "isAdditionalInsured": true },
 *   "issuedDate": "2025-06-15",
 *   "cancellationNoticeDays": 30
 * }
 */
export interface Certificate extends Resource {
  resourceType: "Certificate";
  certificateNumber?: string;
  insured: Reference;
  holder: CertificateHolder;
  coverageSummaries?: CoverageSummary[];
  /** @format date */
  issuedDate?: string;
  cancellationNoticeDays?: number;
}
