# Changelog

## v0.1.0-alpha.0...v0.1.0-alpha.1

[compare changes](https://github.com/favorodera/distkit/compare/v0.1.0-alpha.0...v0.1.0-alpha.1)

### Added

- **cli:** Add utility subcommand ([6d87544](https://github.com/favorodera/distkit/commit/6d87544))

  - Add `add utility` subcommand to CLI
  - Update documentation across repository
  - Improve error message formatting in CLI utilities


### Fixed

- **schema:** Make $schema optional across schemas ([5e58c95](https://github.com/favorodera/distkit/commit/5e58c95))

  - Allow schemas without required $schema field
  - Prevent validation errors on omitted property


### Tests

- **cli:** Add unit tests for utility functions ([c00f365](https://github.com/favorodera/distkit/commit/c00f365))

  - Make $schema optional in item and registry schemas
  - Simplify item type signatures across CLI utils
  - Add unit tests for file system, registry, imports


### Styling

- **registry:** Reformat arrays in index.json ([ff4f823](https://github.com/favorodera/distkit/commit/ff4f823))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v0.0.1-alpha.0...v0.1.0-alpha.0

[compare changes](https://github.com/favorodera/distkit/compare/v0.0.1-alpha.0...v0.1.0-alpha.0)

### Added

- **cli:** Resolve and install registry items ([57f9f8e](https://github.com/favorodera/distkit/commit/57f9f8e))

  - Resolve registry utilities and npm dependencies
  - Prompt for file overwrites across multiple items
  - Install registry dependencies during initialization

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v0.0.0...v0.0.1-alpha.0

[compare changes](https://github.com/favorodera/distkit/compare/v0.0.0...v0.0.1-alpha.0)

### Added

- **schema:** Add build script and schema updates ([f4ef4ce](https://github.com/favorodera/distkit/commit/f4ef4ce))

  - add build-registry script to bundle registry index
  - add $schema and baseUrl fields to registry schema
  - update schema generation scripts and dependencies
  - configure relizy release hooks for schema build

- **cli:** Initialize @distkit/cli package ([4aa27c8](https://github.com/favorodera/distkit/commit/4aa27c8))

  - bootstrap CLI package with citty and tsdown
  - configure build, test, and linting setups
  - remove unused scripts task from root config

- **schema:** Export $schema helper ([66031f2](https://github.com/favorodera/distkit/commit/66031f2))

  - Export $SchemaSchema helper from index
  - Update helper schema description casing

- **cli:** Add init command ([21cbb19](https://github.com/favorodera/distkit/commit/21cbb19))

  - Add init command to configure project setup
  - Add registry resolution and fetch utilities
  - Rename utils config option to utilities
  - Update CLI entrypoint with init subcommand

- **cli:** Generate config and directories in init ([f5d62c6](https://github.com/favorodera/distkit/commit/f5d62c6))

  - Execute config writing and dir creation tasks
  - Ensure components and utilities folders exist
  - Add base component and utility registry files


### Fixed

- **cli:** Adjust init prompt defaults for paths ([7685495](https://github.com/favorodera/distkit/commit/7685495))

  - Remove alias defaults for directory paths
  - Update directory placeholders to file paths
  - Inline pathe dependency in schema package

- **schema:** Fix registry path in build script ([9240ce7](https://github.com/favorodera/distkit/commit/9240ce7))

  - Fix registry path resolution in build script
  - Lowercase JSON schema descriptions for consistency


### Refactors

- **cli:** Move toRelativePath helper from schema ([d1b5808](https://github.com/favorodera/distkit/commit/d1b5808))

  - Move path helper to CLI package file-system utils
  - Remove public export of path utility from schema
  - Update internal schema scripts to use internal path


### Documentation

- **schema:** Update README with package architecture ([a4fc690](https://github.com/favorodera/distkit/commit/a4fc690))

  - Document layout, exports, and usage examples
  - Explain schema composition and dependencies
  - Add guide for extending with custom item types


### Chores

- **schema:** Inline pathe and format files ([00e950b](https://github.com/favorodera/distkit/commit/00e950b))

  - Add pathe to inlinedDependencies in package.json
  - Format JSON and TypeScript files across packages
  - Fix trailing newlines and syntax formatting

- **vscode:** Configure workspace and linting rules ([454303a](https://github.com/favorodera/distkit/commit/454303a))

  - Add VS Code settings and recommendations
  - Simplify compileSchema type inference in CLI
  - Add temporary debug logs to init command

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))
