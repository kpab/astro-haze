import siteConfig from '@/site.config';

// Maps a nav href to the feature flag that gates it. Hrefs without an entry
// here are always shown.
const FEATURE_BY_HREF: Record<string, keyof typeof siteConfig.features> = {
  '/blog': 'blog',
  '/work': 'portfolio',
  '/landing': 'landing',
};

// Shared by Header and Footer so disabling a feature (e.g. features.blog)
// removes its nav link everywhere instead of only from the main nav.
export function getEnabledNavItems(): Array<{ name: string; href: string }> {
  return siteConfig.nav.main.filter((item) => {
    const normalizedHref =
      item.href.length > 1 ? item.href.replace(/\/$/, '') : item.href;
    const feature = FEATURE_BY_HREF[normalizedHref];
    return !feature || siteConfig.features[feature];
  });
}
