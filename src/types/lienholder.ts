// BIND Standard — Lienholder
// Financial interest parties on insured assets (vehicles, dwellings).

import type { Address, ContactPoint } from "./base";

/**
 * A party with a financial interest in an insured asset.
 * Shared by both auto (vehicle lienholders) and home (mortgagees).
 * Attached to Risk and Location resources.
 *
 * @example
 * {
 *   "name": "First National Bank",
 *   "type": "mortgagee",
 *   "loanNumber": "MORT-2024-56789",
 *   "address": { "line": ["PO Box 12345"], "city": "Charlotte", "state": "NC", "postalCode": "28201" },
 *   "isaoa": true
 * }
 */
export interface Lienholder {
  /** Name of the lienholder or mortgagee */
  name: string;

  /** Type of financial interest */
  type: "mortgagee" | "loss-payee" | "lienholder" | "additional-insured";

  /** Loan or mortgage number */
  loanNumber?: string;

  /** Mailing address for the lienholder */
  address?: Address;

  /** Contact information for the lienholder */
  contact?: ContactPoint[];

  /** Whether the ISAOA/ATIMA (Its Successors and/or Assigns as Their Interests May Appear) clause applies */
  isaoa?: boolean;
}
