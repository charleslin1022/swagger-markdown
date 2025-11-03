# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the TypeScript sources: `index.ts` wires the CLI, `swagger-markdown.ts` exposes the executable, helpers sit in `lib/` and `transformers/`.
- `specifications/` hosts sample OpenAPI definitions for fixtures, while `examples/` stores generated markdown snapshots that guard regressions.
- `dist/` is build output from `npm run build`; treat it as read-only.
- Maintenance scripts (e.g., `scripts/make-examples.ts`) and CI config (`.github/`, `.circleci/`) support automation.

## Build, Test, and Development Commands
- `npm run build` removes `dist/`, compiles via `tsc`, and ensures the published CLI binary is executable.
- `npm run test` chains unit tests, linting, type checks, and markdown linting; run before every pull request.
- `npm run test:app` executes the Jest suite; add `-- --testNamePattern="keyword"` to focus on a subset.
- `npm run typecheck` runs `tsc --noEmit`; `npm run test:markdown` validates example docs and pairs with `npm run make:examples`.
- `npm run test:lint` or `npx eslint src/**/*.ts` keeps style consistent; Husky hooks run lint-staged on commit.

## Coding Style & Naming Conventions
- Two-space indentation is enforced by `@typescript-eslint/indent`; ESLint extends Airbnb Base with TypeScript overrides (`no-console`, underscore-ignored params, explicit shadow rules).
- Name files after their responsibility (`transformers/operation.ts`, `types.ts`) and prefer named exports—`import/prefer-default-export` is disabled to encourage clarity.
- Keep modules side-effect free unless they wire the CLI; shared utilities belong in `lib/`.

## Testing Guidelines
- Write Jest specs alongside code as `*.spec.ts`; reuse fixtures from `specifications/` and update `examples/` when output expectations change.
- Target new branches via `npm run test:app -- --testPathPattern=module` or stay in TDD with `npm run test:watch`.
- After behavior changes, rerun `npm run make:examples` then `npm run test:markdown` to refresh markdown lint baselines.
- No formal coverage gate exists, but keep assertions covering CLI flags and transformer edge cases.

## Commit & Pull Request Guidelines
- Use Conventional Commits (`type(scope): summary`), e.g., `fix(parser): normalise ref resolution`; `npm run commit` invokes Commitizen and commitlint validation.
- Keep commits scoped; include test or example updates with the code change.
- Pull requests should outline intent, link related issues, and list verification steps (tests, markdown rebuilds). Attach diff excerpts or screenshots when generated docs change.
- Confirm CI (semantic-release, lint, tests) stays green before requesting review.
