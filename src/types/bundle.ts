import type { Identifier, Resource } from "./base";

/**
 * A Bundle is a container for a collection of BIND resources.
 * It enables systems to exchange groups of
 * related resources in a single payload — for example, a complete submission
 * package, a policy with all its coverages and risks, or a batch of updates.
 *
 * Bundle types serve different purposes:
 * - **document**: A coherent set of resources treated as a document (e.g., a full submission package).
 * - **message**: A message between systems, where the first entry defines the message intent.
 * - **transaction**: A set of resources to be processed as a single atomic operation.
 * - **transaction-response**: The server's response to a transaction bundle.
 * - **batch**: A set of independent operations to be processed individually.
 * - **batch-response**: The server's response to a batch bundle.
 * - **searchset**: Results of a search operation.
 * - **history**: Version history of a resource.
 * - **collection**: A generic collection of resources with no particular processing semantics.
 *
 * @example
 * {
 *   "resourceType": "Bundle",
 *   "id": "submission-package-001",
 *   "type": "document",
 *   "timestamp": "2025-07-01T10:30:00Z",
 *   "entry": [
 *     {
 *       "fullUrl": "Submission/sub-2025-001",
 *       "resource": {
 *         "resourceType": "Submission",
 *         "id": "sub-2025-001",
 *         "status": "submitted",
 *         "insured": { "reference": "Insured/ins-001", "display": "Acme Manufacturing Corp" }
 *       }
 *     },
 *     {
 *       "fullUrl": "Insured/ins-001",
 *       "resource": {
 *         "resourceType": "Insured",
 *         "id": "ins-001",
 *         "name": "Acme Manufacturing Corp"
 *       }
 *     },
 *     {
 *       "fullUrl": "Risk/risk-prop-001",
 *       "resource": {
 *         "resourceType": "Risk",
 *         "id": "risk-prop-001",
 *         "riskType": { "coding": [{ "code": "property", "display": "Property" }] }
 *       }
 *     }
 *   ]
 * }
 */
export interface Bundle extends Resource {
  /** Fixed resource type discriminator */
  resourceType: "Bundle";

  /**
   * A persistent identifier for the bundle that won't change as it is
   * copied from server to server.
   */
  identifier?: Identifier;

  /**
   * The purpose of this bundle.
   *
   * - `document` — A complete, self-contained document (e.g., submission package, policy snapshot)
   * - `message` — A message exchanged between systems
   * - `transaction` — A set of operations to be processed atomically
   * - `transaction-response` — Response to a transaction bundle
   * - `batch` — A set of independent operations
   * - `batch-response` — Response to a batch bundle
   * - `searchset` — Results of a search query
   * - `history` — Version history of one or more resources
   * - `collection` — An arbitrary collection of resources
   */
  type:
    | "document"
    | "message"
    | "transaction"
    | "transaction-response"
    | "batch"
    | "batch-response"
    | "searchset"
    | "history"
    | "collection";

  /**
   * When the bundle was assembled.
   * @format date-time
   */
  timestamp?: string;

  /**
   * Total number of matching resources (only for searchset and history bundles).
   * May be larger than the number of entries if results are paginated.
   * @minimum 0
   */
  total?: number;

  /** Links related to this bundle (e.g., pagination: self, next, previous) */
  link?: BundleLink[];

  /** The individual resources and associated metadata in this bundle */
  entry?: BundleEntry[];
}

/**
 * A navigation or context link associated with a bundle.
 * Used for pagination in search results and for self-referencing.
 *
 * @example
 * { "relation": "self", "url": "https://api.example.com/bind/Submission?status=submitted" }
 */
export interface BundleLink {
  /**
   * The relationship of this link to the bundle.
   * Common values: `self`, `next`, `previous`, `first`, `last`.
   */
  relation: string;

  /**
   * The URL for this link.
   * @format uri
   */
  url: string;
}

