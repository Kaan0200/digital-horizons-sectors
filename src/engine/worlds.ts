/**
 * The presentation layer between catalog data and the star chart.
 *
 * A `World` augments a `MixData` with everything the chart needs to DRAW it:
 * a fixed scattered position, a spectral colour, and an almanac catalogue
 * record. Derived values are seeded from the mix id (stable across reloads,
 * nothing stored) but any of them can be PINNED in the mix file via the
 * optional overrides on MixData.
 *
 * These are pure functions — the loaded catalog flows in from RootStore, which
 * calls `buildWorlds()` once the async `loadCatalog()` resolves.
 */
import { MixData, Track } from '../data/defineMix';
import { mulberry32, seedFromId } from './seed';

export type { Track };

export interface World {
  id: string;
  name: string;
  genre: string;
  desc: string;
  url: string;
  color: string;
  x: number;
  y: number;
  cat: string;
  mag: string;
  tracks: Track[];
}

// dulled-but-vibrant spectral palette; each world takes one (unless pinned).
const SPECTRA = ['#5fc9c1', '#ecb56a', '#e58aa6', '#9d8cf2', '#8fdca0', '#7fd0e6', '#e8956c', '#c79bf0'];

function genreOf(mix: MixData): string {
  return mix.tags.length ? mix.tags.join(' / ') : 'Mix';
}

function buildWorld(mix: MixData, i: number): World {
  const rnd = mulberry32(seedFromId(mix.id));
  // golden-angle scatter keeps worlds evenly spread; jitter from the seed.
  const ang = i * 2.39996 + rnd() * 0.6;
  const radius = i === 0 ? 0 : 320 + i * 250 + (rnd() - 0.5) * 200;
  const catNum = String(100 + Math.floor(rnd() * 900));
  const mag = (1 + rnd() * 3).toFixed(1);

  return {
    id: mix.id,
    name: mix.name,
    genre: genreOf(mix),
    desc: mix.desc.trim(),
    url: mix.url,
    color: mix.color ?? SPECTRA[i % SPECTRA.length],
    x: mix.x ?? Math.round(Math.cos(ang) * radius),
    y: mix.y ?? Math.round(Math.sin(ang) * radius),
    cat: mix.cat ?? 'DH·' + catNum,
    mag,
    tracks: mix.tracklist,
  };
}

/** Build the chart worlds from the loaded catalog. */
export function buildWorlds(mixes: MixData[]): World[] {
  return mixes.map(buildWorld);
}

/** Nearest-neighbour constellation edges (each world linked to its 2 closest). */
export function buildConstellation(worlds: World[]): Array<[number, number]> {
  const edges: Array<[number, number]> = [];
  const seen = new Set<string>();
  worlds.forEach((a, i) => {
    const near = worlds
      .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
      .filter((o) => o.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2);
    for (const { j } of near) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([i, j]);
      }
    }
  });
  return edges;
}
