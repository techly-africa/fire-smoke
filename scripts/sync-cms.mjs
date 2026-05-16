import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env');
const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => {
      const [k, ...v] = l.split('=');
      return [k.trim(), v.join('=').trim()];
    })
);

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const WHATS_NEW = [
  {
    icon: 'meat',
    title: 'Different protein types',
    sub: 'Pork ribs, lamb chops, chicken, beef, fish — all on the fire.',
    detail: 'This edition we\'re going all out on the grill. Expect slow-smoked pork ribs with a honey-chilli glaze, lamb chops marinated overnight in rosemary and akabanga, whole chicken butterflied on the barrel, and a fresh-catch fish station. Every protein gets its own sauce pairing — no overlap, no compromise.',
    photos: [
      'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930187/fire-smoke/gallery/fire-smoke/gallery/p01-grill-portrait.jpg',
      'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930195/fire-smoke/gallery/fire-smoke/gallery/p02-grill-closeup.jpg',
      'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930233/fire-smoke/gallery/fire-smoke/gallery/p10-basting.jpg',
      'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930237/fire-smoke/gallery/fire-smoke/gallery/p11-chef-bandana.jpg',
    ],
  },
  {
    icon: 'music',
    title: 'Daytime music',
    sub: 'Live afrobeat + amapiano DJ set under the pines.',
    detail: 'Bruno K. is back on the decks with a 6-hour daytime set that moves from chill afrobeats at gates-open through peak amapiano when the sauce battle hits. No hard drops, no strobes — just the right groove for forest air, smoke rising, and everyone loosening up after noon.',
    photos: [
      'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930224/fire-smoke/gallery/fire-smoke/gallery/p07-crowd.jpg',
      'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930215/fire-smoke/gallery/fire-smoke/gallery/p05-wide-forest.jpg',
      'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930231/fire-smoke/gallery/fire-smoke/gallery/p09-picnic.jpg',
      'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930253/fire-smoke/gallery/fire-smoke/gallery/p14-sitting.jpg',
    ],
  },
  {
    icon: 'games',
    title: 'Games corner',
    sub: 'Jenga tower, UNO marathon, cup-pong, charades.',
    detail: 'The games corner is back, bigger and more chaotic. We\'re running Jenga on a 1.2m tower (yes, it will fall), a full UNO bracket with elimination rounds, cup-pong on two tables, and a loud charades station that\'ll keep the energy up between grill turns. Bring a game too — if it\'s good, it joins the rotation.',
    photos: [
      'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930210/fire-smoke/gallery/fire-smoke/gallery/p04-three-friends.jpg',
      'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930207/fire-smoke/gallery/fire-smoke/gallery/p03-grill-smile.jpg',
      'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930240/fire-smoke/gallery/fire-smoke/gallery/p12-kamado.jpg',
      'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930224/fire-smoke/gallery/fire-smoke/gallery/p07-crowd.jpg',
    ],
  },
  {
    icon: 'sauce',
    title: 'Sauce battle',
    sub: 'Blind taste 6 house sauces. Loser pays the next round.',
    detail: 'Six mystery sauces, blind tasting, one winner per table. Ines has spent three weeks on the lineup — some are regional classics with a twist, some are pure pain. You won\'t know which is which until you\'ve already committed. The table with the highest group accuracy wins a round of drinks. The table that quits early... pays for it.',
    photos: [
      'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930237/fire-smoke/gallery/fire-smoke/gallery/p11-chef-bandana.jpg',
      'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930219/fire-smoke/gallery/fire-smoke/gallery/p06-barrel-grill.jpg',
      'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930195/fire-smoke/gallery/fire-smoke/gallery/p02-grill-closeup.jpg',
      'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930233/fire-smoke/gallery/fire-smoke/gallery/p10-basting.jpg',
    ],
  },
  {
    icon: 'camera',
    title: 'Forest photo moments',
    sub: 'A roaming shooter + a polaroid wall to take home.',
    detail: 'This edition we have a dedicated roaming photographer capturing the fire, the games, the food and the faces. Every photo lands in an album shared with guests by end of day. We\'re also running a polaroid wall — get your instant print and pin it to the board, or take it home. The wall stays up until the last guest leaves.',
    photos: [
      'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930215/fire-smoke/gallery/fire-smoke/gallery/p05-wide-forest.jpg',
      'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930227/fire-smoke/gallery/fire-smoke/gallery/p08-rainy-group.jpg',
      'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930253/fire-smoke/gallery/fire-smoke/gallery/p14-sitting.jpg',
      'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930244/fire-smoke/gallery/fire-smoke/gallery/p13-peace.jpg',
      'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930207/fire-smoke/gallery/fire-smoke/gallery/p03-grill-smile.jpg',
    ],
  },
];

const GALLERY = [
  { src: 'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930187/fire-smoke/gallery/fire-smoke/gallery/p01-grill-portrait.jpg', caption: 'Marinade run' },
  { src: 'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930195/fire-smoke/gallery/fire-smoke/gallery/p02-grill-closeup.jpg',  caption: 'Low and slow' },
  { src: 'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930237/fire-smoke/gallery/fire-smoke/gallery/p11-chef-bandana.jpg',   caption: 'Sauce on sauce' },
  { src: 'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930210/fire-smoke/gallery/fire-smoke/gallery/p04-three-friends.jpg',  caption: 'Posse' },
  { src: 'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930224/fire-smoke/gallery/fire-smoke/gallery/p07-crowd.jpg',          caption: 'The crew' },
  { src: 'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930231/fire-smoke/gallery/fire-smoke/gallery/p09-picnic.jpg',         caption: 'Hilltop picnic' },
  { src: 'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930233/fire-smoke/gallery/fire-smoke/gallery/p10-basting.jpg',        caption: 'Basting hour' },
  { src: 'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930240/fire-smoke/gallery/fire-smoke/gallery/p12-kamado.jpg',         caption: 'Kamado smile' },
  { src: 'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930219/fire-smoke/gallery/fire-smoke/gallery/p06-barrel-grill.jpg',   caption: 'The barrel' },
  { src: 'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930244/fire-smoke/gallery/fire-smoke/gallery/p13-peace.jpg',          caption: 'Peace + lemonade' },
];

async function sync() {
  console.log('🔄 Forced Sync of WHATS_NEW and GALLERY structure...');
  
  await supabase.from('cms').upsert({ key: 'WHATS_NEW', content: WHATS_NEW }, { onConflict: 'key' });
  console.log(' ✅ WHATS_NEW structure updated.');
  
  await supabase.from('cms').upsert({ key: 'GALLERY', content: GALLERY }, { onConflict: 'key' });
  console.log(' ✅ GALLERY structure updated.');

  console.log('\n✨ Done. Refresh the Dashboard.');
}

sync();
