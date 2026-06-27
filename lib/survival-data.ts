export interface SurvivalChoice {
  text: string;
  modifier: number;
  outcome: string;
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
  eraContext: string;
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
      {
        text: "Mother breastfeeds you through famine",
        modifier: 0.10,
        outcome: "Your mother's body was the only medicine. She gave you milk when there was no food. Half of all children had no such mother.",
      },
      {
        text: "Born into a family with clean water",
        modifier: 0.05,
        outcome: "Clean water \u2014 a luxury in 1800. Your family boiled it by habit, not by knowledge. Germ theory was a century away.",
      },
    ],
    eraContext: "Nine in ten people live in extreme poverty. The average life is 29 years. Most humans farm with tools unchanged since the Bronze Age.",
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
      {
        text: "Flee to the countryside to forage",
        modifier: 0.08,
        outcome: "You ate roots and bark for months. Your stomach never stopped aching. But you ate. Millions did not.",
      },
      {
        text: "Share dwindling food with neighbors",
        modifier: 0.03,
        outcome: "You gave away half your food. Your neighbors survived because of you. In 1815, community was the only safety net.",
      },
    ],
    eraContext: "Life expectancy remains 29 years. 85% live in poverty. The industrial revolution has begun but its benefits have not reached you.",
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
      {
        text: "Seek out a barber-surgeon for treatment",
        modifier: 0.05,
        outcome: "The barber-surgeon bled you with a rusty lancet. Infection spread through your arm. You survived \u2014 barely. Most did not.",
      },
      {
        text: "Rest and drink boiled water",
        modifier: 0.10,
        outcome: "Boiled water saved your life. You did not know why. No one did. The word 'bacteria' would not be coined for another 50 years.",
      },
    ],
    eraContext: "The world is transforming \u2014 railroads, factories, telegraphs \u2014 but progress has not reached the poor.",
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
      {
        text: "Move to a quieter rural life",
        modifier: 0.08,
        outcome: "You left the city before the cholera returned. The countryside was quiet. The war was loud. You chose silence.",
      },
      {
        text: "Stay in the city near a hospital",
        modifier: 0.04,
        outcome: "The hospital had no antibiotics, no anesthesia, no hope. But it had a roof. In 1860, that was enough.",
      },
    ],
    eraContext: "Darwin publishes On the Origin of Species. The telephone is invented. The American Civil War rages.",
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
    context: "The year 1900. You are 100 years old \u2014 an impossibility. But the 20th century is the bloodiest in history.",
    image: "/newcentury-1900.jpg",
    imageAlt: "Turn of the century city with early automobiles, 1900",
    choices: [
      {
        text: "Retreat from public life entirely",
        modifier: 0.06,
        outcome: "You watched the world change from behind glass. Automobiles. Airplanes. Electricity. You had seen it all \u2014 and feared what came next.",
      },
      {
        text: "Document your story for posterity",
        modifier: 0.02,
        outcome: "You wrote by candlelight. Your words would outlive you. In a century of war, testimony became the rarest form of survival.",
      },
    ],
    eraContext: "X-rays. Radio. The airplane. And soon: world war, pandemic, and the deadliest half-century in history.",
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
      {
        text: "Isolate yourself from all contact",
        modifier: 0.06,
        outcome: "You locked the door and did not open it for months. The silence outside was worse than the coughing. When you emerged, the world had changed.",
      },
      {
        text: "Trust your ancient immune system",
        modifier: 0.01,
        outcome: "Your body fought a war it had no memory of winning. At 118, survival is not courage \u2014 it is defiance.",
      },
    ],
    eraContext: "World War I ends as the flu peaks. 20 million soldiers dead, 50 million civilians. The old order crumbles.",
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
      {
        text: "Flee to the countryside before the bombs",
        modifier: 0.04,
        outcome: "You ran. The city burned behind you. You did not look back. In 1945, running was the only form of hope left.",
      },
      {
        text: "Volunteer to help rebuild",
        modifier: 0.01,
        outcome: "You lifted rubble with your bare hands. The buildings were gone. The people were not. That was enough.",
      },
    ],
    eraContext: "The United Nations is born. The Marshall Plan rebuilds Europe. Penicillin saves millions.",
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
    context: "The year 2000. You are 200 years old \u2014 the oldest human who has ever lived. The internet connects the world.",
    image: "/digital-2000.jpg",
    imageAlt: "Early internet cafe with dial-up computers, 2000",
    choices: [
      {
        text: "Embrace modern medicine fully",
        modifier: 0.03,
        outcome: "Antibiotics. Vaccines. Surgery that did not kill you. You lived to see medicine become a science instead of a gamble.",
      },
      {
        text: "Rely on traditional remedies",
        modifier: 0.00,
        outcome: "Herbs and prayers. They sustained you for 200 years. Science sustained the other 6 billion.",
      },
    ],
    eraContext: "Extreme poverty has fallen from 89% to 29%. Life expectancy is 68. Smallpox is eradicated.",
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
      {
        text: "Write your memoirs for the world",
        modifier: 0.01,
        outcome: "Your words traveled faster than light. In 1800, your story would have died with you. In 2026, it reaches millions.",
      },
      {
        text: "Spend your last days in peace",
        modifier: 0.02,
        outcome: "You closed your eyes. The world outside was louder, brighter, kinder than the one you were born into. That is enough.",
      },
    ],
    eraContext: "The SDGs are humanity's plan to finish what two centuries began.",
    sdgProgress: [
      { sdg: "SDG 1", label: "poverty", from: 10, to: 8.5, suffix: "%" },
      { sdg: "SDG 3", label: "life expectancy", from: 72, to: 73, suffix: " yr" },
      { sdg: "SDG 3", label: "child mortality", from: 43, to: 37, suffix: "" },
      { sdg: "SDG 4", label: "literacy", from: 86, to: 87, suffix: "%" },
    ]
  }
];
