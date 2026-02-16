# Exchange

**BIND Exchange** enables secure, link-based sharing of encrypted [BIND Bundles](/resources/Bundle) between insurance participants — without requiring both parties to be on the same system or have accounts with a shared platform.

A broker can package a submission, encrypt it, and send a link to a carrier. A carrier can share a certificate of insurance with a third party. An MGA can deliver a bound policy package to a retail broker. All via a simple URL and passcode.

## Background

Insurance workflows constantly require sharing structured data across organizational boundaries: submissions from broker to carrier, quotes from carrier to broker, certificates to third parties, policy packages to insureds. Today this happens via email attachments, portal logins, and proprietary integrations.

BIND Exchange adapts the proven [SMART Health Links](https://docs.smarthealthit.org/smart-health-links/spec/) protocol — originally designed for sharing encrypted health records via links and QR codes — for the insurance domain. The core insight is the same: the encryption key travels in the link itself, never touching the server, so the exchange server is a zero-knowledge intermediary.

## Protocol Flow

```
Sender                        Exchange Server                     Recipient
  │                                 │                                 │
  │  1. Sign Bundle (JWS) [opt]     │                                 │
  │  2. Encrypt Bundle (JWE)        │                                 │
  │  3. POST /exchange              │                                 │
  │     { payload, proof? }         │                                 │
  │  ─────────────────────────────► │                                 │
  │                                 │  4. Verify proof → trust tier   │
  │                                 │  5. Store JWE in R2             │
  │                                 │  6. Store metadata in KV        │
  │  7. Receive { url, passcode,    │                                 │
  │     trusted }                   │                                 │
  │  ◄───────────────────────────── │                                 │
  │                                 │                                 │
  │  8. Send link + passcode        │                                 │
  │     (email, chat, QR code)      │                                 │
  │  ─────────────────────────────────────────────────────────────►   │
  │                                 │                                 │
  │                                 │  9. POST /exchange/:id/manifest │
  │                                 │     { recipient, passcode }     │
  │                                 │  ◄──────────────────────────────│
  │                                 │                                 │
  │                                 │  10. Verify passcode            │
  │                                 │  11. Return { files: [JWE] }    │
  │                                 │  ──────────────────────────────►│
  │                                 │                                 │
  │                                 │     12. Decrypt JWE → JWS      │
  │                                 │     13. Verify JWS signature    │
  │                                 │         against issuer JWKS     │
  │                                 │                                 │
```

### Step by step

1. **Sender signs** the BIND Bundle as a JWS (optional — see [Signing](#signing))
2. **Sender encrypts** the bundle (or signed JWS) using JWE (`alg: "dir"`, `enc: "A256GCM"`) with a random 256-bit key
3. **Sender creates an exchange** by POSTing the JWE and an optional proof JWT to the exchange server
4. **Server verifies the proof** (if provided) against the BIND Trust Gateway to determine the trust tier
5. **Server stores** the JWE payload and metadata, applying tier-appropriate limits
6. **Server responds** with a retrieval URL, passcode, and trust status
7. **Sender shares** the link and passcode with the recipient via any channel
8. **Recipient retrieves** the manifest by POSTing the passcode to the retrieval URL
9. **Server verifies** the passcode and rate-limits attempts
10. **Server returns** the JWE payload embedded in a manifest envelope
11. **Recipient decrypts** using the key from the link payload
12. **Recipient verifies** the JWS signature (if the bundle was signed) against the issuer's JWKS

## Signing

Signing is **optional** and at the issuer's discretion. The exchange server accepts both signed and unsigned bundles. However, signed bundles from trusted issuers receive significantly better treatment — see [Trust Tiers](#trust-tiers).

### How it works

Exchange uses two layers of signing. The first layer is the standard [Signed Bundle](/signing) — the sender signs the BIND Bundle as a JWS (ES256) with their key from the [BIND Directory](/trust). See the [Signed Bundles specification](/signing) for the full JWS header, payload claims, and verification process.

The signed JWS becomes the plaintext that gets encrypted into the JWE:

```
BIND Bundle JSON → JWS (ES256) → JWE (dir + A256GCM) → upload
```

**Exchange proof (server-verifiable)**

The exchange server cannot see inside the JWE, so it cannot verify the inner JWS signature. To prove trust, the sender provides a separate **proof JWT** when creating the exchange. This proof binds the sender's signing key to the specific JWE payload:

| Proof Header | Value |
|--------------|-------|
| `alg` | `ES256` |
| `kid` | `<key-id>` (same key used for the bundle JWS) |

| Proof Payload Claim | Value |
|----------------------|-------|
| `iss` | `<issuer-url>` (same as the bundle JWS, e.g. `https://bindpki.org/acme`) |
| `sub` | `<base64url(SHA-256(JWE))>` — hash of the encrypted payload |
| `iat` | `<timestamp>` |

The server verifies this proof by:

1. Extracting `iss` from the proof payload
2. Fetching the JWKS from `{iss}/.well-known/jwks.json`
3. Verifying the ES256 signature against the issuer's published public key
4. Confirming `sub` matches `SHA-256` of the submitted JWE (prevents proof replay)

### JWKS discovery

Issuer public keys are published in the **[BIND Directory](/trust)** at [bindpki.org](https://bindpki.org):

```
{iss}/.well-known/jwks.json
```

See the [Trust Directory](/trust) for how participants register and manage their keys.

### Recipient-side verification

After decrypting the JWE, the recipient checks whether the plaintext is a JWS and verifies it against the signer's JWKS from the BIND Directory. See the [Signed Bundles verification process](/signing#verifying-a-signed-bundle) for the full steps.

If the plaintext is not a JWS (i.e. it's raw JSON), the bundle is treated as unsigned.

## Trust Tiers

The exchange server applies different limits based on whether the sender provides a valid proof:

| | Trusted | Untrusted |
|---|---------|-----------|
| **Proof** | Valid proof JWT verified against BIND Trust Gateway | No proof, invalid proof, or issuer not in gateway |
| **Max payload** | 5 MB | 10 KB |
| **Default expiry** | 72 hours | 1 hour |
| **Max expiry** | 1 year + 1 day | 1 hour |
| **Passcode attempts** | 10 | 10 |

Untrusted exchanges are **not rejected** — they are accepted with restricted limits. This allows anyone to use the exchange for small payloads (certificates, simple quotes) without needing to register as a trusted issuer.

Trusted exchanges require the issuer to have registered their signing keys in the [BIND Directory](https://bindpki.org).

## Link Payload

The `bindx://` URI scheme encodes all client-side state needed to retrieve and decrypt the exchange:

```
bindx://<base64url(JSON)>
```

The JSON payload contains:

| Field | Type | Description |
|-------|------|-------------|
| `url` | string | Full URL to the manifest endpoint |
| `key` | string | Base64url-encoded 256-bit AES key |
| `exp` | number | Expiry timestamp (ms since epoch) |
| `flag` | string | Access flags (`P` = passcode required) |
| `label` | string? | Human-readable label for display |

Example decoded payload:

```json
{
  "url": "https://exchange.bind-standard.org/exchange/abc123.../manifest.json",
  "key": "dGhpcyBpcyBhIDI1Ni1iaXQga2V5IGZvciBBRVMtR0NN",
  "exp": 1708300800000,
  "flag": "P",
  "label": "Acme Corp GL Submission"
}
```

The key never leaves the client and is never sent to the server. The server stores only the encrypted payload and a hash of the passcode.

## Encryption

BIND Exchange uses JWE ([RFC 7516](https://datatracker.ietf.org/doc/html/rfc7516)) compact serialization:

| JWE Header | Value | Notes |
|------------|-------|-------|
| `alg` | `dir` | Direct key agreement — the key in the link is the CEK |
| `enc` | `A256GCM` | AES-256-GCM authenticated encryption |
| `cty` | `application/bind+json` | Content type of the plaintext |

The sender generates a random 256-bit key, encrypts the BIND Bundle (or signed JWS), and produces a JWE compact string. This string is what gets uploaded to the exchange server. The key is encoded into the `bindx://` link and shared out-of-band.

## Access Control

| Control | Detail |
|---------|--------|
| **Passcode** | Required for all exchanges (flag `P`). Minimum 4 characters. |
| **Rate limiting** | Maximum 10 passcode attempts. After exhaustion, the exchange is permanently locked and the payload is deleted. |
| **Time limit** | Depends on trust tier — 72h default for trusted, 1h for untrusted. |
| **Zero-knowledge** | The server stores only the encrypted payload and a PBKDF2 hash of the passcode. It cannot read the content. |

### Passcode hashing

Passcodes are hashed using PBKDF2-SHA256 with 310,000 iterations ([OWASP recommendation](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)) and a 128-bit random salt. The storage format is `hex(salt):hex(hash)`, allowing future migration to stronger algorithms.

## API

### Create Exchange

```http
POST /exchange
Content-Type: application/json

{
  "payload": "<JWE compact serialization>",
  "passcode": "secret123",         // optional — generated if omitted
  "label": "Acme Corp GL Policy",  // optional
  "exp": 259200,                   // optional — seconds (capped by trust tier)
  "proof": "<proof JWT>"           // optional — required for trusted tier
}
```

**Response (201):**

```json
{
  "url": "https://exchange.bind-standard.org/exchange/abc123.../manifest.json",
  "exp": 1708300800000,
  "flag": "P",
  "passcode": "482910",
  "trusted": true,
  "iss": "https://bindpki.org/acme-insurance"
}
```

The `trusted` field indicates whether the exchange was verified against the BIND Trust Gateway. The `iss` field is only present for trusted exchanges.

If no proof is provided (or verification fails), the exchange is still created but with untrusted limits:

```json
{
  "url": "https://exchange.bind-standard.org/exchange/def456.../manifest.json",
  "exp": 1708218000000,
  "flag": "P",
  "passcode": "739201",
  "trusted": false
}
```

**Error responses:**

| Status | Meaning |
|--------|---------|
| 400 | Invalid JWE header |
| 413 | Payload exceeds tier limit (10KB untrusted, 5MB trusted) |

### Retrieve Manifest

```http
POST /exchange/{id}/manifest.json
Content-Type: application/json

{
  "recipient": "Jane Doe, Marsh McLennan",
  "passcode": "482910"
}
```

**Response (200):**

```json
{
  "files": [
    {
      "contentType": "application/bind+json",
      "embedded": "<JWE compact serialization>"
    }
  ]
}
```

**Error responses:**

| Status | Meaning | Body |
|--------|---------|------|
| 401 | Invalid passcode | `{ "error": "Invalid passcode", "remainingAttempts": 7 }` |
| 404 | Not found / expired | `{ "error": "Exchange not found or expired" }` |
| 429 | Locked out | `{ "error": "Too many failed attempts. Exchange has been locked.", "remainingAttempts": 0 }` |

## Use Cases

### Certificate distribution

A carrier generates a certificate of insurance as a BIND Bundle, creates an exchange, and sends the link to the certificate holder via email. The recipient opens the link, enters the passcode, and receives the structured certificate data.

### Submission packages

A broker assembles a submission package — insured details, loss runs, schedule of values — as a BIND Bundle. They create an exchange and send links to multiple carriers. Each carrier retrieves the same structured data without portal logins or email attachments.

### Quote responses

A carrier packages their quote — proposed coverages, premiums, terms — as a BIND Bundle and sends it back to the broker via an exchange link. The broker's system can automatically ingest the structured quote data.

### Policy document exchange

After binding, the carrier shares the full policy package — policy, endorsements, certificates — as a BIND Bundle via exchange. The broker receives structured data they can feed directly into their management system.

## Comparison with SMART Health Links

BIND Exchange adapts the [SMART Health Links (SHL)](https://docs.smarthealthit.org/smart-health-links/spec/) protocol for insurance. The core architecture is identical — encrypted payloads, zero-knowledge server, key-in-link — with domain-specific adaptations:

| Aspect | SMART Health Links | BIND Exchange |
|--------|--------------------|---------------|
| **URI scheme** | `shlink://` | `bindx://` |
| **Content type** | `application/smart-health-card`, `application/fhir+json` | `application/bind+json` |
| **Payload** | FHIR Bundles, SMART Health Cards | BIND Bundles |
| **Domain** | Healthcare | Commercial insurance |
| **Encryption** | JWE `dir` + `A256GCM` | JWE `dir` + `A256GCM` (same) |
| **Signing** | JWS ES256, issuer-hosted JWKS | JWS ES256, [BIND Directory](/trust) JWKS |
| **Access control** | Optional passcode (`P` flag) | Required passcode (`P` flag always set) |
| **Trust model** | Verifier decides trust per issuer | Trust Gateway with tiered server limits |
| **Manifest format** | `{ files: [{ contentType, embedded }] }` | `{ files: [{ contentType, embedded }] }` (same) |
