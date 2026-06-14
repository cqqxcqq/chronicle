export interface SurvivalRound {
  year: number;
  age: number;
  title: string;
  context: string;
  survivalChance: number;
  surviveNarrative: string;
  deathNarrative: string;
  eraContext: string;
  shockFacts: string[];
}

export const SURVIVAL_ROUNDS: SurvivalRound[] = [
  {
    year: 1800,
    age: 0,
    title: "Infancy",
    context: "Child mortality: 460 of 1000 children die before age 5. Nearly half of all newborns never see their fifth birthday.",
    survivalChance: 0.50,
    surviveNarrative: "Your first breath became a second. Then a week. Then a year. You survived infancy — luckier than half the world.",
    deathNarrative: "Your first breath was your last. Half of all children born in 1800 shared your fate. The world was hungry and brief.",
    eraContext: "Nine in ten people live in extreme poverty. The average life is 29 years. Most humans farm with tools unchanged since the Bronze Age.",
    shockFacts: [
      "In 1800, a doctor's tools were not washed between patients. The word 'germ' did not exist.",
      "The average person in 1800 earned the equivalent of $2 per day. Most humans had never traveled more than 20 miles from their birthplace.",
      "There were no antibiotics, no vaccines, no anesthesia. Surgery was a death sentence."
    ]
  },
  {
    year: 1815,
    age: 15,
    title: "The Year Without a Summer",
    context: "Mount Tambora erupts, blotting out the sun. Crops fail across three continents. Famine creeps through Europe and Asia. Cholera stirs in the filth of growing cities.",
    survivalChance: 0.55,
    surviveNarrative: "You ate dirt this winter. You watched your neighbors starve. But you ate. Famine took millions — you were not among them.",
    deathNarrative: "The sun did not return that summer. Crops blackened in the fields. You starved alongside a million others. The earth had turned against you.",
    eraContext: "Life expectancy remains 29 years. 85% live in poverty. The industrial revolution has begun but its benefits have not reached you.",
    shockFacts: [
      "Mount Tambora killed more people than any earthquake in recorded history. The resulting famine killed over 100,000 in Europe alone.",
      "In 1815, there was no social safety net. No welfare. No food stamps. If you could not work, you starved.",
      "The average worker in 1815 earned less than a medieval peasant. The industrial revolution made the rich richer and the poor poorer."
    ]
  },
  {
    year: 1835,
    age: 35,
    title: "Against the Odds",
    context: "Life expectancy is 30 years. You have already outlived the average human. Every day now is borrowed. Cholera, typhus, and consumption fill the graveyards.",
    survivalChance: 0.35,
    surviveNarrative: "At 35, you are old. Your body aches. Your teeth are gone. But you are alive — a rare thing in a world that grinds people down before they reach 40.",
    deathNarrative: "Your body gave out. Fever. Coughing. The slow fade. Most people born in 1800 die between 30 and 40. You were not special. You were normal.",
    eraContext: "The world is transforming — railroads, factories, telegraphs — but progress has not reached the poor. Cities are death traps of filth and disease.",
    shockFacts: [
      "In 1835, the average life expectancy in industrial cities was 25. Workers lived in conditions worse than medieval peasants.",
      "There were no labor laws. Children as young as 5 worked 16-hour days in factories. The average factory worker died before 30.",
      "Cholera killed more people than any war. It was spread by contaminated water — but no one knew about germs yet."
    ]
  },
  {
    year: 1860,
    age: 60,
    title: "The Ancients",
    context: "You are 60 years old. You have outlived 95% of everyone born in your year. Life expectancy has crept to 31. You are a statistical impossibility.",
    survivalChance: 0.30,
    surviveNarrative: "Sixty years. You have watched children grow, loved ones die, and the world transform from horse to steam. You are a living archive of a vanished century.",
    deathNarrative: "At 60, death is not a tragedy — it is a release. You lived twice as long as most of your generation. You won the lottery of life, and then it ended.",
    eraContext: "Darwin publishes On the Origin of Species. The telephone is invented. The American Civil War rages. The world is being remade without you.",
    shockFacts: [
      "In 1860, there were no antibiotics. A simple cut could kill you. Infection was a death sentence.",
      "The American Civil War killed more Americans than all other wars combined up to that point. 620,000 dead.",
      "The average person in 1860 had never seen a photograph. The idea of recording reality was still revolutionary."
    ]
  },
  {
    year: 1900,
    age: 100,
    title: "A New Century",
    context: "The year 1900. You are 100 years old — an impossibility. No one lives this long. And yet here you are. But the 20th century is the bloodiest in history.",
    survivalChance: 0.15,
    surviveNarrative: "You have seen a century. Horse to automobile. Candle to electric light. You are the oldest person alive. The world does not know what to do with you.",
    deathNarrative: "The century turned without you. 100 years is not a life — it is a legend. You died knowing you had outrun death itself for longer than anyone should.",
    eraContext: "X-rays. Radio. The airplane. And soon: world war, pandemic, and the deadliest half-century in human history.",
    shockFacts: [
      "In 1900, the average life expectancy was 31. You lived over three times that. You are a statistical miracle.",
      "In 1900, there were no antibiotics, no insulin, no blood transfusions. Diabetes was a death sentence. Childbirth killed thousands.",
      "The 20th century would kill more people than all previous centuries combined. Two world wars, a pandemic, and the Holocaust."
    ]
  },
  {
    year: 1918,
    age: 118,
    title: "The Spanish Flu",
    context: "1918. The Spanish Flu kills 50 million people in 24 weeks — more than the Great War. You are 118 years old. Your immune system is a ghost.",
    survivalChance: 0.10,
    surviveNarrative: "The flu swept the planet in months. It killed the young and the strong. You are neither. You do not question your luck.",
    deathNarrative: "The Spanish Flu did not need to discriminate by age. At 118, any illness is final. You died as the world endured its worst pandemic in centuries.",
    eraContext: "World War I ends as the flu peaks. 20 million soldiers dead, 50 million civilians. The old order crumbles.",
    shockFacts: [
      "The Spanish Flu killed more people in 24 weeks than HIV/AIDS killed in 24 years. 50 million dead.",
      "In 1918, there were no antiviral drugs, no ventilators, no ICUs. If you got sick, you either recovered or you died.",
      "World War I killed 20 million people. The Spanish Flu killed 50 million. The pandemic was 2.5 times deadlier than the war."
    ]
  },
  {
    year: 1945,
    age: 145,
    title: "The Atomic Age",
    context: "1945. Two world wars. 70 million dead. The Holocaust. Hiroshima. You are 145 years old — a survivor of humanity's darkest hours.",
    survivalChance: 0.08,
    surviveNarrative: "You witnessed the worst of humanity and survived. The UN is founded. Perhaps the species has learned something. At 145, you are hope itself.",
    deathNarrative: "The century of total war finally claimed you. At 145, living is an act of defiance. You have earned your rest.",
    eraContext: "The United Nations is born. The Marshall Plan rebuilds Europe. Penicillin saves millions. Life expectancy will soon reach 48.",
    shockFacts: [
      "Between 1939 and 1945, more people died each year than in the entire Napoleonic Wars. 70 million dead in six years.",
      "The Holocaust killed 6 million Jews and 5 million others. The world swore 'never again' — but it happened again in Bosnia, Rwanda, and Darfur.",
      "Hiroshima destroyed in seconds. 80,000 dead instantly. The nuclear age had begun."
    ]
  },
  {
    year: 2000,
    age: 200,
    title: "The Digital Age",
    context: "The year 2000. You are 200 years old — the oldest human who has ever lived. The internet connects the world. Information is free.",
    survivalChance: 0.05,
    surviveNarrative: "You have lived through the entire industrial revolution. Horse to spacecraft. Candle to internet. You remember when none of this existed.",
    deathNarrative: "At 200, you are not a person — you are a phenomenon. Your death makes global headlines. You lived two centuries. That is enough.",
    eraContext: "Extreme poverty has fallen from 89% to 29%. Life expectancy is 68. Smallpox is eradicated. The world you were born into no longer exists.",
    shockFacts: [
      "In 2000, 1 billion people had never made a phone call. Today, 5 billion people own mobile phones.",
      "In 2000, there was no Facebook, no iPhone, no YouTube. The internet was a novelty. Today it is the backbone of civilization.",
      "Since 1990, 1 billion people have been lifted out of extreme poverty. The greatest reduction in human suffering in history."
    ]
  },
  {
    year: 2026,
    age: 224,
    title: "The Present",
    context: "2026. Poverty: 89% to 8.5%. Child mortality: 460 to 37. Literacy: 12% to 87%. Life expectancy: 29 to 73. You saw it all.",
    survivalChance: 0.03,
    surviveNarrative: "You are the bridge between two worlds. Born into darkness and hunger. Dying in a world of light and plenty. You witnessed the greatest transformation in human history.",
    deathNarrative: "At 224, you were the last living link to 1800. When you died, the world lost its only living witness to the age of want. But the story of how everything changed lives on.",
    eraContext: "The SDGs are humanity's plan to finish what two centuries began. Eradicating poverty, ending preventable disease — all within reach.",
    shockFacts: [
      "In 1800, 89% of the world lived in extreme poverty. Today it is 8.5%. That is 7 billion fewer people in poverty.",
      "In 1800, 460 of 1000 children died before age 5. Today it is 37. That is 423 more children surviving per 1000.",
      "In 1800, 12% of the world could read. Today it is 87%. That is 6 billion more literate people."
    ]
  }
];
