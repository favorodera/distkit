<div align="center"> 
  <h1><code>@distkit/cli</code></h1> 

  <p> 
    Command-line interface for resolving, validating, and installing items from a distkit registry. 
  </p> 
</div>

## Commands

### `distkit init`

Initializes distkit in your project. Prompts you for component and utility directories, generates a `distkit.config.ts`, creates the configured directories, and installs any registry-level dependencies.

```bash
npx distkit init
```

The init flow:

1. Prompts for component directory and import alias.
2. Prompts for utility directory and import alias.
3. Asks to confirm overwrites if any target paths already exist.
4. Fetches and validates the default registry.
5. Resolves registry-level dependencies (shared utilities and npm packages).
6. Writes the config file, creates directories, and installs resolved items.

### `distkit add component <name...>`

Adds one or more components to your project from a registry.

```bash
npx distkit add component button
npx distkit add component button card dialog
```

**Flags:**

| Flag | Alias | Default | Description |
|---|---|---|---|
| `--registry` | `-r` | `distkit` | Registry name to resolve items from |

### `distkit add utility <name...>`

Adds one or more utilities to your project from a registry.

```bash
npx distkit add utility props
npx distkit add utility props cn
```

**Flags:**

| Flag | Alias | Default | Description |
|---|---|---|---|
| `--registry` | `-r` | `distkit` | Registry name to resolve items from |

## How resolution works

When you run an `add` command:

1. The CLI loads your `distkit.config.ts` using [c12](https://github.com/unjs/c12).
2. The registry name is resolved to its index URL from your config.
3. The registry `index.json` is fetched and validated against the `RegistrySchema` (TypeBox → JSON Schema).
4. Requested items and their transitive dependencies are resolved recursively — components can depend on other components, utilities, and npm packages; utilities can depend on other utilities and npm packages.
5. For each file-based item, the source file is fetched from the registry's `baseUrl`, imports are rewritten to match your configured aliases, and the file is written to the appropriate directory.
6. npm package dependencies are installed automatically via [nypm](https://github.com/unjs/nypm) if they aren't already present.

## Configuration

The CLI reads a `distkit.config.ts` from the current working directory or its parents. The config shape:

```ts
interface UserConfig {
  components: {
    dir: string // relative directory for components
    import: string // import alias (e.g., "@/components")
  }
  registries: Record<string, string> // name → index URL
  utilities: {
    dir: string // relative directory for utilities
    import: string // import alias (e.g., "@/utils")
  }
}
```

## Source layout

```text
src/
  commands/
    add/
      index.ts        Add command (parent for component/utility subcommands)
      component.ts    distkit add component implementation
      utility.ts      distkit add utility implementation
    init.ts           distkit init implementation
  types/
    index.ts          UserConfig, ResolvedRegistryItem, GeneratedItemKey
  utils/
    config.ts         Config loading (c12) and generation
    constants.ts      Default registry name, URL, config file name
    file-system.ts    Path resolution, overwrite prompts
    imports.ts        Import alias rewriting
    network.ts        Fetch utilities (JSON + text)
    npm.ts            npm package installation (nypm)
    registry.ts       Registry fetching, item resolution, installation
  index.ts            CLI entrypoint (citty)
```
