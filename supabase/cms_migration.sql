-- Create the CMS table
CREATE TABLE IF NOT EXISTS cms (
    id BIGSERIAL PRIMARY KEY,
    section_key TEXT UNIQUE NOT NULL,
    content JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cms ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public read cms" ON cms;
    DROP POLICY IF EXISTS "Admin update cms" ON cms;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Public read cms" ON cms FOR SELECT USING (true);
CREATE POLICY "Admin update cms" ON cms FOR UPDATE USING (true);

-- Seed Initial Data from data.ts
INSERT INTO cms (section_key, content) VALUES 
('EVENT', '{
  "name": "Fire & Smoke",
  "edition": "BBQ Games Edition",
  "tagline": "New month. New flame. New vibe.",
  "dateISO": "2026-05-30T13:00:00+02:00",
  "dateLabel": "Sat 30 May 2026",
  "timeLabel": "1:00 PM — till dusk",
  "location": "Next to Fazenda Zenga",
  "city": "Kigali, Rwanda",
  "mapsUrl": "https://maps.google.com/?q=Fazenda+Zenga+Kigali",
  "payTo": "0785608546",
  "payName": "Collins Muoki",
  "ig": "@fireandsmoke.kgl",
  "whatsapp": "+250 785 608 546"
}'),
('TIERS', '[
  { "id": "early",   "name": "Early Bird",  "price": 15000, "sub": "Pay before May 22",      "stock": 14,    "badge": "BEST DEAL" },
  { "id": "regular", "name": "Regular",      "price": 20000, "sub": "Standard entry",         "stock": 38,    "badge": null },
  { "id": "duo",     "name": "Duo",          "price": 35000, "sub": "For 2 — bring a friend", "stock": 11,    "badge": "SAVE 5K" },
  { "id": "gate",    "name": "Late / Gate",  "price": 25000, "sub": "Only if space remains",  "stock": "TBC", "badge": null }
]'),
('WHATS_NEW', '[
  { "icon": "meat",   "title": "Different protein types", "sub": "Pork ribs, lamb chops, chicken, beef, fish — all on the fire." },
  { "icon": "music",  "title": "Daytime music",           "sub": "Live afrobeat + amapiano DJ set under the pines." },
  { "icon": "games",  "title": "Games corner",            "sub": "Jenga tower, UNO marathon, cup-pong, charades." },
  { "icon": "sauce",  "title": "Sauce battle",            "sub": "Blind taste 6 house sauces. Loser pays the next round." },
  { "icon": "camera", "title": "Forest photo moments",    "sub": "A roaming shooter + a polaroid wall to take home." }
]'),
('GAMES', '[
  { "name": "Jenga Tower",       "tag": "classic" },
  { "name": "UNO Marathon",      "tag": "cards" },
  { "name": "Charades",          "tag": "loud" },
  { "name": "Cup Pong",          "tag": "wet" },
  { "name": "Card Games",        "tag": "chill" },
  { "name": "Sauce Blind Taste", "tag": "spicy" },
  { "name": "BBQ Quiz",          "tag": "nerdy" },
  { "name": "Guess The Song",    "tag": "audio" },
  { "name": "Whose Most Likely", "tag": "risky" }
]'),
('PRIZES', '[
  { "name": "Best Dressed",       "desc": "Forest-fit of the day. Crowd votes by clap." },
  { "name": "Best Dancer",        "desc": "When the speaker peaks. No mercy." },
  { "name": "Friend of the Fire", "desc": "The one who never let the coals die." }
]'),
('PRIZE_REWARDS', '[
  { "name": "Free Drink",          "icon": "cup" },
  { "name": "Next Event Discount", "icon": "ticket" },
  { "name": "Branded Shoutout",    "icon": "mega" }
]'),
('SCHEDULE', '[
  { "t": "13:00", "label": "Gates open",         "sub": "Coals start glowing. Music low." },
  { "t": "14:00", "label": "First fire",          "sub": "Proteins hit the grill. Snacks served." },
  { "t": "15:30", "label": "Games corner opens",  "sub": "Jenga, UNO, cup-pong stations." },
  { "t": "16:30", "label": "Sauce battle",        "sub": "Blind tasting + heat rankings." },
  { "t": "17:30", "label": "Dance hour",          "sub": "DJ peaks. Best Dancer votes." },
  { "t": "18:30", "label": "Awards + photo wall", "sub": "Prizes. Polaroids. Hugs." },
  { "t": "19:30", "label": "Wind down",           "sub": "Coffee, slow songs, leftovers." }
]'),
('GALLERY', '[
  { "src": "/photos/p01-grill-portrait.jpeg", "caption": "Marinade run" },
  { "src": "/photos/p02-grill-closeup.jpeg",  "caption": "Low and slow" },
  { "src": "/photos/p11-chef-bandana.jpeg",   "caption": "Sauce on sauce" },
  { "src": "/photos/p04-three-friends.jpeg",  "caption": "Posse" },
  { "src": "/photos/p07-crowd.jpeg",          "caption": "The crew" },
  { "src": "/photos/p09-picnic.jpeg",         "caption": "Hilltop picnic" },
  { "src": "/photos/p10-basting.jpeg",        "caption": "Basting hour" },
  { "src": "/photos/p12-kamado.jpeg",         "caption": "Kamado smile" },
  { "src": "/photos/p06-barrel-grill.jpeg",   "caption": "The barrel" },
  { "src": "/photos/p13-peace.jpeg",          "caption": "Peace + lemonade" }
]'),
('TESTIMONIALS', '[
  { "name": "Aline K.",   "handle": "@alinek",    "quote": "I came for the meat, stayed for the UNO war. My team lost. I cried. 10/10." },
  { "name": "Eric M.",    "handle": "@eric.mu",   "quote": "The forest, the smoke, the laughs — felt like a real reset. Already booked the next one." },
  { "name": "Chantal U.", "handle": "@chantal_u", "quote": "Sauce #4 changed my life. I need the recipe. Collins WON''T share it." },
  { "name": "Diego R.",   "handle": "@diego.r",   "quote": "First time, knew nobody. Left with 11 new numbers and a polaroid on my fridge." }
]'),
('FAQ', '[
  { "q": "What should I bring?",  "a": "Yourself, a friend, comfy shoes, a light jacket (forest gets cool around 6 PM), and good energy. Optional: a board game if you have a favourite." },
  { "q": "Is food included?",     "a": "Yes — all proteins, sides, sauces and water are covered by your ticket. Drinks (beer/wine/spirits) are extra and sold on-site." },
  { "q": "Any vegetarian option?", "a": "Grilled veg skewers, halloumi, corn, baked sweet potato + a vegan sauce flight. Mention it on the RSVP form and we''ll keep a plate." },
  { "q": "Can I bring kids?",     "a": "This is an adult vibe (18+ for ticketing) but well-behaved kids 8+ with a parent are welcome at no extra cost. Tell us in advance." },
  { "q": "What if it rains?",     "a": "We don''t cancel. We have tarps, the trees catch most of it, and rain photos slap. If it gets biblical we move to the covered shelter near the gate." },
  { "q": "Refunds?",              "a": "Full refund up to 5 days before. After that, transfer your spot to a friend — just send us their name on WhatsApp." },
  { "q": "How do I get there?",   "a": "Pin in the location section. Parking is free on the forest road. Moto-friendly. Carpool group on WhatsApp after you RSVP." }
]'),
('HOSTS', '[
  { "name": "Collins Muoki", "role": "Pit master + organizer", "tag": "The fire never dies" },
  { "name": "Ines U.",       "role": "Sauce lab + vibes",      "tag": "Heat curator" },
  { "name": "Bruno K.",      "role": "DJ + games captain",     "tag": "Daytime selector" }
]'),
('SPONSORS', '[
  { "name": "Forest BBQ Co.",       "kind": "Equipment" },
  { "name": "Kigali Hot Sauce",     "kind": "Sauces" },
  { "name": "Pinewood Forest Camp", "kind": "Venue" },
  { "name": "AKABANGA",             "kind": "Heat partner" }
]'),
('QUIZ', '[
  { "q": "Low and slow over a wood fire — what kind of cooking is that?", "options": ["Searing", "Smoking", "Grilling", "Sous vide"], "answer": 1, "fact": "Smoking is below 135°C for hours. That foil pile on our barrel? That''s smoking." },
  { "q": "Which sauce ingredient is the soul of Rwandan heat?", "options": ["Tabasco peppers", "Akabanga oil", "Sriracha", "Habanero jam"], "answer": 1, "fact": "Akabanga is a chili-infused oil. A drop is plenty. Two drops is a dare." },
  { "q": "Best way to know meat is done without a thermometer?", "options": ["Look", "Smell", "Touch / feel", "Time it"], "answer": 2, "fact": "Touch the meat, compare to the firmness of your palm under your thumb. Old chef trick." },
  { "q": "What''s the \"Maillard reaction\"?", "options": ["A sauce", "The crust browning", "A cooking show", "A type of grill"], "answer": 1, "fact": "That deep brown crust on a steak — that''s amino acids + sugars rearranging into ~600 flavor compounds." },
  { "q": "Charcoal or wood for the best smoke flavor?", "options": ["Charcoal only", "Wood only", "Both — wood on top of charcoal", "Neither, gas"], "answer": 2, "fact": "Charcoal for heat stability, wood chunks on top for the smoke perfume." }
]')
ON CONFLICT (section_key) DO UPDATE SET content = EXCLUDED.content;
