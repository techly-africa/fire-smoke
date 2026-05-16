export interface Tier {
  id: string;
  name: string;
  price: number;
  sub: string;
  stock: number | 'TBC';
  badge: string | null;
}

export interface WhatsNew {
  icon: string;
  title: string;
  sub: string;
  detail: string;
  photos: string[];
}

export interface Game {
  name: string;
  tag: string;
}

export interface Prize {
  name: string;
  desc: string;
}

export interface PrizeReward {
  name: string;
  icon: string;
}

export interface ScheduleRow {
  t: string;
  label: string;
  sub: string;
}

export interface GalleryItem {
  src: string;
  caption: string;
}

export interface Testimonial {
  name: string;
  handle: string;
  quote: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Host {
  name: string;
  role: string;
  tag: string;
}

export interface Sponsor {
  name: string;
  kind: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  fact: string;
}

export const EVENT = {
  name: 'Fire & Smoke',
  edition: 'BBQ Games Edition',
  tagline: 'New month. New flame. New vibe.',
  dateISO: '2026-05-30T13:00:00+02:00',
  dateLabel: 'Sat 30 May 2026',
  timeLabel: '1:00 PM — till dusk',
  location: 'Next to Fazenda Zenga',
  city: 'Kigali, Rwanda',
  mapsUrl: 'https://maps.google.com/?q=Fazenda+Zenga+Kigali',
  payTo: '0785608546',
  payName: 'Collins Muoki',
  ig: '@fireandsmoke.kgl',
  whatsapp: '+250 785 608 546',
} as const;

export const TIERS: Tier[] = [
  { id: 'early',   name: 'Early Bird',  price: 15000, sub: 'Pay before May 22',      stock: 14,    badge: 'BEST DEAL' },
  { id: 'regular', name: 'Regular',      price: 20000, sub: 'Standard entry',         stock: 38,    badge: null },
  { id: 'duo',     name: 'Duo',          price: 35000, sub: 'For 2 — bring a friend', stock: 11,    badge: 'SAVE 5K' },
  { id: 'gate',    name: 'Late / Gate',  price: 25000, sub: 'Only if space remains',  stock: 'TBC', badge: null },
];

export const WHATS_NEW: WhatsNew[] = [
  {
    icon: 'meat',
    title: 'Different protein types',
    sub: 'Pork ribs, lamb chops, chicken, beef, fish — all on the fire.',
    detail: 'This edition we\'re going all out on the grill. Expect slow-smoked pork ribs with a honey-chilli glaze, lamb chops marinated overnight in rosemary and akabanga, whole chicken butterflied on the barrel, and a fresh-catch fish station. Every protein gets its own sauce pairing — no overlap, no compromise.',
    photos: ['/photos/p01-grill-portrait.jpeg', '/photos/p02-grill-closeup.jpeg', '/photos/p10-basting.jpeg', '/photos/p11-chef-bandana.jpeg'],
  },
  {
    icon: 'music',
    title: 'Daytime music',
    sub: 'Live afrobeat + amapiano DJ set under the pines.',
    detail: 'Bruno K. is back on the decks with a 6-hour daytime set that moves from chill afrobeats at gates-open through peak amapiano when the sauce battle hits. No hard drops, no strobes — just the right groove for forest air, smoke rising, and everyone loosening up after noon.',
    photos: ['/photos/p07-crowd.jpeg', '/photos/p05-wide-forest.jpeg', '/photos/p09-picnic.jpeg', '/photos/p14-sitting.jpeg'],
  },
  {
    icon: 'games',
    title: 'Games corner',
    sub: 'Jenga tower, UNO marathon, cup-pong, charades.',
    detail: 'The games corner is back, bigger and more chaotic. We\'re running Jenga on a 1.2m tower (yes, it will fall), a full UNO bracket with elimination rounds, cup-pong on two tables, and a loud charades station that\'ll keep the energy up between grill turns. Bring a game too — if it\'s good, it joins the rotation.',
    photos: ['/photos/p04-three-friends.jpeg', '/photos/p03-grill-smile.jpeg', '/photos/p12-kamado.jpeg', '/photos/p07-crowd.jpeg'],
  },
  {
    icon: 'sauce',
    title: 'Sauce battle',
    sub: 'Blind taste 6 house sauces. Loser pays the next round.',
    detail: 'Six mystery sauces, blind tasting, one winner per table. Ines has spent three weeks on the lineup — some are regional classics with a twist, some are pure pain. You won\'t know which is which until you\'ve already committed. The table with the highest group accuracy wins a round of drinks. The table that quits early... pays for it.',
    photos: ['/photos/p11-chef-bandana.jpeg', '/photos/p06-barrel-grill.jpeg', '/photos/p02-grill-closeup.jpeg', '/photos/p10-basting.jpeg'],
  },
  {
    icon: 'camera',
    title: 'Forest photo moments',
    sub: 'A roaming shooter + a polaroid wall to take home.',
    detail: 'This edition we have a dedicated roaming photographer capturing the fire, the games, the food and the faces. Every photo lands in an album shared with guests by end of day. We\'re also running a polaroid wall — get your instant print and pin it to the board, or take it home. The wall stays up until the last guest leaves.',
    photos: ['/photos/p05-wide-forest.jpeg', '/photos/p08-rainy-group.jpeg', '/photos/p14-sitting.jpeg', '/photos/p13-peace.jpeg', '/photos/p03-grill-smile.jpeg'],
  },
];

export const GAMES: Game[] = [
  { name: 'Jenga Tower',       tag: 'classic' },
  { name: 'UNO Marathon',      tag: 'cards' },
  { name: 'Charades',          tag: 'loud' },
  { name: 'Cup Pong',          tag: 'wet' },
  { name: 'Card Games',        tag: 'chill' },
  { name: 'Sauce Blind Taste', tag: 'spicy' },
  { name: 'BBQ Quiz',          tag: 'nerdy' },
  { name: 'Guess The Song',    tag: 'audio' },
  { name: 'Whose Most Likely', tag: 'risky' },
];

export const PRIZES: Prize[] = [
  { name: 'Best Dressed',       desc: 'Forest-fit of the day. Crowd votes by clap.' },
  { name: 'Best Dancer',        desc: 'When the speaker peaks. No mercy.' },
  { name: 'Friend of the Fire', desc: 'The one who never let the coals die.' },
];

export const PRIZE_REWARDS: PrizeReward[] = [
  { name: 'Free Drink',          icon: 'cup' },
  { name: 'Next Event Discount', icon: 'ticket' },
  { name: 'Branded Shoutout',    icon: 'mega' },
];

export const SCHEDULE: ScheduleRow[] = [
  { t: '13:00', label: 'Gates open',         sub: 'Coals start glowing. Music low.' },
  { t: '14:00', label: 'First fire',          sub: 'Proteins hit the grill. Snacks served.' },
  { t: '15:30', label: 'Games corner opens',  sub: 'Jenga, UNO, cup-pong stations.' },
  { t: '16:30', label: 'Sauce battle',        sub: 'Blind tasting + heat rankings.' },
  { t: '17:30', label: 'Dance hour',          sub: 'DJ peaks. Best Dancer votes.' },
  { t: '18:30', label: 'Awards + photo wall', sub: 'Prizes. Polaroids. Hugs.' },
  { t: '19:30', label: 'Wind down',           sub: 'Coffee, slow songs, leftovers.' },
];

export const GALLERY: GalleryItem[] = [
  { src: '/photos/p01-grill-portrait.jpeg', caption: 'Marinade run' },
  { src: '/photos/p02-grill-closeup.jpeg',  caption: 'Low and slow' },
  { src: '/photos/p11-chef-bandana.jpeg',   caption: 'Sauce on sauce' },
  { src: '/photos/p04-three-friends.jpeg',  caption: 'Posse' },
  { src: '/photos/p07-crowd.jpeg',          caption: 'The crew' },
  { src: '/photos/p09-picnic.jpeg',         caption: 'Hilltop picnic' },
  { src: '/photos/p10-basting.jpeg',        caption: 'Basting hour' },
  { src: '/photos/p12-kamado.jpeg',         caption: 'Kamado smile' },
  { src: '/photos/p06-barrel-grill.jpeg',   caption: 'The barrel' },
  { src: '/photos/p13-peace.jpeg',          caption: 'Peace + lemonade' },
];

export const TESTIMONIALS: Testimonial[] = [
  { name: 'Aline K.',   handle: '@alinek',    quote: "I came for the meat, stayed for the UNO war. My team lost. I cried. 10/10." },
  { name: 'Eric M.',    handle: '@eric.mu',   quote: "The forest, the smoke, the laughs — felt like a real reset. Already booked the next one." },
  { name: 'Chantal U.', handle: '@chantal_u', quote: "Sauce #4 changed my life. I need the recipe. Collins WON'T share it." },
  { name: 'Diego R.',   handle: '@diego.r',   quote: "First time, knew nobody. Left with 11 new numbers and a polaroid on my fridge." },
];

export const FAQ: FaqItem[] = [
  { q: 'What should I bring?',  a: "Yourself, a friend, comfy shoes, a light jacket (forest gets cool around 6 PM), and good energy. Optional: a board game if you have a favourite." },
  { q: 'Is food included?',     a: "Yes — all proteins, sides, sauces and water are covered by your ticket. Drinks (beer/wine/spirits) are extra and sold on-site." },
  { q: 'Any vegetarian option?',a: "Grilled veg skewers, halloumi, corn, baked sweet potato + a vegan sauce flight. Mention it on the RSVP form and we'll keep a plate." },
  { q: 'Can I bring kids?',     a: "This is an adult vibe (18+ for ticketing) but well-behaved kids 8+ with a parent are welcome at no extra cost. Tell us in advance." },
  { q: 'What if it rains?',     a: "We don't cancel. We have tarps, the trees catch most of it, and rain photos slap. If it gets biblical we move to the covered shelter near the gate." },
  { q: 'Refunds?',              a: "Full refund up to 5 days before. After that, transfer your spot to a friend — just send us their name on WhatsApp." },
  { q: 'How do I get there?',   a: "Pin in the location section. Parking is free on the forest road. Moto-friendly. Carpool group on WhatsApp after you RSVP." },
];

export const HOSTS: Host[] = [
  { name: 'Collins Muoki', role: 'Pit master + organizer', tag: 'The fire never dies' },
  { name: 'Ines U.',       role: 'Sauce lab + vibes',      tag: 'Heat curator' },
  { name: 'Bruno K.',      role: 'DJ + games captain',     tag: 'Daytime selector' },
];

export const SPONSORS: Sponsor[] = [
  { name: 'Forest BBQ Co.',       kind: 'Equipment' },
  { name: 'Kigali Hot Sauce',     kind: 'Sauces' },
  { name: 'Pinewood Forest Camp', kind: 'Venue' },
  { name: 'AKABANGA',             kind: 'Heat partner' },
];

export const QUIZ: QuizQuestion[] = [
  {
    q: 'Low and slow over a wood fire — what kind of cooking is that?',
    options: ['Searing', 'Smoking', 'Grilling', 'Sous vide'],
    answer: 1,
    fact: "Smoking is below 135°C for hours. That foil pile on our barrel? That's smoking.",
  },
  {
    q: 'Which sauce ingredient is the soul of Rwandan heat?',
    options: ['Tabasco peppers', 'Akabanga oil', 'Sriracha', 'Habanero jam'],
    answer: 1,
    fact: "Akabanga is a chili-infused oil. A drop is plenty. Two drops is a dare.",
  },
  {
    q: 'Best way to know meat is done without a thermometer?',
    options: ['Look', 'Smell', 'Touch / feel', 'Time it'],
    answer: 2,
    fact: "Touch the meat, compare to the firmness of your palm under your thumb. Old chef trick.",
  },
  {
    q: 'What\'s the "Maillard reaction"?',
    options: ['A sauce', 'The crust browning', 'A cooking show', 'A type of grill'],
    answer: 1,
    fact: "That deep brown crust on a steak — that's amino acids + sugars rearranging into ~600 flavor compounds.",
  },
  {
    q: 'Charcoal or wood for the best smoke flavor?',
    options: ['Charcoal only', 'Wood only', 'Both — wood on top of charcoal', 'Neither, gas'],
    answer: 2,
    fact: "Charcoal for heat stability, wood chunks on top for the smoke perfume.",
  },
];
