export const START_YEAR = 1800;
export const END_YEAR = 2026;
export const TOTAL_YEARS = END_YEAR - START_YEAR;
export const MAX_PARTICLES = 8000;
export const LERP_RATE = 0.06;

export interface Milestone {
  index: number;
  year: number;
  label: string;
  description: string;
}

export const MILESTONES: Milestone[] = [
  { index: 0, year: 1800, label: "The Age of Want", description: "Nearly nine in ten people lived in extreme poverty. Childhood was a sentence of risk. Progress existed as an idea, not yet a reality." },
  { index: 1, year: 1850, label: "The Age of Industry", description: "Steam and steel began to reshape the world. Sanitation crept into cities. Literacy stirred." },
  { index: 2, year: 1900, label: "The Age of Catastrophe", description: "Two world wars, a pandemic, and famines scarred continents. Over 100 million people perished. Yet from the ruins, global cooperation was born." },
  { index: 3, year: 1945, label: "The Age of Recovery", description: "Decolonization, vaccines, and the green revolution. Poverty began its long retreat. Life expectancy rose dramatically across the world." },
  { index: 4, year: 1990, label: "The Age of Acceleration", description: "Globalization, the digital revolution, and unprecedented growth lifted billions from poverty. The world was more connected than ever." },
  { index: 5, year: 2015, label: "The Age of Goals", description: "The UN SDGs codified humanity's collective ambition. Poverty, disease, and ignorance are no longer inevitable." },
];

export const getMilestoneBounds = (index: number) => ({
  startYear: MILESTONES[index].year,
  endYear: index < MILESTONES.length - 1 ? MILESTONES[index + 1].year : 2026,
});

export interface MilestoneStat {
  hook: string;
  context: string;
  keyFact: string;
  poverty: number;
  lifeExpectancy: number;
  childMortality: number;
  literacy: number;
  whatIf?: string;
}

export const MILESTONE_STATS: MilestoneStat[] = [
  {
    hook: "Most work began at sunrise. Nearly half of children never reached their fifth birthday.",
    context: "Roughly one billion people lived in a world of local harvests, animal power, and recurring infection. Global estimates for this period are reconstructions, assembled long after the lives they describe.",
    keyFact: "Around 1800, perhaps one person in eight could read. A message still travelled at the speed of a horse or ship.",
    poverty: 89,
    lifeExpectancy: 29,
    childMortality: 460,
    literacy: 12,
  },
  {
    hook: "Steam shortened journeys while factory smoke shortened lives.",
    context: "Railways moved coal, cloth, soldiers, and migrants. Crowded industrial cities grew faster than sewers and clean-water systems; empire supplied much of the raw material and absorbed much of the violence.",
    keyFact: "In several industrial cities, urban death rates exceeded rural ones. Cholera maps would eventually make contaminated water visible.",
    poverty: 85,
    lifeExpectancy: 30,
    childMortality: 375,
    literacy: 17,
    whatIf: "What if antibiotics had arrived 50 years earlier? Millions of child deaths from infection could have been prevented.",
  },
  {
    hook: "A microscope revealed microbes; assembly lines supplied both clinics and armies.",
    context: "Germ theory changed surgery and public sanitation. Telegraph cables compressed distance. Industrial states used the same logistics to mobilize millions for war.",
    keyFact: "The 1918 influenza pandemic killed tens of millions worldwide. Exact totals remain uncertain.",
    poverty: 72,
    lifeExpectancy: 32,
    childMortality: 360,
    literacy: 21,
    whatIf: "What if the League of Nations had prevented World War II? 70 million lives and two decades of progress could have been preserved.",
  },
  {
    hook: "The ruins contained vaccination ledgers, ration books, and plans for institutions that did not yet exist.",
    context: "After war and genocide, states founded the United Nations and adopted a universal declaration of rights. Decolonization reshaped the map, while vaccines, antibiotics, and food systems extended millions of lives.",
    keyFact: "Post-war survival improved rapidly, but access followed wealth, citizenship, race, and geography.",
    poverty: 60,
    lifeExpectancy: 45,
    childMortality: 215,
    literacy: 50,
    whatIf: "What if vaccines had reached every child by 1950? Smallpox and polio could have been eradicated a generation earlier.",
  },
  {
    hook: "A telephone crossed from the wall to the pocket; supply chains crossed oceans.",
    context: "Trade, public policy, technology, and especially rapid growth in Asia reduced extreme poverty on an immense scale. The benefits were uneven, and the carbon cost accumulated in the atmosphere.",
    keyFact: "From 1990 to 2015, the estimated extreme-poverty rate fell from roughly 36% to 10%, while internet access spread from millions to billions.",
    poverty: 36,
    lifeExpectancy: 64,
    childMortality: 93,
    literacy: 75,
    whatIf: "What if the Kyoto Protocol had been enforced in 1997? Thirty years of carbon emissions could have been cut in half.",
  },
  {
    hook: "In 2015, every UN member state signed the same list of unfinished work.",
    context: "The Sustainable Development Goals turned broad promises into 169 targets. Ten years later, the ledger shows gains in health, schooling, electricity, and connectivity alongside stalled poverty reduction, conflict, and climate disruption.",
    keyFact: "The UN's 2025 assessment found only 35% of measurable targets on track or making moderate progress.",
    poverty: 10,
    lifeExpectancy: 72,
    childMortality: 43,
    literacy: 86,
  },
];

