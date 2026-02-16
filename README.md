# BIND Standard

**BIND** (Business Insurance Normalized Data) is an open data interoperability standard for insurance.

It defines a common set of resource types and data structures that enable brokers, carriers, MGAs, TPAs, reinsurers, and vendors to exchange information in a consistent, machine-readable format.

**Website:** [bind-standard.org](https://bind-standard.org)

## The Standard

BIND models insurance as a set of composable resources:

| Category | Resources | Description |
|----------|-----------|-------------|
| **Parties** | Insured, Organization | Policyholders, carriers, brokers, MGAs |
| **Workflow** | Submission, Quote | Requesting and offering coverage |
| **Contract** | Policy, Coverage | The bound agreement and its coverage sections |
| **Claims** | Claim | Loss reporting and claims workflow |
| **Property** | Location | Physical premises and statement-of-values data |

Resources are linked together via references and composed of reusable data types like Money, Period, Address, CodeableConcept, and more.

## Signing & Trust

BIND Bundles can be **signed** using JWS (ES256) to prove authorship and integrity. Signatures are verified against the signer's public key in the **[BIND Directory](https://bindpki.org)** — a git-based PKI registry of insurance participants, their regulatory credentials, and signing keys.

Signed bundles enable trust-tiered exchange, where verified participants get higher limits and longer expiry when sharing data via **[BIND Exchange](https://bind-standard.org/exchange)**.

Browse the full specification at [bind-standard.org](https://bind-standard.org).

## Stack

The canonical type definitions live in TypeScript (`src/types/`). Everything else is generated from them:

- **TypeScript interfaces** — `src/types/` — the source of truth
- **JSON Schemas** — auto-generated via `ts-json-schema-generator`
- **Documentation site** — auto-generated with [VitePress](https://vitepress.dev), hosted on [Cloudflare Pages](https://pages.cloudflare.com)

### Development

```bash
npm install
npm run gen         # generate JSON schemas + doc pages
npm run docs:dev    # local dev server for the site
npm run docs:build  # production build
```

### Deployment

Pushes to `main` auto-deploy the documentation site to [bind-standard.org](https://bind-standard.org) via Cloudflare Pages.

## Contributing

We welcome contributions from everyone. See [CONTRIBUTING.md](CONTRIBUTING.md) for details, or open a pull request directly.

For questions or ideas, reach out at **contact@bind-standard.org**.

## License

The BIND specification is released under the [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) license — dedicated to the public domain. You are free to use, modify, and build upon it without restriction.
