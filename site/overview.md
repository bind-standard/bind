# BIND Overview

**BIND** (Business Insurance Normalized Data) is a data interoperability standard for insurance. It defines a common set of resource types and data structures that enable systems across the insurance ecosystem to exchange information in a consistent, machine-readable format.

## Background

Insurance is a fragmented industry. Brokers, carriers, MGAs, TPAs, and reinsurers each use different systems with different data models. Moving a submission from broker to carrier, binding a quote into a policy, or reporting a claim involves manual data re-entry, PDF parsing, and bespoke integrations.

**BIND** defines resources like Insured, Submission, Quote, Policy, Coverage, and Claim — the core concepts that every participant in the insurance ecosystem works with daily.

## Components

### Resources

Resources are the primary building blocks of BIND. Each resource represents a distinct, identifiable concept in insurance:

| Category | Resources | Description |
|----------|-----------|-------------|
| **Parties** | [Insured](/resources/Insured), [Organization](/resources/Organization) | The entities involved — policyholders, carriers, brokers, MGAs |
| **Workflow** | [Submission](/resources/Submission), [Quote](/resources/Quote) | The pre-bind process of requesting and offering coverage |
| **Contract** | [Policy](/resources/Policy), [Coverage](/resources/Coverage) | The bound agreement and its specific coverage sections |
| **Claims** | [Claim](/resources/Claim) | Loss reporting and the claims workflow |
| **Property** | [Location](/resources/Location) | Physical premises and statement-of-values data |

Every resource has a `resourceType` discriminator, an optional `id`, and optional `meta` for versioning and provenance.

### Data Types

[Data types](/data-types/) are reusable structures shared across resources:

- **[Coding](/data-types/Coding)** — A coded value from a code system (e.g., NAICS code, line of business)
- **[CodeableConcept](/data-types/CodeableConcept)** — A concept with one or more coded representations plus text
- **[Reference](/data-types/Reference)** — A link from one resource to another (`{ResourceType}/{id}`)
- **[Money](/data-types/Money)** — A monetary amount with currency
- **[Period](/data-types/Period)** — A time range with start and end dates
- **[Address](/data-types/Address)** — Physical or mailing address
- **[Quantity](/data-types/Quantity)** — A value with unit of measure
- **[ContactPoint](/data-types/ContactPoint)** — Phone, email, or other contact info
- **[Attachment](/data-types/Attachment)** — Document or file reference

### References

Resources link to each other via **References**. A Policy references an Insured, a Carrier (Organization), and optionally a Broker. A Claim references a Policy. This graph of references models the real relationships in insurance.

```
Insured ← Submission → Quote → Policy → Coverage
                                  ↓
                                Claim
```

## Approach

### Composition over inheritance

BIND resources are composed of data types rather than inheriting from deep class hierarchies. A Policy has a `totalPremium` (Money), an `effectivePeriod` (Period), and an `insured` (Reference) — each a standalone, well-defined type.

### TypeScript as source of truth

The canonical definitions live in TypeScript interfaces. JSON Schemas are auto-generated from these types, ensuring the schema always matches the type definitions. This means TypeScript applications get native type safety, while any language can validate against the JSON Schema.

### Extensibility via CodeableConcept

Rather than hardcoding every possible classification, BIND uses `CodeableConcept` — a pattern that pairs machine-readable codes with human-readable text. This allows different organizations to use their own code systems while maintaining interoperability.

## Inspiration

BIND draws inspiration from [HL7 FHIR](https://hl7.org/fhir/) (Fast Healthcare Interoperability Resources), which solved the same fragmentation problem in healthcare by defining common resource types and a composable data model. BIND adapts these proven patterns — resource-based modeling, coded values, references between resources — for the insurance domain.

## Initiative

BIND is an open initiative aimed at establishing a shared language for insurance data. It was created by [CloudRaker](https://cloudraker.com), a leader in AI-driven productivity solutions, interoperability, and trust for the insurance industry. The initiative is on a path to becoming a separate, not-for-profit entity — ensuring that governance remains neutral, transparent, and community-driven.

**We welcome new members and contributions** from across the ecosystem: insurtechs, insurers, brokers, MGAs, and technology partners who share the vision of seamless data exchange.

CloudRaker will operate the upcoming **Trust Gateway** and **BIND Mobile** app — production infrastructure that brings the standard to life and enables real-world interoperability between participants.

## The Standard

Browse the full standard:

- **[Resources](/resources/)** — The 8 core resource types
- **[Data Types](/data-types/)** — The 20 reusable data structures