export interface Era {
  id: string;
  label: string;
  start: number;
  end: number;
  description: string;
}

export const ERAS: Era[] = [
  {
    id: "age-of-want",
    label: "The Age of Want",
    start: 1800,
    end: 1849,
    description:
      "Nearly nine in ten people lived in extreme poverty. Childhood was a sentence of risk. The world was dark, hungry, and brief. Progress existed as an idea, not yet a reality.",
  },
  {
    id: "age-of-industry",
    label: "The Age of Industry",
    start: 1850,
    end: 1899,
    description:
      "Steam and steel began to reshape the world. Sanitation crept into cities. Literacy stirred. But the benefits were unequally felt, and the foundations of environmental crisis were laid.",
  },
  {
    id: "age-of-catastrophe",
    label: "The Age of Catastrophe",
    start: 1900,
    end: 1944,
    description:
      "Two world wars, a pandemic that killed more than any war, and famines that scarred continents. Yet even in humanity's darkest half-century, the seeds of global cooperation were sown.",
  },
  {
    id: "age-of-recovery",
    label: "The Age of Recovery",
    start: 1945,
    end: 1979,
    description:
      "Decolonization, the green revolution, vaccines, and the birth of the modern human rights framework. Poverty began its long retreat. Life expectancy rose dramatically across the world.",
  },
  {
    id: "age-of-acceleration",
    label: "The Age of Acceleration",
    start: 1980,
    end: 2014,
    description:
      "Globalization, the digital revolution, and unprecedented economic growth lifted billions from poverty. But inequality and environmental degradation emerged as the new frontiers of crisis.",
  },
  {
    id: "age-of-goals",
    label: "The Age of Goals",
    start: 2015,
    end: 2026,
    description:
      "The UN Sustainable Development Goals codified humanity's collective ambition. Eradicating extreme poverty, ending preventable child deaths, and healing the planet are no longer dreams but targets with deadlines.",
  },
];

export const getEraForYear = (year: number): Era | null => {
  for (const era of ERAS) {
    if (year >= era.start && year <= era.end) return era;
  }
  return null;
};

export interface EraPalette {
  fogTop: string;
  fogMid: string;
  fogBottom: string;
  fogEdge: string;
  particleCore: string;
  particleGlow: string;
  atmosphereTint: string;
  rupturePrimary: string;
  ruptureSecondary: string;
  driftSpeed: number;
  flickerIntensity: number;
}

