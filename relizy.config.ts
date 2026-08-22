import { defineConfig } from 'relizy'

const packages = ['packages/*']

export default defineConfig({
  hooks: {
    'before:commit-and-tag': 'git add ./packages/registry',
    'success:bump': 'pnpm --filter=@nka/registry generate-json-schemas && pnpm --filter=@nka/registry build-registry',
  },
  monorepo: {
    includePrivates: true,
    packages,
    versionMode: 'unified',
  },
  projectName: 'nka',
  publish: {
    access: 'public',
    buildCmd: 'pnpm build',
    packageManager: 'pnpm',
    packages,
    registry: 'https://registry.npmjs.org',
  },
  types: {
    build: { semver: 'patch', title: 'Builds' },
    chore: { semver: 'patch', title: 'Chores' },
    ci: { semver: 'patch', title: 'Continuous Integrations' },
    docs: { semver: 'patch', title: 'Documentation' },
    feat: { semver: 'minor', title: 'Added' },
    fix: { semver: 'patch', title: 'Fixed' },
    perf: { semver: 'patch', title: 'Performance' },
    refactor: { semver: 'patch', title: 'Refactors' },
    style: { semver: 'patch', title: 'Styling' },
    test: { semver: 'patch', title: 'Tests' },
  },
})
