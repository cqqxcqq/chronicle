export const START_YEAR = 1800;
export const END_YEAR = 2024;
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
  { index: 1, year: 1850, label: "The Age of Reform", description: "Steam and steel began to reshape the world. Sanitation crept into cities. Literacy stirred." },
  { index: 2, year: 1900, label: "The Age of Progress", description: "Science, industry, and public health accelerated. Life expectancy rose. The world grew more connected." },
  { index: 3, year: 1945, label: "The Age of Catastrophe", description: "Two world wars, a pandemic, and famines scarred continents. Yet from the ruins, global cooperation was born." },
  { index: 4, year: 1970, label: "The Age of Recovery", description: "Decolonization, vaccines, the green revolution. Poverty began its long retreat. Human rights became law." },
  { index: 5, year: 2015, label: "The Age of Goals", description: "The UN SDGs codified humanity's collective ambition. Poverty, disease, and ignorance are no longer inevitable." },
];

export const getMilestoneBounds = (index: number) => ({
  startYear: MILESTONES[index].year,
  endYear: index < MILESTONES.length - 1 ? MILESTONES[index + 1].year : 2024,
});

export interface MilestoneStat {
  hook: string;
  context: string;
  keyFact: string;
  poverty: number;
  lifeExpectancy: number;
  childMortality: number;
  literacy: number;
}

export const MILESTONE_STATS: MilestoneStat[] = [
  {
    hook: "Nine in ten were born into poverty. The average life was shorter than a single loan.",
    context: "The world's population was 1 billion. Most humans farmed with tools unchanged since the Bronze Age. Childhood was a gamble — nearly half of all children died before age five. The idea that life could get better for the next generation was not yet a universal belief.",
    keyFact: "In 1800, only 12% of the world could read. Electricity was a parlor trick. The fastest transportation was a horse.",
    poverty: 89,
    lifeExpectancy: 29,
    childMortality: 460,
    literacy: 12,
  },
  {
    hook: "The first factories stirred. Sanitation crept into cities. But progress was a privilege.",
    context: "Steam power transformed manufacturing. Railroads stitched continents together. But in the slums of Manchester and the favelas of Rio, workers lived in conditions worse than medieval peasants. The gains of industry flowed upward.",
    keyFact: "By 1850, life expectancy in industrial cities was actually lower than in rural areas. Cholera killed more people than any war.",
    poverty: 85,
    lifeExpectancy: 30,
    childMortality: 375,
    literacy: 17,
  },
  {
    hook: "Science conquered disease. Industry connected continents. But war followed close behind.",
    context: "Germ theory, vaccines, and modern surgery began to save lives on an industrial scale. The telegraph, telephone, and radio collapsed distance. But the same industrial capacity that built hospitals also built battleships.",
    keyFact: "In 1918, the Spanish Flu killed 50 million people in 24 weeks — more than World War I had killed in four years.",
    poverty: 82,
    lifeExpectancy: 32,
    childMortality: 360,
    literacy: 21,
  },
  {
    hook: "Two world wars. A pandemic. Famines that scarred continents. From the ruins, cooperation.",
    context: "The deadliest century in human history killed over 100 million people through war, famine, and disease. Yet from the ashes, the United Nations, the Universal Declaration of Human Rights, and the Bretton Woods system were born. Humanity decided to build institutions that would make such catastrophe impossible.",
    keyFact: "Between 1939 and 1945, more people died each year than in the entire Napoleonic Wars. Yet life expectancy rose faster after 1945 than at any point in history.",
    poverty: 60,
    lifeExpectancy: 45,
    childMortality: 215,
    literacy: 50,
  },
  {
    hook: "Vaccines, green fields, and human rights. For the first time, poverty retreated on every front.",
    context: "The Green Revolution fed billions. Smallpox was eradicated. The Civil Rights Act, the fall of apartheid, and the end of the Cold War reshaped the political map. For the first time in history, fewer people were hungry each year.",
    keyFact: "Norman Borlaug's high-yield wheat varieties saved an estimated billion lives. Child mortality dropped from 215 to 125 per 1,000 in just 30 years.",
    poverty: 38,
    lifeExpectancy: 60,
    childMortality: 125,
    literacy: 65,
  },
  {
    hook: "The world agreed on a plan to end poverty, heal the planet, and leave no one behind.",
    context: "The Sustainable Development Goals represent humanity's most ambitious compact: 17 goals, 169 targets, one deadline. Progress is real but uneven. The question is no longer whether poverty can be ended, but whether we will choose to end it.",
    keyFact: "Since 2000, extreme poverty has fallen from 29% to 10%. Child mortality has dropped from 76 to 37 per 1,000. Literacy has risen from 82% to 87%.",
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
    end: 1949,
    description:
      "Two world wars, a pandemic that killed more than any war, and famines that scarred continents. Yet even in humanity's darkest half-century, the seeds of global cooperation were sown.",
  },
  {
    id: "age-of-recovery",
    label: "The Age of Recovery",
    start: 1950,
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
    end: 2024,
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
