import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import siteConfig from '@/site.config';

// Fonts are read from disk rather than imported: satori needs the raw bytes,
// and a `?url` import would hand back a URL for the browser instead. The path
// is resolved from the project root, which is where `astro build` runs.
const FONT_DIR = join(process.cwd(), 'src/assets/fonts');
const fonts = [
  { name: 'Inter', weight: 400 as const, data: read('Inter-Regular.ttf') },
  { name: 'Inter', weight: 700 as const, data: read('Inter-Bold.ttf') },
];

function read(file: string): Buffer {
  return readFileSync(join(FONT_DIR, file));
}

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// Long enough to fill the card, short enough that three lines always fit.
// satori has no ellipsis, so the cut is made here rather than in layout.
const TITLE_LIMIT = 90;

function clamp(text: string, limit: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= limit) return trimmed;
  // Prefer cutting at a word boundary so the ellipsis doesn't split a word.
  const cut = trimmed.slice(0, limit);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/** satori takes a React-like tree; these build one without needing JSX. */
type Node = { type: string; props: Record<string, unknown> };
const box = (style: Record<string, unknown>, children?: unknown): Node => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children },
});
const text = (style: Record<string, unknown>, children: string): Node => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children },
});

/**
 * Render a 1200×630 social card as PNG.
 *
 * The palette echoes the theme's glassmorphism — a dark ground, an accent
 * bloom, and a translucent panel — without sharing code with it: the site's
 * CSS custom properties mean nothing to satori, which only understands the
 * flexbox subset and literal colours it is handed.
 */
export async function renderOgImage(options: {
  title: string;
  eyebrow: string;
}): Promise<Uint8Array<ArrayBuffer>> {
  const title = clamp(options.title, TITLE_LIMIT);

  const svg = await satori(
    box(
      {
        width: OG_WIDTH,
        height: OG_HEIGHT,
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        backgroundColor: '#0b0f19',
        backgroundImage:
          'radial-gradient(at 18% 12%, #7c3aed 0px, transparent 55%), radial-gradient(at 88% 82%, #2563eb 0px, transparent 50%)',
        fontFamily: 'Inter',
        color: '#f8fafc',
      },
      [
        text(
          {
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#c4b5fd',
          },
          options.eyebrow,
        ),
        text(
          {
            // A long title drops a size so it still reads as a headline rather
            // than as a wall; maxHeight is the hard stop that keeps even a
            // pathological one from pushing the rows above and below it off
            // the card.
            fontSize: title.length > 55 ? 54 : 68,
            maxHeight: 372,
            fontWeight: 700,
            lineHeight: 1.15,
            // satori wraps between words only, so a title carrying one long
            // unbroken token — a package name, a URL — would otherwise run
            // straight off the right edge of the card.
            wordBreak: 'break-word',
            overflow: 'hidden',
            // The panel is what makes the card read as this theme rather than
            // as plain text on a gradient.
            padding: '36px 40px',
            borderRadius: 28,
            border: '1px solid rgba(255,255,255,0.18)',
            backgroundColor: 'rgba(255,255,255,0.08)',
          },
          title,
        ),
        text(
          { fontSize: 30, fontWeight: 400, color: '#cbd5f5' },
          siteConfig.name,
        ),
      ],
    ) as never,
    { width: OG_WIDTH, height: OG_HEIGHT, fonts },
  );

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } })
    .render()
    .asPng();

  // Copied into a freshly allocated array rather than returned as-is: resvg
  // hands back a Buffer over an ArrayBufferLike, which a Response body will
  // not accept, and allocating here pins it to a plain ArrayBuffer.
  const body = new Uint8Array(png.byteLength);
  body.set(png);
  return body;
}