/**
 * An entry in a Bundle, containing a resource and/or transaction metadata.
 *
 * The content of each entry depends on the bundle type:
 * - **document / collection**: `fullUrl` + `resource`
 * - **transaction / batch**: `fullUrl` + `resource` + `request`
 * - **transaction-response / batch-response**: `fullUrl` + `resource` + `response`
 * - **searchset**: `fullUrl` + `resource` + `search`
 * - **history**: `fullUrl` + `resource` + `request` + `response`
 *
 * @example
 * {
 *   "fullUrl": "Policy/pol-2025-1001",
 *   "resource": {
 *     "resourceType": "Policy",
 *     "id": "pol-2025-1001",
 *     "status": "active",
 *     "policyNumber": "CGL-2025-001001"
 *   }
 * }
 */
export interface BundleEntry {
  /** Links related to this entry */
  link?: BundleLink[];

  /**
   * The absolute or relative URL for this resource.
   * For BIND resources this is typically `{ResourceType}/{id}`.
   * @format uri
   */
  fullUrl?: string;

  /**
   * The resource contained in this entry.
   * Can be any BIND resource type (Policy, Submission, Claim, etc.).
   */
  resource?: Resource;

  /** Search result metadata (only in searchset bundles) */
  search?: BundleEntrySearch;

  /** Transaction/batch request metadata */
  request?: BundleEntryRequest;

  /** Transaction/batch response metadata */
  response?: BundleEntryResponse;
}

/**
 * Search result metadata for an entry in a searchset bundle.
 *
 * @example
 * { "mode": "match", "score": 0.95 }
 */
export interface BundleEntrySearch {
  /**
   * Why this resource is in the result set.
   *
   * - `match` — The resource matched the search criteria
   * - `include` — The resource was included because another matching resource references it
   */
  mode?: "match" | "include";

  /**
   * Relevance ranking score (0.0–1.0) assigned by the server.
   * Higher values indicate a closer match to the search criteria.
   * @minimum 0
   * @maximum 1
   */
  score?: number;
}

/**
 * Request metadata for an entry in a transaction or batch bundle.
 * Describes the HTTP operation the server should perform for this entry.
 *
 * @example
 * {
 *   "method": "PUT",
 *   "url": "Policy/pol-2025-1001"
 * }
 */
export interface BundleEntryRequest {
  /**
   * The HTTP method for this entry.
   *
   * - `GET` — Read the resource
   * - `HEAD` — Check resource existence (headers only)
   * - `POST` — Create a new resource
   * - `PUT` — Create or update a resource
   * - `DELETE` — Remove a resource
   * - `PATCH` — Partially update a resource
   */
  method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH";

  /**
   * The URL for this entry, relative to the server base.
   * @format uri
   */
  url: string;

  /**
   * Only perform the operation if the ETag does not match (for caching).
   * Maps to the HTTP `If-None-Match` header.
   */
  ifNoneMatch?: string;

  /**
   * Only perform the operation if the resource was modified after this date.
   * Maps to the HTTP `If-Modified-Since` header.
   * @format date-time
   */
  ifModifiedSince?: string;

  /**
   * Only perform the operation if the ETag matches (for concurrency control).
   * Maps to the HTTP `If-Match` header.
   */
  ifMatch?: string;

  /**
   * Only perform the create if no resource already matches the given criteria.
   * Prevents duplicate creation in POST operations.
   */
  ifNoneExist?: string;
}

/**
 * Response metadata for an entry in a transaction-response or batch-response bundle.
 * Contains the outcome of the operation that was performed.
 *
 * @example
 * {
 *   "status": "201 Created",
 *   "location": "Policy/pol-2025-1001/_history/1",
 *   "etag": "W/\"1\"",
 *   "lastModified": "2025-07-01T10:30:00Z"
 * }
 */
export interface BundleEntryResponse {
  /**
   * The HTTP status code and phrase returned by the server.
   * @example "200 OK"
   * @example "201 Created"
   */
  status: string;

  /**
   * The location header returned by the server (for created/updated resources).
   * @format uri
   */
  location?: string;

  /** The ETag for the resource, as returned by the server */
  etag?: string;

  /**
   * When the resource was last modified on the server.
   * @format date-time
   */
  lastModified?: string;
}
