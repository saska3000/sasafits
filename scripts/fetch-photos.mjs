// Ищет фото блюд со свободной лицензией (Openverse: Flickr, Wikimedia и др.) и скачивает кандидатов.
// Запуск: node scripts/fetch-photos.mjs <рабочая-папка> [id блюда …]
// В рабочей папке появятся <id>/<n>.jpg и candidates.json со сведениями об авторах.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const WORK = process.argv[2];
if (!WORK) throw new Error('Укажите рабочую папку');
const only = new Set(process.argv.slice(3));
mkdirSync(WORK, { recursive: true });

// Поисковые запросы: сначала основной, потом запасные
export const QUERIES = {
  lepeshka: ['tortilla roll up', 'breakfast wrap', 'wrap sandwich tomato'],
  pancakes: ['banana pancakes berries', 'pancakes berries yogurt'],
  okonomiyaki: ['okonomiyaki'],
  syrniki: ['syrniki', 'cottage cheese pancakes'],
  tortilla_hack: ['egg quesadilla', 'breakfast quesadilla'],
  shakshuka: ['shakshuka'],
  french_toast: ['french toast berries'],
  mousse: ['raspberry parfait', 'berry yogurt parfait', 'raspberry mousse glass'],
  pear_yogurt: ['pear slices', 'yogurt fruit bowl', 'pear yogurt'],
  cucumber_salad: ['sliced cucumber salad', 'korean cucumber salad', 'cucumber salad bowl'],
  smoothie: ['berry smoothie'],
  protein_salad: ['chicken cabbage salad', 'coleslaw chicken'],
  icecream: ['strawberry frozen yogurt', 'strawberry ice cream'],
  tuna_beans: ['tuna green bean salad', 'tuna salad'],
  kefir_banana: ['kefir glass', 'banana milk glass'],
  eggs_cucumber: ['hard boiled eggs', 'halved boiled eggs'],
  chicken_soup: ['chicken noodle soup'],
  shawarma: ['chicken shawarma wrap', 'shawarma'],
  tomato_soup: ['cream of tomato soup', 'tomato bisque'],
  shashlik: ['chicken skewers zucchini', 'chicken kebab skewers'],
  meatballs: ['swedish meatballs mashed potatoes', 'swedish meatballs'],
  curry: ['chicken curry rice'],
  burrito_bowl: ['burrito bowl'],
  sushi_bake: ['tuna poke bowl', 'poke bowl'],
  smash_taco: ['smash burger tacos', 'beef tacos cheese'],
  fajitas: ['chicken fajitas'],
};

const UA = { 'User-Agent': 'SasaFits/0.1 (personal app)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url) {
  for (let i = 0; i < 5; i++) {
    const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(40000) });
    if (res.status === 429) {
      await sleep(15000 * (i + 1));
      continue;
    }
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return res.json();
  }
  throw new Error('слишком много запросов');
}

/** Картинка поменьше: у Википедии есть готовые уменьшенные копии */
function smaller(url) {
  const m = /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/(\w)\/(\w\w)\/([^/]+)$/.exec(url);
  if (m) return `https://upload.wikimedia.org/wikipedia/commons/thumb/${m[1]}/${m[2]}/${m[3]}/1024px-${m[3]}`;
  return url;
}

const candFile = join(WORK, 'candidates.json');
const all = existsSync(candFile) ? JSON.parse(readFileSync(candFile, 'utf8')) : {};

for (const [id, queries] of Object.entries(QUERIES)) {
  if (only.size && !only.has(id)) continue;
  if (all[id]?.length && !only.size) continue;
  const found = [];
  const seen = new Set();
  for (const q of queries) {
    const params = new URLSearchParams({ q, license_type: 'commercial,modification', page_size: '12', mature: 'false' });
    const data = await getJson(`https://api.openverse.org/v1/images/?${params}`);
    for (const r of data.results ?? []) {
      if (seen.has(r.id) || !/\.(jpe?g)(\?|$)/i.test(r.url)) continue;
      seen.add(r.id);
      found.push({
        title: r.title,
        creator: r.creator,
        creator_url: r.creator_url,
        license: r.license,
        license_version: r.license_version,
        license_url: r.license_url,
        landing: r.foreign_landing_url,
        source: r.source,
        url: r.url,
      });
    }
    await sleep(2500);
    if (found.length >= 6) break;
  }
  const dir = join(WORK, id);
  mkdirSync(dir, { recursive: true });
  const kept = [];
  for (const c of found.slice(0, 8)) {
    if (kept.length >= 6) break;
    try {
      const res = await fetch(smaller(c.url), { headers: UA, signal: AbortSignal.timeout(60000) });
      const type = res.headers.get('content-type') ?? '';
      if (!res.ok || !type.startsWith('image/')) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 15000 || buf.length > 8_000_000) continue;
      const n = kept.length + 1;
      writeFileSync(join(dir, `${n}.jpg`), buf);
      kept.push({ ...c, n });
    } catch {
      /* пропускаем */
    }
  }
  all[id] = kept;
  writeFileSync(candFile, JSON.stringify(all, null, 2));
  console.log(id, kept.length);
}
console.log('всё');
