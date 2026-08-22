<div align="center">
  <h1>distkit</h1>

  <blockquote>
    A minimal registry and CLI for distributing open code. Fork it and build your own.
  </blockquote>
</div>


## What this is

distkit is a reference implementation of an "open code" distribution system: a **registry** — a schema-validated catalog of installable items — and a **CLI** that resolves those items and writes them into a consumer's project. Same general idea as how tools like shadcn/ui or shadcn-vue distribute components, but not tied to components, or to any one ecosystem.

A "deliverable" here can be a component, a config file, a script, a template, a hook, or anything else that can be described as a set of files with dependencies.

Schemas are defined with [TypeBox](https://github.com/sinclairzx81/typebox), so registry and item definitions are validated against real JSON Schema at build and install time — not just checked by convention.

## What this is not

- **Not published to npm.** Clone or fork the repo directly; there's no package to install.
- **Not an actively maintained product.** See [CONTRIBUTING.md](./CONTRIBUTING.md) for what that means in practice.
- **Not opinionated about what you're distributing.** It doesn't assume components, and it isn't built around any particular framework.

## Structure

```text
packages/
  cli/        Command-line interface for resolving and installing items
  core/       Shared runtime utilities used by the CLI and schema tooling
  schema/     TypeBox schemas for registries and registry items, plus validation
```

## How it works, roughly

1. A `registry.json` lists the items a registry serves.
2. Each item is a schema-validated JSON document describing its name, files, and dependencies.
3. The CLI resolves an item — and anything it depends on — fetches its files, and writes them into the target project.

That's the whole shape. No install-time magic beyond dependency resolution and file placement.

## Using this as a starting point

Fork the repo, strip out whatever you don't need, and adapt the schemas in `packages/schema` to whatever you're distributing. `cli` and `core` are written to be generic rather than assuming a particular kind of deliverable.

## License

MIT