/**
 * The catalog access boundary. EVERYTHING reads the catalog through
 * `loadCatalog()` — never by importing mix files directly. That single seam is
 * what lets us swap "bundled at build time" for "fetched live from dhaudio"
 * later without touching a single component.
 *
 * Today: every `*.mix.ts` is glob-imported and bundled, so `loadCatalog()`
 * resolves on the next microtask (no network).
 *
 * Later (live publishing): replace the body with a fetch of
 * `${BLOB}/catalog.json`, validated against the same MixData shape. The audio
 * already lives in dhaudio; the manifest sits beside it. Nothing else changes.
 */
import { MixData } from './defineMix';

// Auto-registration: drop a `*.mix.ts` file in ./mixes and it's in the catalog.
// No central list to maintain.
const modules = import.meta.glob<{ default: MixData }>('../data/mixes/*.mix.ts', {
    eager: true,
});

const BUNDLED: MixData[] = Object.values(modules)
    .map((m) => m.default)
    .sort((a, b) => a.id.localeCompare(b.id));

let cache: Promise<MixData[]> | null = null;

/** Load the full catalog. Cached after the first call. */
export function loadCatalog(): Promise<MixData[]> {
    if (!cache) {
        // TODO(live-publishing): swap to
        //   cache = fetch(`${BLOB}/catalog.json`).then(r => r.json()).then(CatalogSchema.parse)
        // (requires the blob CORS rule + Cache-Control on catalog.json)
        cache = Promise.resolve(BUNDLED);
    }
    return cache;
}

/** Load a single mix by id. */
export async function loadMix(id: string): Promise<MixData | undefined> {
    return (await loadCatalog()).find((m) => m.id === id);
}
