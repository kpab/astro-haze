# Contributing to astro-haze

Thanks for your interest in improving astro-haze! Contributions of all kinds are welcome —
bug reports, feature ideas, documentation fixes, and pull requests.

## Ways to contribute

- **Bug reports & feature requests** — open an issue using the matching template.
- **Questions & ideas** — start a thread in [GitHub Discussions](https://github.com/kpab/astro-haze/discussions).
- **Pull requests** — fixes and improvements are welcome. For larger changes, please open an
  issue or discussion first so we can align before you invest time.

## Development setup

> **Requirements:** Node.js 22.12 or newer · npm

```sh
git clone https://github.com/kpab/astro-haze.git
cd astro-haze
npm install
npm run dev
```

Before submitting, make sure diagnostics pass:

```sh
npm run check
```

See the [Project structure](README.md#project-structure) section of the README for an
overview of where things live.

## Design guidelines

astro-haze aims to stay lean and considered. When contributing, please keep these
principles in mind:

- **Static-first, minimal client JS** — prefer build-time solutions; add client-side
  scripts only when there is no reasonable alternative.
- **Use the design tokens** — colors, spacing, radii, and transitions come from
  `src/styles/tokens.css`. Avoid hard-coded values in components.
- **Both color modes** — every visual change must look right in light *and* dark mode.
- **Accessibility is non-negotiable** — preserve landmarks, keyboard focus states,
  `prefers-reduced-motion` / `prefers-reduced-transparency` handling, and WCAG AA-conscious
  contrast.
- **Dependency-light** — new runtime dependencies need a strong justification.

## Pull requests

1. Branch from `master` and keep each PR focused on a single topic.
2. Follow the existing commit style: a `type: summary` subject line
   (`feat:`, `fix:`, `docs:`, `chore:`), lower-case, imperative mood.
3. Run `npm run check` and confirm it passes.
4. For visual changes, include before/after screenshots in both light and dark mode.
5. Update the README if you change configuration options, content schemas, or commands.

## License

By contributing, you agree that your contributions will be licensed under the
[MIT License](LICENSE).
