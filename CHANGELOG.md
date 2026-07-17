# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-07-17

### Added

- Pagefind-powered static site search behind a new `features.search` flag ([#1](https://github.com/kpab/astro-haze/pull/1))
  - Search index generated during `astro build` via the `astro-pagefind` integration — no deploy-workflow changes needed
  - Glass search modal (native `<dialog>`) opened from a header button or <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd>, with ↑/↓ result navigation
  - Pagefind bundle lazy-loaded on first open; site chrome excluded from the index with `data-pagefind-ignore`

## [1.0.0] - 2026-06-30

### Added

- Initial release: glassmorphism multi-purpose Astro 7 theme
  - Reusable glass UI system with aurora backgrounds, light/dark theme toggle
  - Paginated blog with tags, table of contents, reading time and share links
  - Portfolio with technology filters, case-study pages and responsive galleries
  - Config-driven e-commerce landing page
  - SEO (canonical, Open Graph, Twitter cards, JSON-LD), RSS feed and XML sitemap
  - Optimized images (AVIF/WebP via `astro:assets`), accessibility and reduced-motion support

[1.1.0]: https://github.com/kpab/astro-haze/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/kpab/astro-haze/releases/tag/v1.0.0
