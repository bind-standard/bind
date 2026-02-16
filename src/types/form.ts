// BIND Standard — Insurance Form References
// Bureau and proprietary form number tracking.

import type { CodeableConcept } from "./base";

/**
 * A reference to a standard insurance form.
 * @example
 * {
 *   "formNumber": "CG 00 01",
 *   "editionDate": "2013-04",
 *   "formType": "bureau",
 *   "bureau": { "coding": [{ "code": "iso", "display": "ISO" }] },
 *   "title": "Commercial General Liability Coverage Form"
 * }
 */
export interface InsuranceForm {
  formNumber: string;
  /** @format date */
  editionDate?: string;
  /** @terminology https://bind.codes/FormType extensible */
  formType?: CodeableConcept;
  /** @terminology https://bind.codes/InsuranceBureau extensible */
  bureau?: CodeableConcept;
  title?: string;
}
