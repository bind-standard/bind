import type { CategoryDef, GraphEdge, GraphNode } from "./types";

export const categories: CategoryDef[] = [
  {
    id: "parties",
    label: "Parties",
    color: { light: "#4f46e5", dark: "#818cf8" },
    bgColor: { light: "rgba(79,70,229,0.06)", dark: "rgba(129,140,248,0.08)" },
  },
  {
    id: "workflow",
    label: "Workflow",
    color: { light: "#d97706", dark: "#fbbf24" },
    bgColor: { light: "rgba(217,119,6,0.06)", dark: "rgba(251,191,36,0.08)" },
  },
  {
    id: "contract",
    label: "Contract",
    color: { light: "#059669", dark: "#34d399" },
    bgColor: { light: "rgba(5,150,105,0.06)", dark: "rgba(52,211,153,0.08)" },
  },
  {
    id: "risk",
    label: "Risk & Property",
    color: { light: "#dc2626", dark: "#f87171" },
    bgColor: { light: "rgba(220,38,38,0.06)", dark: "rgba(248,113,113,0.08)" },
  },
  {
    id: "claims",
    label: "Claims",
    color: { light: "#7c3aed", dark: "#a78bfa" },
    bgColor: { light: "rgba(124,58,237,0.06)", dark: "rgba(167,139,250,0.08)" },
  },
];

export const nodes: GraphNode[] = [
  // Parties
  {
    id: "Insured",
    label: "Insured",
    abbrev: "In",
    category: "parties",
    description: "The policyholder — an individual or organization seeking insurance coverage.",
  },
  {
    id: "Organization",
    label: "Organization",
    abbrev: "Or",
    category: "parties",
    description: "A carrier, broker, MGA, TPA, reinsurer, or other business entity.",
  },
  {
    id: "Person",
    label: "Person",
    abbrev: "Pe",
    category: "parties",
    description: "An individual professional such as an underwriter, adjuster, or broker.",
  },
  {
    id: "PersonRole",
    label: "PersonRole",
    abbrev: "PR",
    category: "parties",
    description: "A person's role within an organization — e.g. underwriter at a carrier.",
  },
  // Workflow
  {
    id: "Submission",
    label: "Submission",
    abbrev: "Su",
    category: "workflow",
    description: "A request for insurance coverage sent from a broker to a carrier.",
  },
  {
    id: "Quote",
    label: "Quote",
    abbrev: "Qu",
    category: "workflow",
    description: "A carrier's formal offer of coverage with pricing and terms.",
  },
  // Contract
  {
    id: "Policy",
    label: "Policy",
    abbrev: "Po",
    category: "contract",
    description: "A bound insurance contract with coverages, terms, and endorsements.",
  },
  {
    id: "Coverage",
    label: "Coverage",
    abbrev: "Co",
    category: "contract",
    description: "An individual coverage section within a policy — limits, deductibles, premium.",
  },
  // Risk & Property
  {
    id: "Risk",
    label: "Risk",
    abbrev: "Ri",
    category: "risk",
    description: "An insurable item — vehicle, property, equipment, or general liability exposure.",
  },
  {
    id: "Location",
    label: "Location",
    abbrev: "Lo",
    category: "risk",
    description: "A physical premises or address relevant to coverage.",
  },
  // Claims
  {
    id: "Claim",
    label: "Claim",
    abbrev: "Cl",
    category: "claims",
    description: "A first notice of loss and the resulting claims workflow.",
  },
];

// Edges derived from Reference fields in TypeScript source types.
// Multiple edges between the same pair are merged into one with a combined label.
export const edges: GraphEdge[] = [
  // Policy references
  { source: "Policy", target: "Insured", label: "insured", isArray: false },
  { source: "Policy", target: "Organization", label: "carrier / broker / mga", isArray: false },
  { source: "Policy", target: "Coverage", label: "coverages", isArray: true },
  { source: "Policy", target: "Risk", label: "risks", isArray: true },
  { source: "Policy", target: "Quote", label: "originatingQuote", isArray: false },
  { source: "Policy", target: "PersonRole", label: "underwriter / accountManager", isArray: false },

  // Coverage references
  { source: "Coverage", target: "Policy", label: "policy", isArray: false },
  { source: "Coverage", target: "Risk", label: "risks", isArray: true },
  { source: "Coverage", target: "Location", label: "location", isArray: false },

  // Claim references
  { source: "Claim", target: "Policy", label: "policy", isArray: false },
  { source: "Claim", target: "Coverage", label: "coverage", isArray: false },
  { source: "Claim", target: "Insured", label: "insured", isArray: false },
  { source: "Claim", target: "PersonRole", label: "adjuster", isArray: false },

  // Submission references
  { source: "Submission", target: "Insured", label: "insured", isArray: false },
  { source: "Submission", target: "Organization", label: "broker / carrier", isArray: false },
  { source: "Submission", target: "Risk", label: "risks", isArray: true },
  { source: "Submission", target: "Quote", label: "resultingQuotes", isArray: true },
  { source: "Submission", target: "Policy", label: "expiringPolicy", isArray: false },

  // Quote references
  { source: "Quote", target: "Submission", label: "submission", isArray: false },
  { source: "Quote", target: "Insured", label: "insured", isArray: false },
  { source: "Quote", target: "Organization", label: "carrier", isArray: false },
  { source: "Quote", target: "PersonRole", label: "underwriter", isArray: false },
  { source: "Quote", target: "Risk", label: "risks", isArray: true },
  { source: "Quote", target: "Policy", label: "resultingPolicy", isArray: false },

  // Risk references
  { source: "Risk", target: "Location", label: "location", isArray: false },
  { source: "Risk", target: "Risk", label: "partOf", isArray: false },
  { source: "Risk", target: "Insured", label: "insured", isArray: false },
  { source: "Risk", target: "Coverage", label: "coverages", isArray: true },

  // Location references
  { source: "Location", target: "Insured", label: "insured", isArray: false },
  { source: "Location", target: "Policy", label: "policy", isArray: false },

  // PersonRole references
  { source: "PersonRole", target: "Person", label: "person", isArray: false },
  { source: "PersonRole", target: "Organization", label: "organization", isArray: false },

  // Insured references
  { source: "Insured", target: "Organization", label: "partOf", isArray: false },

  // Organization references
  { source: "Organization", target: "Organization", label: "partOf", isArray: false },
];
