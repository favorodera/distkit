# Contributing to distkit

distkit is a reference implementation, not an actively maintained project. It exists to document how a registry-and-CLI system for distributing open code can be built, and to give anyone who wants one a working starting point to fork.

Issues and pull requests are welcome, but there's no roadmap and no guarantee of timely review. If you need it to do something different, forking and adapting it is the intended path — not waiting on a PR to land here.

That said, if you want to explore, fix, or extend it locally:

## Setup

### Prerequisites

- Node.js 22+
- pnpm 11+

### Install

```bash
git clone https://github.com/favorodera/distkit.git
cd distkit

pnpm install
pnpm dev
```

## Repository Structure

```text
packages/
  cli/        Command-line interface for resolving and installing items
  core/       Shared runtime utilities used by the CLI and schema tooling
  schema/     TypeBox schemas for registries and registry items, plus validation
```

## Principles

If you're extending this rather than just reading it, these are the assumptions the code is built on:

- **Open code.** Items are copied into a consumer's project and become theirs to own and modify. Nothing here should require a runtime dependency on distkit itself.
- **Registry first.** Anything installable is represented as a registry item — there's no separate path for "special" resources.
- **Schema validated, not convention validated.** Registry and item shapes are defined once in `packages/schema` with TypeBox and enforced at build and install time, not just documented.
- **Framework agnostic.** `cli` and `core` shouldn't assume what kind of files an item contains. Anything ecosystem-specific belongs in the schema or the item, not the engine.

## Before Opening a Pull Request

- Run `pnpm ready`.
- Keep the change focused on one thing.
- If it's a bigger change than a fix, open an issue first — there's a decent chance the direction won't match where this repo is meant to stay simple.

## License

MIT. Fork freely.