const ERA_PALETTES: Record<string, EraPalette> = {
  "age-of-want": {
    fogTop: "rgba(45, 16, 16,",
    fogMid: "rgba(55, 20, 20,",
    fogBottom: "rgba(26, 8, 8,",
    fogEdge: "rgba(196, 149, 106,",
    particleCore: "rgba(208, 200, 176,",
    particleGlow: "rgba(180, 170, 145,",
    atmosphereTint: "rgba(30, 20, 12,",
    rupturePrimary: "rgba(61, 0, 0,",
    ruptureSecondary: "rgba(139, 26, 26,",
    driftSpeed: 0.3,
    flickerIntensity: 0.15,
  },
  "age-of-industry": {
    fogTop: "rgba(40, 20, 10,",
    fogMid: "rgba(50, 28, 14,",
    fogBottom: "rgba(26, 12, 6,",
    fogEdge: "rgba(212, 175, 55,",
    particleCore: "rgba(232, 213, 163,",
    particleGlow: "rgba(245, 200, 140,",
    atmosphereTint: "rgba(20, 16, 10,",
    rupturePrimary: "rgba(61, 0, 0,",
    ruptureSecondary: "rgba(139, 26, 26,",
    driftSpeed: 0.4,
    flickerIntensity: 0.1,
  },
  "age-of-catastrophe": {
    fogTop: "rgba(50, 10, 10,",
    fogMid: "rgba(60, 14, 14,",
    fogBottom: "rgba(30, 6, 6,",
    fogEdge: "rgba(139, 26, 26,",
    particleCore: "rgba(168, 144, 112,",
    particleGlow: "rgba(140, 120, 95,",
    atmosphereTint: "rgba(15, 8, 8,",
    rupturePrimary: "rgba(80, 0, 0,",
    ruptureSecondary: "rgba(192, 57, 43,",
    driftSpeed: 0.6,
    flickerIntensity: 0.4,
  },
  "age-of-recovery": {
    fogTop: "rgba(20, 35, 20,",
    fogMid: "rgba(25, 40, 25,",
    fogBottom: "rgba(12, 20, 12,",
    fogEdge: "rgba(74, 124, 89,",
    particleCore: "rgba(245, 230, 200,",
    particleGlow: "rgba(127, 186, 148,",
    atmosphereTint: "rgba(10, 18, 10,",
    rupturePrimary: "rgba(61, 0, 0,",
    ruptureSecondary: "rgba(139, 26, 26,",
    driftSpeed: 0.35,
    flickerIntensity: 0.05,
  },
  "age-of-acceleration": {
    fogTop: "rgba(15, 25, 30,",
    fogMid: "rgba(18, 30, 35,",
    fogBottom: "rgba(10, 15, 20,",
    fogEdge: "rgba(168, 200, 232,",
    particleCore: "rgba(240, 232, 216,",
    particleGlow: "rgba(168, 200, 232,",
    atmosphereTint: "rgba(8, 12, 18,",
    rupturePrimary: "rgba(61, 0, 0,",
    ruptureSecondary: "rgba(139, 26, 26,",
    driftSpeed: 0.25,
    flickerIntensity: 0.03,
  },
  "age-of-goals": {
    fogTop: "rgba(10, 20, 28,",
    fogMid: "rgba(12, 25, 32,",
    fogBottom: "rgba(6, 12, 18,",
    fogEdge: "rgba(168, 200, 232,",
    particleCore: "rgba(245, 240, 225,",
    particleGlow: "rgba(200, 220, 240,",
    atmosphereTint: "rgba(6, 10, 16,",
    rupturePrimary: "rgba(61, 0, 0,",
    ruptureSecondary: "rgba(139, 26, 26,",
    driftSpeed: 0.2,
    flickerIntensity: 0.02,
  },
};

const DEFAULT_PALETTE: EraPalette = ERA_PALETTES["age-of-want"];

export const getEraPalette = (eraId: string | null): EraPalette => {
  if (!eraId) return DEFAULT_PALETTE;
  return ERA_PALETTES[eraId] ?? DEFAULT_PALETTE;
};
