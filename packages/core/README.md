<div align="center">
  <h1>
    <code>@distkit/core</code>
  </h1>

  <p>
    Configuration helper for distkit consumer projects. Provides the <code>defineConfig</code>
    function used in <code>distkit.config.ts and the distkit CLI binary </code>.
  </p>
</div>

## What's in here

Two things, both thin:

- **`defineConfig()`** — an identity function typed against `UserConfig` (from `@distkit/cli`), used in a consumer's `distkit.config.ts` for editor autocomplete and validation. It does nothing at runtime beyond returning what's passed in.
- **The `distkit` binary** — `bin/distkit.mjs` re-exports `@distkit/cli`'s entry point. Installing `@distkit/core` alone gives a consumer both the config helper and the `distkit` command; they never need to install `@distkit/cli` directly.

## Usage

```ts
// distkit.config.ts
import { defineConfig } from '@distkit/core'

export default defineConfig({
  components: {
    dir: 'src/components',
    import: '@/components'
  },
  registries: {
    distkit: 'https://raw.githubusercontent.com/favorodera/distkit/refs/tags/v0.1.0-alpha.0/registry/index.json',
  },
  utilities: {
    dir: 'src/utils',
    import: '@/utils'
  },
})
```

```bash
distkit init
distkit add component button
```

## Why this exists separately from `@distkit/cli`

`@distkit/cli` is the actual implementation — commands, registry resolution, file installation. `@distkit/core` is the package name a consumer installs and imports from; it depends on `@distkit/cli` and re-exports its binary, so the CLI's internals can be restructured without changing what a consumer's `package.json` or `distkit.config.ts` points at.

## License

MIT