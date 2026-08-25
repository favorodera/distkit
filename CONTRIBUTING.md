<div align="center">
 <h1>Contributing to distkit</h1>
 
 <p>
  distkit is maintained, but casually — think dependency bumps and small fixes rather than a roadmap. It doesn't have my full attention day to day, so response times on issues and PRs will vary, but it isn't abandoned either.
 </p>
</div>

## Code of Conduct

This project follows a [Code of Conduct](./CODE_OF_CONDUCT.md). Participating means agreeing to it.

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 11+

### Setup

```bash
git clone https://github.com/favorodera/distkit.git
cd distkit

pnpm install
pnpm dev
```

### Testing your changes

`apps/playground` is a real (if minimal) consumer project, wired up with its own `distkit.config.ts` pointing at this repo's registry. If you're touching the CLI, registry resolution, or item installation, it's the fastest way to see the whole loop end to end:

```bash
cd apps/playground
pnpm distkit add component button
```

## Repository Structure

```text
apps/
  playground/     A real project used to test distkit end to end

packages/
  cli/            The `distkit` command-line tool
  core/           defineConfig() + CLI binary re-export — what consumers install
  schema/         TypeBox schemas, validation, and registry build scripts

registry/         Manifest entries and the built registry index
store/            Source for every deliverable distkit distributes
```

`store` doesn't have its own `package.json` yet — see the root [README](./README.md#where-things-live) for the plan to make it a full (but never-published) workspace package, purely for editor and type-checking support while authoring items.

## Development Workflow

Create a dedicated branch for your work.

| Pattern | Purpose |
| --- | --- |
| `feat/...` | New features |
| `fix/...` | Bug fixes |
| `docs/...` | Documentation |
| `refactor/...` | Refactoring |
| `chore/...` | Maintenance |

distkit follows the Conventional Commits specification.

Examples:

```text
feat(cli): add utility subcommand
fix(schema): correct utility dependency validation
docs: update registry README
```

Before opening a pull request, ensure the project passes validation.

```bash
pnpm ready
```

CI runs lint, typecheck, test, and build on every push and pull request. Pull requests also get a preview package published via `pkg-pr-new`, so changes can be installed and tested directly from the PR before it merges.

## Architecture Guidelines

distkit is guided by a few core principles. Contributions should follow these whenever possible.

### Open Code

Registry items are copied into the user's project and become part of their codebase. Avoid introducing abstractions that prevent developers from understanding, modifying, or owning the generated source.

### Registry First

Everything installable is represented as a registry item — there's no separate path for "special" resources.

### Schema Validated, Not Convention Validated

Registry and item shapes are defined once in `packages/schema` with TypeBox and enforced at build and install time, not just documented.

### Framework Agnostic

`packages/cli` and `packages/core` shouldn't assume what kind of files an item contains. Anything ecosystem- or ui-specific belongs in the schema or the item, not the engine — see `packages/schema`'s README for how the current component/utility item types are meant as an example, not a requirement.

## Releases

Releases are cut manually via the "Release" GitHub Action — pick a version bump, and [Relizy](https://relizy.dev/) handles the rest. All packages are versioned in lockstep (`versionMode: 'unified'`), so the CLI's own version always matches the registry index it points at by default.

On release, `@distkit/schema`'s `generate:json-schemas` and `build:registry` scripts run automatically, so `json-schemas/` and `registry/index.json` are always in sync with whatever changed before the version bump and tag are committed.

## Pull Requests

- The PR template applies automatically — fill it out.
- Run `pnpm ready` before opening.
- Keep each PR focused on one concern.
- For larger changes, open an issue first.

## Reporting Bugs / Suggesting Features

Use the issue templates — [Bug Report](.github/ISSUE_TEMPLATE/bug_report.yml) or [Feature Request](.github/ISSUE_TEMPLATE/feature_request.yml).

## License

MIT