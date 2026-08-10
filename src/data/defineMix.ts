/**
 * Authoring primitives for a mix.
 *
 * A mix is hand-authored as one `*.mix.ts` file calling `defineMix({...})`.
 * `defineMix` is an identity function — it does nothing at runtime but gives
 * you full type-checking and autocomplete as you write the object.
 *
 * The two awkward fields get ergonomic helpers:
 *   - `desc`      → a backtick string (multiline, no escaping)
 *   - `tracklist` → the `tracks` tagged template, a clean two-column block
 */

export interface Track {
  /** timecode for display, e.g. "06:12" or "1:02:30" */
  t: string;
  /** "Artist — Title" */
  n: string;
  /** start offset in seconds, parsed from `t` — powers "what's playing now" */
  start: number;
}

export interface MixData {
  /** stable id; also the audio file base name by convention */
  id: string;
  name: string;
  /** genre/keyword tags; the chart shows these as the "genre" line */
  tags: string[];
  /** Azure blob URL for the audio */
  url: string;
  /** prose description (one or more paragraphs) */
  desc: string;
  /** who mixed this audio, e.g. "DJ Nova" */
  mixer?: string;
  /** ordered tracklist */
  tracklist: Track[];

  // --- optional pinned presentation overrides ---
  // Omit to let the chart derive them from the id (see almanac/worlds.ts).
  // Pin them once you want a deliberate, stable galaxy layout.
  /** spectral accent colour, e.g. "#5fc9c1" */
  color?: string;
  /** fixed chart coordinates */
  x?: number;
  y?: number;
  /** catalogue designation, e.g. "DH·417" */
  cat?: string;
}

/** Identity helper — exists purely for inline type-checking + autocomplete. */
export const defineMix = (mix: MixData): MixData => mix;

/**
 * Tagged template that turns a written block of `mm:ss  Artist — Title` lines
 * into a `Track[]`. Blank lines are ignored; lines without a leading timecode
 * are kept with an empty time so nothing is silently dropped.
 *
 *   tracklist: tracks`
 *     00:00  Sona — Low Tide
 *     06:12  Mell — Coastline (Dub)
 *   `
 */
/** Parse a "mm:ss" / "h:mm:ss" timecode into seconds. */
function toSeconds(tc: string): number {
  return tc.split(':').reduce((acc, part) => acc * 60 + Number(part), 0);
}

export function tracks(strings: TemplateStringsArray, ...vals: unknown[]): Track[] {
  const raw = strings.reduce((acc, s, i) => acc + s + (i < vals.length ? String(vals[i]) : ''), '');
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^(\d{1,2}(?::\d{2}){1,2})\s+(.*)$/);
      return m
        ? { t: m[1], n: m[2].trim(), start: toSeconds(m[1]) }
        : { t: '', n: line, start: 0 };
    });
}
