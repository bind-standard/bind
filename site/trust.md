# Trust

The **BIND Directory** is the public key infrastructure (PKI) for the BIND ecosystem. It is a git-based registry of insurance participants and their signing keys, hosted at [bindpki.org](https://bindpki.org).

When a participant signs a BIND Bundle, anyone can verify the signature by fetching the signer's public key from the directory — no prior relationship, shared secrets, or vendor lock-in required.

## How It Works

```
Signer                    BIND Directory                    Verifier
  │                       (bindpki.org)                        │
  │  Publishes public     ┌──────────────┐                    │
  │  key via PR ─────────►│  jwks.json   │                    │
  │                       │  manifest    │                    │
  │                       │  logos       │                    │
  │                       └──────┬───────┘                    │
  │                              │                            │
  │  Signs bundle with      Serves JWKS at                   │
  │  private key           /{slug}/.well-known/jwks.json     │
  │  ─────────────────────────────────────────────────────►   │
  │                              │                            │
  │                              │  Fetches JWKS              │
  │                              │◄───────────────────────────│
  │                              │                            │
  │                              │  Verifies signature        │
  │                              │  against public key        │
```

## The Directory

Each participant maintains a folder in the [bind-directory](https://github.com/bind-standard/bind-directory) repository:

```
participants/your-org/
├── manifest.json   # Organization metadata and regulatory credentials
├── jwks.json       # Public keys in JWKS format
├── logo.png        # Organization logo
└── logo.svg        # Organization logo
```

### Manifest

The `manifest.json` contains organization metadata including an embedded BIND [Organization](/resources/Organization) resource, regulatory credentials (license numbers, registry links), and participant status.

### JWKS

Public keys are published in standard [RFC 7517](https://datatracker.ietf.org/doc/html/rfc7517) JWKS format. Keys support EC P-256, RSA, and OKP types, with optional lifecycle fields (`iat`, `nbf`, `exp`) for key rotation management.

Once merged, keys are served at:

```
https://bindpki.org/{slug}/.well-known/jwks.json
```

### Verification and Governance

Joining the directory requires:

1. **Regulatory credentials** — License numbers, registration IDs, and links to public registries (e.g., AMF for Quebec brokers, FSRA for Ontario insurers)
2. **Community review** — The BIND Standard Team and community verify the organization's legitimacy before merging
3. **Email verification** — Applicants email directory@bind-standard.org with their credentials for verification

Git provides a transparent, auditable history of all changes to participant keys and metadata.

## Participant Types

| Code | Description |
|------|-------------|
| `insurer` | Insurance carrier |
| `broker` | Insurance broker |
| `mga` | Managing General Agent |
| `tpa` | Third-Party Administrator |
| `reinsurer` | Reinsurance company |
| `expert` | Claims adjuster, appraiser, or expert |
| `counsel` | Legal counsel |
| `tech-provider` | Insurance technology provider |
| `industry-body` | Industry association or standards body |

## Joining

The fastest way to join is the scaffold script in the [bind-directory](https://github.com/bind-standard/bind-directory) repository:

```bash
pnpm run join-directory
```

This generates your participant folder with a key pair, pre-filled manifest, and prompts for regulatory credentials. See the full guide at [bindpki.org/join](https://bindpki.org/join).

## Key Management

Participants manage their keys using:

```bash
pnpm run manage-keys
```

This supports listing keys with lifecycle status, rotating keys (with grace periods on old keys), retiring individual keys, and removing expired keys. All changes are submitted as pull requests.

## Relationship to Other Components

| Component | Role |
|-----------|------|
| **[BIND Directory](https://bindpki.org)** | Publishes participant identities and public keys |
| **[Signed Bundles](/signing)** | Uses directory keys to sign and verify BIND Bundles |
| **[BIND Exchange](/exchange)** | Uses directory keys for trust-tiered encrypted sharing |
| **[BIND Terminology](https://bind.codes)** | Provides the code systems used in participant manifests |
