# Contributing to BIND

BIND is an open standard and we welcome contributions from everyone in the insurance ecosystem — brokers, carriers, MGAs, TPAs, reinsurers, vendors, and developers.

## How to Contribute

1. **Fork** this repository
2. **Create a branch** for your change
3. **Make your changes** and commit them
4. **Open a pull request** against `main`

That's it. All contributions are reviewed before merging.

## What to Contribute

- **New resource types or data types** — If you see a concept missing from the standard, propose it.
- **Field additions or modifications** — If existing resources need new fields or adjustments, open a PR with your rationale.
- **Documentation improvements** — Clarifications, examples, typo fixes — all welcome.
- **Bug fixes** — In schemas, type definitions, or the documentation site.
- **Tooling** — Scripts, validators, or utilities that help the ecosystem adopt BIND.

## Guidelines

- Keep PRs focused. One concept per pull request makes review easier.
- Include a clear description of *why* the change is needed, not just *what* changed.
- Follow existing naming conventions and patterns in the TypeScript types.
- If proposing a new resource, look at how existing resources are structured and follow the same approach.

## Code Quality

This project uses [Biome](https://biomejs.dev/) for linting, formatting, and import sorting.

Before opening a PR, run:

```bash
pnpm run check        # lint + format + import check (what CI runs)
pnpm run check:fix    # auto-fix all issues
pnpm run typecheck    # TypeScript type checking
```

CI runs these checks automatically on every pull request.

## Questions or Ideas?

If you want to discuss something before opening a PR, reach out at **contact@bind-standard.org**.

## License

By contributing to BIND, you agree that your contributions to the specification will be released under the [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) license.
