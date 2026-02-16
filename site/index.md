---
layout: home
hero:
  name: BIND Standard
  text: Business Insurance Normalized Data
  tagline: An open data interoperability standard for insurance.
  actions:
    - theme: brand
      text: Read the White Paper
      link: /white-paper
    - theme: alt
      text: Explore the Standard
      link: /overview
    - theme: alt
      text: Playground
      link: https://playground.bind-standard.org

features:
  - title: Resource-Based
    details: BIND models insurance as a set of discrete, composable resources — Insured, Submission, Quote, Policy, Coverage, Claim, and more.
  - title: TypeScript-First
    details: Defined in TypeScript with auto-generated JSON Schemas. Strong typing from source of truth all the way through to validation.
  - title: Proven Patterns
    details: Resource types, references, coded values, and extensible data types — patterns proven at scale in other industries, adapted for insurance.
  - title: Built-in Trust
    details: A git-based PKI directory at bindpki.org lets any participant register cryptographic signing keys. Verify authorship and integrity of any BIND Bundle — no prior relationship required.
  - title: Encrypted Exchange
    details: Share signed, encrypted Bundles via a link. Zero-knowledge server design means the exchange infrastructure never sees your data. No portals, no shared platforms, no vendor lock-in.
  - title: Open Standard
    details: Published under CC0 (public domain). No membership fees, no licensing gates. Fork it, extend it, build on it — the standard belongs to the industry.
---

<div style="max-width: 1152px; margin: 0 auto; padding: 0 24px;">

## The Four Layers

BIND addresses every layer of the interoperability problem with a purpose-built architecture.

**Data Model** — 20+ typed, composable resources covering the full policy lifecycle from submission through quoting, binding, policy issuance, endorsements, and claims. TypeScript-first with auto-generated JSON Schemas.

**Terminology** — 322 managed code systems at [bind.codes](https://bind.codes) covering lines of business, coverage forms, loss causes, construction types, vehicle classifications, and more. Multi-language support and AI-native integration via MCP.

**Signing & Trust** — Git-based PKI at [bindpki.org](https://bindpki.org). Participants register identity, regulatory credentials, and ES256 signing keys. Any Bundle can be cryptographically verified without prior relationships.

**Exchange** — Zero-knowledge encrypted sharing via `bindx://` links. Package, sign, encrypt, and share a Bundle as easily as sharing a link. No shared platform, no portal accounts, no vendor lock-in.

## Who BIND Is For

BIND is designed for every participant in the insurance value chain:

- **Brokers & Agencies** — Eliminate re-keying across carrier portals. Structure submissions once, share everywhere.
- **Carriers & Insurers** — Ingest structured, validated submissions directly into underwriting workbenches. Enable API-first distribution.
- **MGAs & Program Administrators** — Bridge broker and carrier systems with a common data layer. Streamline delegated authority workflows.
- **TPAs & Claims Administrators** — Receive structured claims data from day one. Reduce intake processing and improve accuracy.
- **Reinsurers** — Consume consistently structured portfolio and claims data for treaty and facultative placements.
- **Technology Vendors & InsurTechs** — Build on an open standard instead of maintaining dozens of proprietary integrations.

## Getting Started

<div class="getting-started-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">

<div>

### Learn the Concepts
Read the [Overview](/overview) to understand BIND's architecture, or dive into the [White Paper](/white-paper) for the full technical and business case.

</div>
<div>

### Explore the Data Model
Browse [Resources](/resources/) and [Data Types](/data-types/) to see how insurance concepts are modeled. Use the [Concept Explorer](/explorer) for an interactive view.

</div>
<div>

### Try the Playground
Build and validate BIND resources interactively at [playground.bind-standard.org](https://playground.bind-standard.org). Browse 322 code systems and construct Bundles in your browser.

</div>
</div>

</div>
