// pubDate/updatedDate come from frontmatter as date-only values, coerced to
// midnight UTC (src/content.config.ts). Formatting in the build host's local
// timezone would shift the displayed date by a day west of UTC, so timeZone
// is pinned to UTC here rather than left to the environment default.
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
