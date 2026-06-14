export interface SurvivalChoice {
  text: string;
  modifier: number;
}

export interface SdgProgress {
  sdg: string;
  label: string;
  from: number;
  to: number;
  suffix: string;
}

export interface SurvivalRound {
  year: number;
  age: number;
  title: string;
  context: string;
  image: string;
  imageAlt: string;
  choices: SurvivalChoice[];
  surviveNarrative: string;
  eraContext: string;
  shockFacts: string[];
  sdgProgress: SdgProgress[];
}

export const SURVIVAL_ROUNDS: SurvivalRound[] = [
  {
    year: 1800,
    age: 0,
    title: "Infancy",
    context: "Child mortality: 460 of 1000 children die before age 5. Nearly half of all newborns never see their fifth birthday.",
    image: "/infancy-1800.jpg",
    imageAlt: "Pre-industrial farming village, 1800",
    choices: [
      { text: "Mother breastfeeds you through famine", modifier: 0.10 },
      { text: "Born into a family with clean water", modifier: 0.05 },
    ],
    surviveNarrative: "Your first breath became a second. Then a week. Then a year. You survived infancy — luckier than half the world.",
    eraContext: "Nine in ten people live in extreme poverty. The average life is 29 years. Most humans farm with tools unchanged since the Bronze Age.",
    shockFacts: [
      "In 1800, a doctor's tools were not washed between patients. The word 'germ' did not exist.",
      "The average person in 1800 earned the equivalent of $2 per day. Most humans had never traveled more than 20 miles from their birthplace.",
      "There were no antibiotics, no vaccines, no anesthesia. Surgery was a death sentence."
    ],
    sdgProgress: []
  },
  {
    year: 1815,
    age: 15,
    title: "The Year Without a Summer",
    context: "Mount Tambora erupts, blotting out the sun. Crops fail across three continents. Famine creeps through Europe and Asia.",
    image: "/famine-1815.jpg",
    imageAlt: "Barren fields under volcanic ash sky, 1815",
    choices: [
      { text: "Flee to the countryside to forage", modifier: 0.08 },
      { text: "Share dwindling food with neighbors", modifier: 0.03 },
    ],
    surviveNarrative: "You ate dirt this winter. You watched your neighbors starve. But you ate. Famine took millions — you were not among them.",
    eraContext: "Life expectancy remains 29 years. 85% live in poverty. The industrial revolution has begun but its benefits have not reached you.",
    shockFacts: [
      "Mount Tambora killed more people than any earthquake in recorded history. The resulting famine killed over 100,000 in Europe alone.",
      "In 1815, there was no social safety net. No welfare. No food stamps. If you could not work, you starved.",
      "The average worker in 1815 earned less than a medieval peasant."
    ],
    sdgProgress: [
      { sdg: "SDG 1", label: "poverty", from: 89, to: 85, suffix: "%" },
      { sdg: "SDG 3", label: "life expectancy", from: 29, to: 30, suffix: " yr" },
    ]
  },
  {
    year: 1835,
    age: 35,
    title: "Against the Odds",
    context: "Life expectancy is 30 years. You have already outlived the average human. Every day now is borrowed.",
    image: "/industrial-1835.jpg",
    imageAlt: "Early factory with child laborers, 1835",
    choices: [
      { text: "Seek out a barber-surgeon for treatment", modifier: 0.05 },
      { text: "Rest and drink boiled water", modifier: 0.10 },
    ],
    surviveNarrative: "At 35, you are old. Your body aches. But you are alive — a rare thing in a world that grinds people down before 40.",
    eraContext: "The world is transforming — railroads, factories, telegraphs — but progress has not reached the poor.",
    shockFacts: [
      "In 1835, the average life expectancy in industrial cities was 25. Workers lived in conditions worse than medieval peasants.",
      "There were no labor laws. Children as young as 5 worked 16-hour days in factories.",
      "Cholera killed more people than any war. It was spread by contaminated water — but no one knew about germs yet."
    ],
    sdgProgress: [
      { sdg: "SDG 3", label: "child mortality", from: 460, to: 375, suffix: "" },
      { sdg: "SDG 4", label: "literacy", from: 12, to: 17, suffix: "%" },
    ]
  },
  {
    year: 1860,
    age: 60,
    title: "The Ancients",
    context: "You are 60 years old. You have outlived 95% of everyone born in your year. You are a statistical impossibility.",
    image: "/civilwar-1860.jpg",
    imageAlt: "Civil War era soldiers and battlefield, 1860",
    choices: [
      { text: "Move to a quieter rural life", modifier: 0.08 },
      { text: "Stay in the city near a hospital", modifier: 0.04 },
    ],
    surviveNarrative: "Sixty years. You have watched children grow, loved ones die, and the world transform from horse to steam.",
    eraContext: "Darwin publishes On the Origin of Species. The telephone is invented. The American Civil War rages.",
    shockFacts: [
      "In 1860, there were no antibiotics. A simple cut could kill you.",
      "The American Civil War killed more Americans than all other wars combined up to that point. 620,000 dead.",
      "The average person in 1860 had never seen a photograph."
    ],
    sdgProgress: [
      { sdg: "SDG 3", label: "life expectancy", from: 30, to: 32, suffix: " yr" },
      { sdg: "SDG 3", label: "child mortality", from: 375, to: 360, suffix: "" },
      { sdg: "SDG 4", label: "literacy", from: 17, to: 21, suffix: "%" },
    ]
  },
  {
    year: 1900,
    age: 100,
    title: "A New Century",
    context: "The year 1900. You are 100 years old — an impossibility. But the 20th century is the bloodiest in history.",
    image: "/newcentury-1900.jpg",
    imageAlt: "Turn of the century city with early automobiles, 1900",
    choices: [
      { text: "Retreat from public life entirely", modifier: 0.06 },
      { text: "Document your story for posterity", modifier: 0.02 },
    ],
    surviveNarrative: "You have seen a century. Horse to automobile. Candle to electric light. You are the oldest person alive.",
    eraContext: "X-rays. Radio. The airplane. And soon: world war, pandemic, and the deadliest half-century in history.",
    shockFacts: [
      "In 1900, the average life expectancy was 31. You lived over three times that.",
      "In 1900, there were no antibiotics, no insulin, no blood transfusions.",
      "The 20th century would kill more people than all previous centuries combined."
    ],
    sdgProgress: [
      { sdg: "SDG 1", label: "poverty", from: 82, to: 60, suffix: "%" },
      { sdg: "SDG 3", label: "life expectancy", from: 32, to: 45, suffix: " yr" },
      { sdg: "SDG 3", label: "child mortality", from: 360, to: 215, suffix: "" },
    ]
  },
  {
    year: 1918,
    age: 118,
    title: "The Spanish Flu",
    context: "1918. The Spanish Flu kills 50 million people in 24 weeks. You are 118 years old. Your immune system is a ghost.",
    image: "/pandemic-1918.jpg",
    imageAlt: "Spanish Flu hospital ward with masked nurses, 1918",
    choices: [
      { text: "Isolate yourself from all contact", modifier: 0.06 },
      { text: "Trust your ancient immune system", modifier: 0.01 },
    ],
    surviveNarrative: "The flu swept the planet in months. It killed the young and the strong. You are neither. You do not question your luck.",
    eraContext: "World War I ends as the flu peaks. 20 million soldiers dead, 50 million civilians. The old order crumbles.",
    shockFacts: [
      "The Spanish Flu killed more people in 24 weeks than HIV/AIDS killed in 24 years.",
      "In 1918, there were no antiviral drugs, no ventilators, no ICUs.",
      "World War I killed 20 million people. The Spanish Flu killed 50 million."
    ],
    sdgProgress: [
      { sdg: "SDG 3", label: "child mortality", from: 215, to: 125, suffix: "" },
      { sdg: "SDG 4", label: "literacy", from: 21, to: 50, suffix: "%" },
    ]
  },
  {
    year: 1945,
    age: 145,
    title: "The Atomic Age",
    context: "1945. Two world wars. 70 million dead. The Holocaust. Hiroshima. You are 145 years old.",
    image: "/atomic-1945.jpg",
    imageAlt: "WWII ruins and post-war reconstruction, 1945",
    choices: [
      { text: "Flee to the countryside before the bombs", modifier: 0.04 },
      { text: "Volunteer to help rebuild", modifier: 0.01 },
    ],
    surviveNarrative: "You witnessed the worst of humanity and survived. The UN is founded. Perhaps the species has learned something.",
    eraContext: "The United Nations is born. The Marshall Plan rebuilds Europe. Penicillin saves millions.",
    shockFacts: [
      "Between 1939 and 1945, more people died each year than in the entire Napoleonic Wars.",
      "The Holocaust killed 6 million Jews and 5 million others.",
      "Hiroshima destroyed in seconds. 80,000 dead instantly."
    ],
    sdgProgress: [
      { sdg: "SDG 1", label: "poverty", from: 60, to: 38, suffix: "%" },
      { sdg: "SDG 3", label: "life expectancy", from: 45, to: 60, suffix: " yr" },
      { sdg: "SDG 4", label: "literacy", from: 50, to: 65, suffix: "%" },
    ]
  },
  {
    year: 2000,
    age: 200,
    title: "The Digital Age",
    context: "The year 2000. You are 200 years old — the oldest human who has ever lived. The internet connects the world.",
    image: "/digital-2000.jpg",
    imageAlt: "Early internet cafe with dial-up computers, 2000",
    choices: [
      { text: "Embrace modern medicine fully", modifier: 0.03 },
      { text: "Rely on traditional remedies", modifier: 0.00 },
    ],
    surviveNarrative: "You have lived through the entire industrial revolution. Horse to spacecraft. Candle to internet.",
    eraContext: "Extreme poverty has fallen from 89% to 29%. Life expectancy is 68. Smallpox is eradicated.",
    shockFacts: [
      "In 2000, 1 billion people had never made a phone call.",
      "In 2000, there was no Facebook, no iPhone, no YouTube.",
      "Since 1990, 1 billion people have been lifted out of extreme poverty."
    ],
    sdgProgress: [
      { sdg: "SDG 1", label: "poverty", from: 38, to: 10, suffix: "%" },
      { sdg: "SDG 3", label: "life expectancy", from: 60, to: 72, suffix: " yr" },
      { sdg: "SDG 3", label: "child mortality", from: 125, to: 43, suffix: "" },
      { sdg: "SDG 4", label: "literacy", from: 65, to: 86, suffix: "%" },
    ]
  },
  {
    year: 2026,
    age: 224,
    title: "The Present",
    context: "2026. Poverty: 89% to 8.5%. Child mortality: 460 to 37. Literacy: 12% to 87%. Life expectancy: 29 to 73. You saw it all.",
    image: "/goals-2026.jpg",
    imageAlt: "Modern solar panels and green energy, 2026",
    choices: [
      { text: "Write your memoirs for the world", modifier: 0.01 },
      { text: "Spend your last days in peace", modifier: 0.02 },
    ],
    surviveNarrative: "You are the bridge between two worlds. Born into darkness and hunger. Dying in a world of light and plenty.",
    eraContext: "The SDGs are humanity's plan to finish what two centuries began.",
    shockFacts: [
      "In 1800, 89% of the world lived in extreme poverty. Today it is 8.5%.",
      "In 1800, 460 of 1000 children died before age 5. Today it is 37.",
      "In 1800, 12% of the world could read. Today it is 87%."
    ],
    sdgProgress: [
      { sdg: "SDG 1", label: "poverty", from: 10, to: 8.5, suffix: "%" },
      { sdg: "SDG 3", label: "life expectancy", from: 72, to: 73, suffix: " yr" },
      { sdg: "SDG 3", label: "child mortality", from: 43, to: 37, suffix: "" },
      { sdg: "SDG 4", label: "literacy", from: 86, to: 87, suffix: "%" },
    ]
  }
];
