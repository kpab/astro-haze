# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0](https://github.com/kpab/astro-haze/compare/v1.2.1...v1.3.0) (2026-08-16)

### Features

- **content:** strengthen schema validation and add per-image gallery alt ([#63](https://github.com/kpab/astro-haze/issues/63)) ([fbe2c90](https://github.com/kpab/astro-haze/commit/fbe2c90b4e7655d4906f69f02f96d0a45f70eccf))
- **landing:** reveal home and landing sections on scroll ([e561c00](https://github.com/kpab/astro-haze/commit/e561c0043da5529a8e58663bb0dd2b6f82efd776))
- **nav:** morph card images into the page they open ([bc3820e](https://github.com/kpab/astro-haze/commit/bc3820e4f9faec78f361368e1742698fa3a65815))
- **nav:** navigate client-side with ClientRouter ([d86b1e8](https://github.com/kpab/astro-haze/commit/d86b1e8ea94cb96d260e87513bdaeb6266c2e3b3))
- **rss:** deliver the full post body in the feed ([9c96d76](https://github.com/kpab/astro-haze/commit/9c96d7670067e1bcbf3104f0851c5f68d1834f5a))
- **seo:** generate a social card for every post and case study ([37179e1](https://github.com/kpab/astro-haze/commit/37179e11f1c4a9cf1c8ec183c4d806951455d3a1))
- **sitemap:** give blog entries a lastmod ([bc64d63](https://github.com/kpab/astro-haze/commit/bc64d63dace7ad3774bd169b41be3ec68de4ab3a))
- **styles:** add a scroll-driven reveal utility ([aa93ed7](https://github.com/kpab/astro-haze/commit/aa93ed71d85f1aba3b14f869b84a40b362d2e130))
- **styles:** make the two largest spacing steps fluid ([45934a7](https://github.com/kpab/astro-haze/commit/45934a769acdadb54d64f9da3e349be853609f3e))
- **styles:** size card grids by their container, not the viewport ([383d356](https://github.com/kpab/astro-haze/commit/383d35601c719a757fec3b972b6d2cfc37d88109))

### Bug Fixes

- **a11y:** detect external case-study links instead of assuming internal ([cb0fd66](https://github.com/kpab/astro-haze/commit/cb0fd662aed8b5dddaaf0da23595f9cd356c55bf))
- **a11y:** honor reduced transparency on every glass surface ([2d14d07](https://github.com/kpab/astro-haze/commit/2d14d07256600759db5c098c6d8b61964f341694))
- **deps:** resolve the nanoid advisory in the lockfile ([512b6ad](https://github.com/kpab/astro-haze/commit/512b6ad3fda25f26a3dc9f6dfdd244c6f9832bbe))
- **markdown:** apply the base path to root-relative body links ([f90a0c1](https://github.com/kpab/astro-haze/commit/f90a0c167236dded8a05306d50bf6d6b0eb5c77a))
- **portfolio:** reveal project cards on scroll instead of on load ([1a70bae](https://github.com/kpab/astro-haze/commit/1a70baef44b45835262bf548795f7c4281e979e8))
- **rss:** register the MDX renderer on the feed's container ([9a9dbe4](https://github.com/kpab/astro-haze/commit/9a9dbe4028c4d7d5f4319963ecf279bedab0a275))
- **styles:** put the standard backdrop-filter last so it survives the build ([a3e4326](https://github.com/kpab/astro-haze/commit/a3e4326e8653cc319f554e50fda225abe91ff84e))

### Changed

- **landing:** `features[].image` and `testimonials[].avatar` are gone from the schema. Neither was ever rendered — feature cards are identified by a number and the `icon` glyph, testimonials by the speaker's initials — so an author could set either field, see it validated, and get nothing on the page. Existing content is unaffected: unknown keys are dropped, so a landing file that still carries them builds exactly as before ([#64](https://github.com/kpab/astro-haze/issues/64))

## [1.2.0] - 2026-07-26

### Added

- `site.config` now exposes `lang` / `ogLocale`, so `<html lang>` and `og:locale` can be configured per site instead of being hardcoded ([#34](https://github.com/kpab/astro-haze/issues/34))
- Work detail pages now emit `CreativeWork` JSON-LD structured data and `og:type=article` ([#40](https://github.com/kpab/astro-haze/issues/40))
- The search modal now opens/closes with a fade + scale transition, disabled under `prefers-reduced-motion` ([#30](https://github.com/kpab/astro-haze/issues/30))
- CI now runs `astro check` and `astro build` on every pull request, plus an ESLint/Prettier lint gate ([#41](https://github.com/kpab/astro-haze/issues/41), [#42](https://github.com/kpab/astro-haze/issues/42))

### Fixed

- Hover states (cards, links, buttons) no longer stick after a tap on touch devices ([#26](https://github.com/kpab/astro-haze/issues/26))
- Interactive elements below the 44px touch-target minimum — the menu toggle, buttons, pagination and filters — are now sized to meet it ([#27](https://github.com/kpab/astro-haze/issues/27))
- Full-height sections now fall back correctly on iOS Safari, where `100vh` doesn't account for the collapsing toolbar ([#28](https://github.com/kpab/astro-haze/issues/28))
- The mobile nav now locks background scroll while open (without clobbering the search modal's own scroll lock), has a fallback for browsers without `backdrop-filter`, and derives its offset from a shared header-height variable ([#29](https://github.com/kpab/astro-haze/issues/29))
- Search result counts are now announced to screen readers ([#31](https://github.com/kpab/astro-haze/issues/31))
- `ThemeToggle` now announces the current theme state to screen readers ([#35](https://github.com/kpab/astro-haze/issues/35))
- Gradient brand text now falls back to a solid color where `background-clip: text` isn't supported, and the skip link now meets contrast requirements in both themes ([#36](https://github.com/kpab/astro-haze/issues/36))
- External links now announce "opens in new tab" and are auto-detected from `href` instead of requiring manual tagging, including when a caller also passes a custom `aria-label` ([#37](https://github.com/kpab/astro-haze/issues/37))
- The work/project filter now shows an empty state (instead of a blank grid) when no items match, and animates items in on filter change ([#38](https://github.com/kpab/astro-haze/issues/38))
- Internal links and canonical URLs are now consistently trailing-slashed, matching the site's `trailingSlash: 'always'` config ([#39](https://github.com/kpab/astro-haze/issues/39))

### Changed

- `transition: all` has been replaced with explicit property lists across components, and buttons now have a dedicated `:active` press feedback state ([#32](https://github.com/kpab/astro-haze/issues/32))
- Media query breakpoints have been consolidated from 13 ad-hoc values down to a standard set (640/768/900/1024px) ([#33](https://github.com/kpab/astro-haze/issues/33))

## [1.1.1] - 2026-07-26

### Fixed

- Site name no longer doubles up in page `<title>` / `og:title` when a page passes its own title ([#17](https://github.com/kpab/astro-haze/issues/17))
- Footer no longer links to `/privacy` / `/terms`, which the theme doesn't ship ([#18](https://github.com/kpab/astro-haze/issues/18))
- Footer nav now respects `features.*` flags, so a disabled section (e.g. `blog`) no longer leaves a dead link there ([#19](https://github.com/kpab/astro-haze/issues/19))
- RSS `<channel>` link now includes the configured `base`, instead of pointing at the origin root ([#20](https://github.com/kpab/astro-haze/issues/20))
- Blog post dates now render in UTC, so the displayed date no longer shifts with the build host's timezone ([#21](https://github.com/kpab/astro-haze/issues/21))
- `prose` tables now scroll horizontally on narrow viewports instead of overflowing, and long words wrap instead of being clipped ([#22](https://github.com/kpab/astro-haze/issues/22))
- Root-relative image paths (string form) and `links.case` on project pages now go through `withBase`, fixing potential 404s under a subpath deploy ([#23](https://github.com/kpab/astro-haze/issues/23))
- Featured posts no longer appear a second time in the blog list's "Latest Posts" grid — including when a featured post falls on a later pagination page ([#24](https://github.com/kpab/astro-haze/issues/24))
- Documented that `public/robots.txt` and `public/_headers` are not served/applied on GitHub Pages ([#25](https://github.com/kpab/astro-haze/issues/25))

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

[1.2.0]: https://github.com/kpab/astro-haze/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/kpab/astro-haze/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/kpab/astro-haze/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/kpab/astro-haze/releases/tag/v1.0.0
