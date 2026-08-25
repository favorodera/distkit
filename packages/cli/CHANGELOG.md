# Changelog

## v0.0.0...v0.1.0

[compare changes](https://github.com/favorodera/distkit/compare/v0.0.0...v0.1.0)

### Added

- **cli:** Initialize @distkit/cli package ([4aa27c8](https://github.com/favorodera/distkit/commit/4aa27c8))

  - bootstrap CLI package with citty and tsdown
  - configure build, test, and linting setups
  - remove unused scripts task from root config

- **cli:** Add DistkitConfig configuration interface ([f1c148c](https://github.com/favorodera/distkit/commit/f1c148c))

  - Define structure for components, utils, and registries
  - Support import aliases and relative directories

- **cli:** Add network fetch utilities ([a9e79cb](https://github.com/favorodera/distkit/commit/a9e79cb))

  - Add text fetch client for source files
  - Add JSON fetch client for registry metadata

- **cli:** Add user config loading and generation ([48b1fb1](https://github.com/favorodera/distkit/commit/48b1fb1))

  - Load user configuration using c12
  - Add helper to generate config file templates

- **cli:** Define shared constants and command args ([05af653](https://github.com/favorodera/distkit/commit/05af653))

  - Add default registry URL and configuration names
  - Provide reusable common arguments for commands

- **cli:** Add file system utilities ([7b80b0b](https://github.com/favorodera/distkit/commit/7b80b0b))

  - Add helpers to resolve item install paths
  - Add prompt helpers for file overwrite checks

- **cli:** Add import rewriting utility ([e42e349](https://github.com/favorodera/distkit/commit/e42e349))

  - Support rewriting imports using user config aliases
  - Replace internal namespaces with configured paths

- **cli:** Add npm package installation helper ([f042ed3](https://github.com/favorodera/distkit/commit/f042ed3))

  - Add utility to install packages dynamically
  - Support package version specification
  - Use nypm to ensure dependency is installed

- **cli:** Add init command ([21cbb19](https://github.com/favorodera/distkit/commit/21cbb19))

  - Add init command to configure project setup
  - Add registry resolution and fetch utilities
  - Rename utils config option to utilities
  - Update CLI entrypoint with init subcommand

- **cli:** Add validation and default values to init ([c918e03](https://github.com/favorodera/distkit/commit/c918e03))

  - provide default initial values for prompts
  - prevent empty path submissions with validation

- **cli:** Generate config and directories in init ([f5d62c6](https://github.com/favorodera/distkit/commit/f5d62c6))

  - Execute config writing and dir creation tasks
  - Ensure components and utilities folders exist
  - Add base component and utility registry files

- **cli:** Add registry item resolution and install ([7ff0acf](https://github.com/favorodera/distkit/commit/7ff0acf))

  - Add helper to resolve items and dependencies
  - Implement file downloading and import rewriting
  - Support automatic npm package installation

- **cli:** Resolve and install registry items ([57f9f8e](https://github.com/favorodera/distkit/commit/57f9f8e))

  - Resolve registry utilities and npm dependencies
  - Prompt for file overwrites across multiple items
  - Install registry dependencies during initialization

- **cli:** Introduce add command and core package ([14b7f2c](https://github.com/favorodera/distkit/commit/14b7f2c))

  - Add component subcommand to distkit add
  - Create core package with config helper and binary
  - Update playground to use @distkit/core package

- **cli:** Add utility subcommand ([6d87544](https://github.com/favorodera/distkit/commit/6d87544))

  - Add `add utility` subcommand to CLI
  - Update documentation across repository
  - Improve error message formatting in CLI utilities


### Fixed

- **cli:** Adjust init prompt defaults for paths ([7685495](https://github.com/favorodera/distkit/commit/7685495))

  - Remove alias defaults for directory paths
  - Update directory placeholders to file paths
  - Inline pathe dependency in schema package

- **cli:** Update default registry index URL path ([7d5c860](https://github.com/favorodera/distkit/commit/7d5c860))

  - Correct registry index path in repository URL

- **cli:** Correct generated config file syntax ([b551349](https://github.com/favorodera/distkit/commit/b551349))

  - Remove stray trailing bracket in config template
  - Structure user config keys explicitly on init
  - Add playground sample config and fix release hook

- **schema:** Fix registry path in build script ([9240ce7](https://github.com/favorodera/distkit/commit/9240ce7))

  - Fix registry path resolution in build script
  - Lowercase JSON schema descriptions for consistency

- **cli:** Skip installing existing npm packages ([b6ec3be](https://github.com/favorodera/distkit/commit/b6ec3be))

  - Check package.json before installing npm packages
  - Switch to nypm addDependency for package installs


### Refactors

- **cli:** Rename DistkitConfig to UserConfig ([38cb4a3](https://github.com/favorodera/distkit/commit/38cb4a3))

  - Clarify user project configuration typing

- **cli:** Move toRelativePath helper from schema ([d1b5808](https://github.com/favorodera/distkit/commit/d1b5808))

  - Move path helper to CLI package file-system utils
  - Remove public export of path utility from schema
  - Update internal schema scripts to use internal path


### Chores

- **schema:** Inline pathe and format files ([00e950b](https://github.com/favorodera/distkit/commit/00e950b))

  - Add pathe to inlinedDependencies in package.json
  - Format JSON and TypeScript files across packages
  - Fix trailing newlines and syntax formatting

- **cli:** Restrict package publishing access ([eb391f1](https://github.com/favorodera/distkit/commit/eb391f1))

  - Prevent accidental public publication to npm

- **cli:** Remove unused path mappings ([a6d331c](https://github.com/favorodera/distkit/commit/a6d331c))

  - Clean up unused tsconfig path aliases

- **vscode:** Configure workspace and linting rules ([454303a](https://github.com/favorodera/distkit/commit/454303a))

  - Add VS Code settings and recommendations
  - Simplify compileSchema type inference in CLI
  - Add temporary debug logs to init command

- **cli:** Log parsed registry on init ([2d0f6bb](https://github.com/favorodera/distkit/commit/2d0f6bb))

### Tests

- **cli:** Add unit tests for utility functions ([c00f365](https://github.com/favorodera/distkit/commit/c00f365))

  - Make $schema optional in item and registry schemas
  - Simplify item type signatures across CLI utils
  - Add unit tests for file system, registry, imports


### Styling

- **registry:** Reformat arrays in index.json ([ff4f823](https://github.com/favorodera/distkit/commit/ff4f823))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v0.1.0-alpha.0...v0.1.0-alpha.1

[compare changes](https://github.com/favorodera/distkit/compare/v0.1.0-alpha.0...v0.1.0-alpha.1)

### Added

- **cli:** Introduce add command and core package ([14b7f2c](https://github.com/favorodera/distkit/commit/14b7f2c))

  - Add component subcommand to distkit add
  - Create core package with config helper and binary
  - Update playground to use @distkit/core package

- **cli:** Add utility subcommand ([6d87544](https://github.com/favorodera/distkit/commit/6d87544))

  - Add `add utility` subcommand to CLI
  - Update documentation across repository
  - Improve error message formatting in CLI utilities


### Fixed

- **cli:** Skip installing existing npm packages ([b6ec3be](https://github.com/favorodera/distkit/commit/b6ec3be))

  - Check package.json before installing npm packages
  - Switch to nypm addDependency for package installs


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

- **cli:** Initialize @distkit/cli package ([4aa27c8](https://github.com/favorodera/distkit/commit/4aa27c8))

  - bootstrap CLI package with citty and tsdown
  - configure build, test, and linting setups
  - remove unused scripts task from root config

- **cli:** Add DistkitConfig configuration interface ([f1c148c](https://github.com/favorodera/distkit/commit/f1c148c))

  - Define structure for components, utils, and registries
  - Support import aliases and relative directories

- **cli:** Add network fetch utilities ([a9e79cb](https://github.com/favorodera/distkit/commit/a9e79cb))

  - Add text fetch client for source files
  - Add JSON fetch client for registry metadata

- **cli:** Add user config loading and generation ([48b1fb1](https://github.com/favorodera/distkit/commit/48b1fb1))

  - Load user configuration using c12
  - Add helper to generate config file templates

- **cli:** Define shared constants and command args ([05af653](https://github.com/favorodera/distkit/commit/05af653))

  - Add default registry URL and configuration names
  - Provide reusable common arguments for commands

- **cli:** Add file system utilities ([7b80b0b](https://github.com/favorodera/distkit/commit/7b80b0b))

  - Add helpers to resolve item install paths
  - Add prompt helpers for file overwrite checks

- **cli:** Add import rewriting utility ([e42e349](https://github.com/favorodera/distkit/commit/e42e349))

  - Support rewriting imports using user config aliases
  - Replace internal namespaces with configured paths

- **cli:** Add npm package installation helper ([f042ed3](https://github.com/favorodera/distkit/commit/f042ed3))

  - Add utility to install packages dynamically
  - Support package version specification
  - Use nypm to ensure dependency is installed

- **cli:** Add init command ([21cbb19](https://github.com/favorodera/distkit/commit/21cbb19))

  - Add init command to configure project setup
  - Add registry resolution and fetch utilities
  - Rename utils config option to utilities
  - Update CLI entrypoint with init subcommand

- **cli:** Add validation and default values to init ([c918e03](https://github.com/favorodera/distkit/commit/c918e03))

  - provide default initial values for prompts
  - prevent empty path submissions with validation

- **cli:** Generate config and directories in init ([f5d62c6](https://github.com/favorodera/distkit/commit/f5d62c6))

  - Execute config writing and dir creation tasks
  - Ensure components and utilities folders exist
  - Add base component and utility registry files

- **cli:** Add registry item resolution and install ([7ff0acf](https://github.com/favorodera/distkit/commit/7ff0acf))

  - Add helper to resolve items and dependencies
  - Implement file downloading and import rewriting
  - Support automatic npm package installation


### Fixed

- **cli:** Adjust init prompt defaults for paths ([7685495](https://github.com/favorodera/distkit/commit/7685495))

  - Remove alias defaults for directory paths
  - Update directory placeholders to file paths
  - Inline pathe dependency in schema package

- **cli:** Update default registry index URL path ([7d5c860](https://github.com/favorodera/distkit/commit/7d5c860))

  - Correct registry index path in repository URL

- **cli:** Correct generated config file syntax ([b551349](https://github.com/favorodera/distkit/commit/b551349))

  - Remove stray trailing bracket in config template
  - Structure user config keys explicitly on init
  - Add playground sample config and fix release hook

- **schema:** Fix registry path in build script ([9240ce7](https://github.com/favorodera/distkit/commit/9240ce7))

  - Fix registry path resolution in build script
  - Lowercase JSON schema descriptions for consistency


### Refactors

- **cli:** Rename DistkitConfig to UserConfig ([38cb4a3](https://github.com/favorodera/distkit/commit/38cb4a3))

  - Clarify user project configuration typing

- **cli:** Move toRelativePath helper from schema ([d1b5808](https://github.com/favorodera/distkit/commit/d1b5808))

  - Move path helper to CLI package file-system utils
  - Remove public export of path utility from schema
  - Update internal schema scripts to use internal path


### Chores

- **schema:** Inline pathe and format files ([00e950b](https://github.com/favorodera/distkit/commit/00e950b))

  - Add pathe to inlinedDependencies in package.json
  - Format JSON and TypeScript files across packages
  - Fix trailing newlines and syntax formatting

- **cli:** Restrict package publishing access ([eb391f1](https://github.com/favorodera/distkit/commit/eb391f1))

  - Prevent accidental public publication to npm

- **cli:** Remove unused path mappings ([a6d331c](https://github.com/favorodera/distkit/commit/a6d331c))

  - Clean up unused tsconfig path aliases

- **vscode:** Configure workspace and linting rules ([454303a](https://github.com/favorodera/distkit/commit/454303a))

  - Add VS Code settings and recommendations
  - Simplify compileSchema type inference in CLI
  - Add temporary debug logs to init command

- **cli:** Log parsed registry on init ([2d0f6bb](https://github.com/favorodera/distkit/commit/2d0f6bb))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))
