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

export const PREDICT_WIN = {
  title: 'Champions League Final',
  match: 'REAL MADRID vs MAN CITY',
  team1: 'REAL MADRID',
  team2: 'MAN CITY',
  date: 'MAY 30, 2026',
  time: '21:00 CAT',
  prize: 'A Round of Drinks + 50% Off Your Next Ticket',
  description: 'Predict the final score of the biggest game in football. Every correct prediction enters a raffle for our grand prize of the night.',
  active: true,
  final_score_team1: 0,
  final_score_team2: 0,
  image: 'https://res.cloudinary.com/de2wwxpdo/image/upload/v1778930215/fire-smoke/gallery/fire-smoke/gallery/p05-wide-forest.jpg'
};
