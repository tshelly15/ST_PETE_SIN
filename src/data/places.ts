export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type SpecialDay = "everyday" | Weekday;

export type Special = {
  day: SpecialDay;
  offer: string;
};

export type Place = {
  id: string;
  name: string;
  area: string;
  closedDays?: Weekday[];
  phone?: string;
  specials: Special[];
};

/** St. Pete Service Industry list, transcribed from the 4.9.26 group post. */
export const places: Place[] = [
  {
    id: "angelos",
    name: "Angelo's",
    area: "St. Petersburg, FL",
    specials: [{ day: "everyday", offer: "All beer 1/2 price, house wines $6, $3.25 wells" }],
  },
  {
    id: "bar-548",
    name: "Bar @ 548",
    area: "St. Petersburg, FL",
    specials: [{ day: "everyday", offer: "25% off entire tab" }],
  },
  {
    id: "bar-chinchilla",
    name: "Bar Chinchilla",
    area: "St. Petersburg, FL",
    closedDays: ["mon"],
    specials: [{ day: "everyday", offer: "20% off all day (closed Mondays)" }],
  },
  {
    id: "crafty-squirrel",
    name: "Crafty Squirrel",
    area: "St. Petersburg, FL",
    specials: [{ day: "everyday", offer: "$5 SIN menu with proof of employment" }],
  },
  {
    id: "dog-bar",
    name: "Dog Bar",
    area: "St. Petersburg, FL",
    specials: [
      { day: "everyday", offer: "25% off 9pm–close" },
      { day: "tue", offer: "25% off all day" },
    ],
  },
  {
    id: "enigma",
    name: "Enigma",
    area: "St. Petersburg, FL",
    specials: [{ day: "everyday", offer: "12am–close, 25% off" }],
  },
  {
    id: "the-galley",
    name: "The Galley",
    area: "St. Petersburg, FL",
    specials: [
      { day: "everyday", offer: "10pm–3am, 25% off drinks" },
      { day: "sun", offer: "40% off food & drinks, open to close (11:30am–3am)" },
    ],
  },
  {
    id: "green-turtle",
    name: "Green Turtle Brewery",
    area: "St. Petersburg, FL",
    specials: [{ day: "everyday", offer: "25% off food & drinks" }],
  },
  {
    id: "the-henley",
    name: "The Henley",
    area: "St. Petersburg, FL",
    specials: [{ day: "everyday", offer: "$5 SIN menu with proof of employment" }],
  },
  {
    id: "local-tide",
    name: "Local Tide Kayak and Sandbar Tours",
    area: "Tierra Verde, FL",
    specials: [{ day: "everyday", offer: "20% off" }],
  },
  {
    id: "the-lure",
    name: "The Lure",
    area: "St. Petersburg, FL",
    specials: [
      {
        day: "everyday",
        offer: "25% off all day every day (excludes happy hour, daily specials, and to-go orders)",
      },
    ],
  },
  {
    id: "mary-margarets",
    name: "Mary Margaret's Olde Irish Tavern",
    area: "St. Petersburg, FL",
    specials: [
      { day: "everyday", offer: "40% off 9pm–close" },
      { day: "mon", offer: "40% off all day" },
      { day: "tue", offer: "40% off 9pm–close" },
      { day: "wed", offer: "40% off 9pm–close" },
      { day: "thu", offer: "40% off 9pm–close" },
      { day: "fri", offer: "40% off 9pm–close" },
    ],
  },
  {
    id: "niagra",
    name: "Niagra Tap Bar and Grill",
    area: "St. Petersburg, FL",
    specials: [{ day: "everyday", offer: "HH-priced drinks for service industry, open to close" }],
  },
  {
    id: "north-end",
    name: "The North End Taphouse & Kitchen",
    area: "St. Petersburg, FL",
    specials: [{ day: "everyday", offer: "50% off 9pm–close" }],
  },
  {
    id: "oyster-shucker",
    name: "Oyster Shucker",
    area: "St. Pete Beach, FL",
    specials: [{ day: "everyday", offer: "25% off" }],
  },
  {
    id: "pierogi-bar",
    name: "Pierogi Bar",
    area: "St. Petersburg, FL",
    specials: [
      { day: "everyday", offer: "25% off all drinks (excludes Ukrainian beers)" },
      { day: "mon", offer: "50% off all drinks (excludes Ukrainian beers)" },
    ],
  },
  {
    id: "pizza-box",
    name: "Pizza Box",
    area: "St. Petersburg, FL",
    specials: [{ day: "everyday", offer: "20% off" }],
  },
  {
    id: "ships-hold",
    name: "Ship's Hold",
    area: "St. Petersburg, FL",
    specials: [
      { day: "everyday", offer: "10pm–3am, 25% off drinks" },
      { day: "sun", offer: "40% off food & drinks, open to close (6pm–3am)" },
    ],
  },
  {
    id: "st-pete-brewing",
    name: "St Pete Brewing Co.",
    area: "St. Petersburg, FL",
    specials: [{ day: "everyday", offer: "50% off beers" }],
  },
  {
    id: "surterra",
    name: "Surterra Wellness",
    area: "St. Petersburg, FL",
    specials: [{ day: "everyday", offer: "15% off" }],
  },
  {
    id: "wheres-jubes",
    name: "Where's Jubes",
    area: "St. Petersburg, FL",
    specials: [{ day: "everyday", offer: "$5 SIN menu with proof of employment" }],
  },
  {
    id: "alleo",
    name: "Alleo",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "50% off all food 5–10pm (excludes striploin and seafood tower)" }],
  },
  {
    id: "bar-mastiff",
    name: "Bar Mastiff",
    area: "St. Petersburg, FL",
    specials: [
      { day: "mon", offer: "$5 Jack, Jameson, Tito's; all food $12 and under" },
      { day: "wed", offer: "$2 Busch, $4 Beam (+ karaoke)" },
      { day: "thu", offer: "$3.25 seltzers and rums" },
    ],
  },
  {
    id: "bavaros",
    name: "Bavaros",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "25% off" }],
  },
  {
    id: "bier-boutique",
    name: "Bier Boutique",
    area: "St. Petersburg, FL",
    specials: [
      { day: "mon", offer: "25% off 11am–3:30pm" },
      { day: "tue", offer: "25% off 11am–3:30pm" },
      { day: "wed", offer: "25% off 11am–3:30pm" },
      { day: "thu", offer: "25% off 11am–3:30pm" },
      { day: "fri", offer: "25% off 11am–3:30pm" },
    ],
  },
  {
    id: "big-catch",
    name: "The Big Catch",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "50% off tab" }],
  },
  {
    id: "cane-barrel",
    name: "Cane and Barrel Rooftop Lounge",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "30% off check" }],
  },
  {
    id: "casual-clam",
    name: "Casual Clam",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "20% off" }],
  },
  {
    id: "club-201",
    name: "Club 201 at The Detroit",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "25% off" }],
  },
  {
    id: "cocktail",
    name: "COCKtail",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "Half off after 9pm (excludes the $3 Martini Monday Skyy vodkas)" }],
  },
  {
    id: "cool-vibes-pub",
    name: "Cool Vibes Pub & Grub",
    area: "St. Petersburg, FL",
    specials: [
      { day: "mon", offer: "50% off open to close (not cash only)" },
      { day: "tue", offer: "$2.99 drinks with food purchase, open to close" },
      { day: "sun", offer: "50% off open to close (not cash only)" },
    ],
  },
  {
    id: "copper-shaker",
    name: "Copper Shaker",
    area: "St. Petersburg, FL",
    specials: [
      { day: "mon", offer: "25% off" },
      { day: "sun", offer: "25% off" },
    ],
  },
  {
    id: "driftwood-kava",
    name: "Driftwood Kava",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "25% off" }],
  },
  {
    id: "flute-dram",
    name: "Flûte & Dram",
    area: "St. Petersburg, FL",
    specials: [
      { day: "mon", offer: "50% off everything (excludes bottles/certain whiskey)" },
      { day: "tue", offer: "After 10pm, 25% off" },
      { day: "wed", offer: "After 10pm, 25% off" },
      { day: "thu", offer: "After 10pm, 25% off" },
      { day: "fri", offer: "After 10pm, 25% off" },
      { day: "sat", offer: "After 11pm, 25% off" },
      { day: "sun", offer: "After 11pm, 25% off" },
    ],
  },
  {
    id: "glampers",
    name: "Trailer Daddy",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "9pm–close, 50% off all wells/domestic beer/seltzers" }],
  },
  {
    id: "golden-isles",
    name: "Golden Isles Brewing",
    area: "St. Petersburg, FL",
    specials: [
      { day: "mon", offer: "30% off" },
      { day: "tue", offer: "30% off" },
    ],
  },
  {
    id: "grass-roots",
    name: "Grass Roots",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "25% off" }],
  },
  {
    id: "green-bench",
    name: "Green Bench",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "50% off drafts" }],
  },
  {
    id: "green-room",
    name: "The Green Room",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "25% off entire tab, all day" }],
  },
  {
    id: "hatchet",
    name: "Hatchet Hangout",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "$20/hour" }],
  },
  {
    id: "il-ritorno",
    name: "Il Ritorno",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "50% off food" }],
  },
  {
    id: "the-joint",
    name: "The Joint",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "$3 calls 8pm–close" }],
  },
  {
    id: "linking-heights",
    name: "Linking Heights",
    area: "St. Petersburg, FL",
    specials: [
      { day: "mon", offer: "9pm–close, 25% off" },
      { day: "tue", offer: "9pm–close, 25% off" },
      { day: "wed", offer: "25% off entire check, all day" },
      { day: "thu", offer: "9pm–close, 25% off" },
    ],
  },
  {
    id: "love-food",
    name: "Love Food Central",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "20% off" }],
  },
  {
    id: "mastrys",
    name: "Mastry's Brewing Company",
    area: "St. Pete Beach, FL",
    specials: [{ day: "mon", offer: "$4 pours & 20% off package beer" }],
  },
  {
    id: "nueva-cantina",
    name: "Nueva Cantina",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "25% off check" }],
  },
  {
    id: "olde-fl",
    name: "Olde FL Brewing Co",
    area: "Largo, FL",
    specials: [{ day: "mon", offer: "1–7pm, 20% off drafts" }],
  },
  {
    id: "omnia",
    name: "Omnia Blue Gentlemen's Club",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "8pm–close, free admission, 50% off drinks, 2-for-1 dances" }],
  },
  {
    id: "one-night-stand",
    name: "The One Night Stand",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "50% off after 8pm" }],
  },
  {
    id: "overflow",
    name: "Overflow Brewing",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "$2 off drafts" }],
  },
  {
    id: "paddywagon",
    name: "Paddywagon Dunedin",
    area: "Dunedin, FL",
    specials: [
      { day: "mon", offer: "20% off tab" },
      { day: "sun", offer: "20% off tab" },
    ],
  },
  {
    id: "par-bar",
    name: "Par Bar",
    area: "St. Petersburg, FL",
    specials: [
      { day: "mon", offer: "40% off entire tab" },
      { day: "tue", offer: "40% off entire tab" },
      { day: "wed", offer: "40% off entire tab" },
      { day: "sun", offer: "40% off entire tab" },
    ],
  },
  {
    id: "pelican",
    name: "Pelican Pub",
    area: "St. Petersburg, FL",
    specials: [
      { day: "mon", offer: "25% off + karaoke" },
      { day: "sun", offer: "25% off" },
    ],
  },
  {
    id: "penthouse",
    name: "Penthouse Club",
    area: "Tampa, FL",
    specials: [
      { day: "mon", offer: "Free entry and 1/2 off bar tab" },
      { day: "sun", offer: "Free entry and 1/2 off bar tab" },
    ],
  },
  {
    id: "pier-dolphin",
    name: "Pier Dolphin Cruises",
    area: "St. Petersburg, FL",
    specials: [
      {
        day: "mon",
        offer: "Free booze cruise at sunset for service industry (check sunset times)",
      },
    ],
  },
  {
    id: "pour-judgement",
    name: "Pour Judgement",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "9pm–close, 50% off" }],
  },
  {
    id: "roadhouse",
    name: "Roadhouse Pub",
    area: "St. Petersburg, FL",
    specials: [
      { day: "mon", offer: "$3 domestic bottles 9pm–close" },
      { day: "tue", offer: "$3 domestic bottles 9pm–close" },
      { day: "wed", offer: "$3 domestic bottles 9pm–close" },
      { day: "thu", offer: "$3 domestic bottles 9pm–close" },
    ],
  },
  {
    id: "rubys",
    name: "Ruby's Elixir",
    area: "St. Petersburg, FL",
    specials: [
      { day: "mon", offer: "9pm–close, 25% off SIN" },
      { day: "tue", offer: "9pm–close, 25% off SIN" },
      { day: "wed", offer: "9pm–close, 25% off SIN" },
      { day: "thu", offer: "9pm–close, 25% off SIN" },
      { day: "sun", offer: "9pm–close, 25% off SIN" },
    ],
  },
  {
    id: "splash-harbor",
    name: "Splash Harbor",
    area: "Indian Rocks Beach, FL",
    specials: [{ day: "mon", offer: "1/2 off admission + various drink discounts (ask)" }],
  },
  {
    id: "stormrunners",
    name: "Stormrunners Tavern",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "50% off drinks, 25% off food all day" }],
  },
  {
    id: "tbd",
    name: "Tampa Bay Drinkery",
    area: "St. Petersburg, FL",
    specials: [
      {
        day: "mon",
        offer: "10pm–2am, BOGO Nutrl/wells/Surfside/champagne/house wine/all beers",
      },
    ],
  },
  {
    id: "tequila-daisy",
    name: "Tequila Daisy",
    area: "St. Petersburg, FL",
    specials: [
      { day: "mon", offer: "9pm–close, 50% off tab on items individually priced $50 and under" },
      { day: "fri", offer: "9pm–close, 50% off tab on items individually priced $50 and under" },
    ],
  },
  {
    id: "three-birds",
    name: "Three Birds Tavern",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "50% off" }],
  },
  {
    id: "toasted-monkey",
    name: "Toasted Monkey",
    area: "St. Pete Beach, FL",
    specials: [
      { day: "mon", offer: "11am–4pm, 50% off food" },
      { day: "tue", offer: "11am–4pm, 50% off food" },
      { day: "wed", offer: "11am–4pm, 50% off food" },
      { day: "thu", offer: "11am–4pm, 50% off food" },
      { day: "fri", offer: "11am–4pm, 50% off food" },
    ],
  },
  {
    id: "tryst",
    name: "Tryst",
    area: "St. Petersburg, FL",
    specials: [
      { day: "mon", offer: "40% off tab, all day" },
      { day: "tue", offer: "25% off after 10pm" },
      { day: "wed", offer: "25% off after 10pm" },
      { day: "thu", offer: "25% off after 10pm" },
      { day: "sun", offer: "25% off after 10pm" },
    ],
  },
  {
    id: "velvet-gypsy",
    name: "Velvet Gypsy",
    area: "Tampa, FL",
    specials: [{ day: "mon", offer: "50% off" }],
  },
  {
    id: "vfw-39",
    name: "VFW Post 39",
    area: "St. Petersburg, FL",
    specials: [
      { day: "mon", offer: "Open to SIN employees" },
      { day: "wed", offer: "Open to SIN employees" },
    ],
  },
  {
    id: "voodoo",
    name: "Voodoo Brewing",
    area: "St. Petersburg, FL",
    specials: [{ day: "mon", offer: "20% off tab" }],
  },
  {
    id: "whiskey-exchange",
    name: "Whiskey Exchange",
    area: "St. Petersburg, FL",
    specials: [
      { day: "mon", offer: "HH pricing all day" },
      { day: "tue", offer: "$5 old fashioneds + 50% off drinks after 7pm" },
      {
        day: "wed",
        offer: "50% off wine bottles + BOGO espresso martinis after 7pm; 25% off drinks after midnight",
      },
      { day: "thu", offer: "12am–close, 25% off drinks" },
      { day: "fri", offer: "$25 Prosecco bottles 9pm–1am" },
      { day: "sun", offer: "$5 drink specials; 25% off drinks after midnight" },
    ],
  },
  {
    id: "andria",
    name: "Andria with Skin Therapy St Pete",
    area: "St. Petersburg, FL",
    phone: "727-338-7969",
    specials: [
      {
        day: "tue",
        offer:
          "Text 727-338-7969 for discount. Ultimate Facial $100 ($75 off) incl. dermaplane, enzyme or peel, and microcurrent",
      },
      {
        day: "wed",
        offer:
          "Text 727-338-7969 for discount. Ultimate Facial $100 ($75 off) incl. dermaplane, enzyme or peel, and microcurrent",
      },
    ],
  },
  {
    id: "baba",
    name: "Baba on Central",
    area: "St. Petersburg, FL",
    specials: [
      { day: "tue", offer: "1/2 off bottles of wine $100 or less" },
      { day: "sun", offer: "25% off tab" },
    ],
  },
  {
    id: "bayboro",
    name: "Bayboro Brewing",
    area: "St. Petersburg, FL",
    specials: [
      { day: "tue", offer: "50% off tab after 7pm" },
      { day: "wed", offer: "50% off tab after 7pm" },
    ],
  },
  {
    id: "brick-mortar",
    name: "Brick and Mortar",
    area: "St. Petersburg, FL",
    specials: [{ day: "tue", offer: "25% off bill (some exceptions apply)" }],
  },
  {
    id: "category-36",
    name: "Category 36 Taphouse",
    area: "St. Pete Beach, FL",
    specials: [{ day: "tue", offer: "20% off" }],
  },
  {
    id: "cool-vibes-beach",
    name: "Cool Vibes On The Beach",
    area: "St. Pete Beach, FL",
    specials: [
      { day: "tue", offer: "$3.99 drinks open to close" },
      { day: "wed", offer: "50% off entire tab, open to close" },
    ],
  },
  {
    id: "drunken-clam",
    name: "Drunken Clam",
    area: "St. Petersburg, FL",
    specials: [{ day: "tue", offer: "7pm–close, $3.50 premiums" }],
  },
  {
    id: "good-fortune",
    name: "Good Fortune",
    area: "St. Petersburg, FL",
    specials: [{ day: "tue", offer: "30% off all food and drinks, 1/2 off karaoke room" }],
  },
  {
    id: "hollander",
    name: "The Hollander Pool Bar & Restaurant",
    area: "St. Petersburg, FL",
    specials: [
      { day: "tue", offer: "25% off entire tab, all day (pool bar and inside restaurant)" },
    ],
  },
  {
    id: "jimmy-bs",
    name: "Jimmy B's Beach Bar",
    area: "Treasure Island, FL",
    specials: [
      {
        day: "tue",
        offer: "8pm–close, 50% off entire bill including food (kitchen until 10pm, band until 12:30am)",
      },
    ],
  },
  {
    id: "mullets",
    name: "Mullet's Fish Camp",
    area: "St. Petersburg, FL",
    specials: [{ day: "tue", offer: "20% off check 12pm–9pm" }],
  },
  {
    id: "pour-decor",
    name: "Pour and Decor",
    area: "St. Petersburg, FL",
    specials: [{ day: "tue", offer: "30% off food, coffee, beer, wine" }],
  },
  {
    id: "rascals",
    name: "Rude Rascal's",
    area: "St. Pete Beach, FL",
    specials: [
      { day: "tue", offer: "20% off 8pm–close" },
      { day: "wed", offer: "20% off 8pm–close" },
    ],
  },
  {
    id: "saigon-blonde",
    name: "Saigon Blonde",
    area: "St. Petersburg, FL",
    specials: [
      { day: "tue", offer: "25% off" },
      { day: "wed", offer: "25% off" },
      { day: "thu", offer: "25% off" },
      { day: "fri", offer: "25% off" },
      { day: "sun", offer: "35% off" },
    ],
  },
  {
    id: "sauvignon",
    name: "Sauvignon",
    area: "St. Petersburg, FL",
    specials: [
      { day: "tue", offer: "50% off food (excludes HH food)" },
      { day: "wed", offer: "50% off food (excludes HH food)" },
    ],
  },
  {
    id: "slizzy",
    name: "Slizzy McGees",
    area: "St. Petersburg, FL",
    specials: [{ day: "tue", offer: "7pm–close, 20% off" }],
  },
  {
    id: "sports-fourth",
    name: "Sports on Fourth",
    area: "St. Petersburg, FL",
    specials: [
      {
        day: "tue",
        offer: "2-for-1 beers (drafts/bottles/seltzers), house wines, and all liquor under $9",
      },
    ],
  },
  {
    id: "bar-chica",
    name: "Bar Chica",
    area: "St. Petersburg, FL",
    specials: [{ day: "wed", offer: "50% off drinks 7pm–close" }],
  },
  {
    id: "bula",
    name: "Bula Kafe",
    area: "St. Petersburg, FL",
    specials: [{ day: "wed", offer: "25% off" }],
  },
  {
    id: "dirty-laundry",
    name: "Dirty Laundry",
    area: "St. Petersburg, FL",
    specials: [{ day: "wed", offer: "40% off" }],
  },
  {
    id: "flatbread",
    name: "Flatbread & Butter",
    area: "St. Petersburg, FL",
    specials: [{ day: "wed", offer: "3pm–close, 50% off" }],
  },
  {
    id: "frescos",
    name: "Fresco's",
    area: "St. Petersburg, FL",
    specials: [{ day: "wed", offer: "40% off entire tab, all day" }],
  },
  {
    id: "lost-found",
    name: "Lost and Found",
    area: "St. Petersburg, FL",
    specials: [{ day: "wed", offer: "50% off everything after 8pm" }],
  },
  {
    id: "nickos",
    name: "Nicko's Pizza",
    area: "St. Petersburg, FL",
    specials: [{ day: "wed", offer: "25% off" }],
  },
  {
    id: "one-eyed",
    name: "One Eyed Kellee's",
    area: "St. Petersburg, FL",
    specials: [{ day: "wed", offer: "20% off all day / until 3am (formerly Don's Irish Pub)" }],
  },
  {
    id: "blush-tea",
    name: "Blush Tea and Coffee St Pete",
    area: "St. Petersburg, FL",
    specials: [{ day: "thu", offer: "3pm–close, 30% off all drinks" }],
  },
  {
    id: "book-rescuers",
    name: "The Book Rescuers",
    area: "Pinellas Park, FL",
    specials: [{ day: "thu", offer: "20% off" }],
  },
  {
    id: "grand-central",
    name: "Grand Central Brew House",
    area: "St. Petersburg, FL",
    specials: [{ day: "thu", offer: "50% off (excludes food)" }],
  },
  {
    id: "the-helm",
    name: "The Helm",
    area: "St. Petersburg, FL",
    specials: [{ day: "thu", offer: "25% off 10:30am–4pm" }],
  },
  {
    id: "localz",
    name: "Localz",
    area: "St. Petersburg, FL",
    specials: [{ day: "thu", offer: "50% off food only" }],
  },
  {
    id: "five-bucks",
    name: "Five Bucks",
    area: "St. Petersburg, FL",
    specials: [{ day: "sun", offer: "BOGO wells and seltzers" }],
  },
  {
    id: "intermezzo",
    name: "Intermezzo Coffee & Cocktails",
    area: "St. Petersburg, FL",
    specials: [{ day: "sun", offer: "30% off" }],
  },
  {
    id: "the-landing",
    name: "The Landing",
    area: "St. Petersburg, FL",
    specials: [{ day: "sun", offer: "25% off" }],
  },
  {
    id: "omaddys",
    name: "O'Maddy's",
    area: "St. Petersburg, FL",
    specials: [{ day: "sun", offer: "4pm–close, 25% off whole tab" }],
  },
  {
    id: "outcast",
    name: "Outcast Brewing Company",
    area: "St. Petersburg, FL",
    specials: [{ day: "sun", offer: "4pm–close, 30% off" }],
  },
  {
    id: "park-rec",
    name: "Park & Rec",
    area: "St. Petersburg, FL",
    specials: [{ day: "sun", offer: "5pm–close, 50% off" }],
  },
  {
    id: "pluma",
    name: "Pluma Lounge",
    area: "St. Petersburg, FL",
    specials: [
      {
        day: "sun",
        offer: "5pm–10pm, 50% off cocktails, beer, and wine (vintage spirits exempt)",
      },
    ],
  },
  {
    id: "reef-madeira",
    name: "The Reef Bar and Grill",
    area: "Madeira Beach, FL",
    specials: [{ day: "sun", offer: "8pm–1am, 50% off" }],
  },
  {
    id: "ricks-reef",
    name: "Rick's Reef",
    area: "St. Pete Beach, FL",
    specials: [{ day: "sun", offer: "8pm–close, 50% off" }],
  },
  {
    id: "slim-charmer",
    name: "Slim Charmer",
    area: "St. Petersburg, FL",
    specials: [{ day: "sun", offer: "20% off + $10 margs, 4pm–9pm" }],
  },
  {
    id: "thirsty-first",
    name: "Thirsty First",
    area: "St. Petersburg, FL",
    specials: [{ day: "sun", offer: "40% off" }],
  },
  {
    id: "welcome-farm",
    name: "Welcome to the Farm",
    area: "St. Petersburg, FL",
    specials: [{ day: "sun", offer: "50% off all day" }],
  },
];
