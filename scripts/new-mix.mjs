// Scaffold a new mix file: `npm run mix:new -- <ID> "Display Name"`
// Plain Node ESM so it runs with no extra dev deps. The mix file it writes is
// auto-registered by content/catalog.ts's glob — no index to edit.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const [, , id, ...nameParts] = process.argv;

if (!id) {
  console.error('Usage: npm run mix:new -- <ID> "Display Name"');
  console.error('Example: npm run mix:new -- PLNT006 "Velvet Drift"');
  process.exit(1);
}

const name = (nameParts.join(' ') || id).replace(/'/g, "\\'");
const dir = resolve(here, '../src/content/mixes');
mkdirSync(dir, { recursive: true });
const file = join(dir, `${id}.mix.ts`);

if (existsSync(file)) {
  console.error(`Refusing to overwrite existing file: ${file}`);
  process.exit(1);
}

const template = `import { defineMix, tracks } from '../defineMix';

export default defineMix({
  id: '${id}',
  name: '${name}',
  tags: [],
  url: 'https://dhaudio.blob.core.windows.net/dh-audio-store/${id}.mp3',
  mixer: '',
  desc: \`
    Write the mix description here — multiline, no escaping needed.
  \`,
  tracklist: tracks\`
    00:00  Artist — Title
  \`,
});
`;

writeFileSync(file, template);
console.log(`Created ${file}`);
console.log('It is already registered (auto-glob). Fill in tags, url, mixer, desc, and the tracklist.');
