export type EvidenceSource = { id: string; title: string; organization: string; url: string; usedFor: string };

export const SOURCES: EvidenceSource[] = [
  { id: "owid-poverty", title: "Global Extreme Poverty", organization: "Our World in Data", url: "https://ourworldindata.org/extreme-poverty-in-brief", usedFor: "Long-run poverty estimates and historical context." },
  { id: "worldbank-2024", title: "Poverty, Prosperity, and Planet Report 2024", organization: "World Bank", url: "https://www.worldbank.org/en/publication/poverty-prosperity-and-planet", usedFor: "The 8.5% extreme-poverty estimate and the current slowdown." },
  { id: "owid-mortality", title: "Child and Infant Mortality", organization: "Our World in Data", url: "https://ourworldindata.org/child-mortality", usedFor: "Long-run under-five mortality estimates." },
  { id: "owid-life", title: "Life Expectancy", organization: "Our World in Data", url: "https://ourworldindata.org/life-expectancy", usedFor: "Historical and modern global life-expectancy series." },
  { id: "owid-literacy", title: "Literacy", organization: "Our World in Data", url: "https://ourworldindata.org/literacy", usedFor: "Historical literacy reconstructions and recent estimates." },
  { id: "un-sdg-2025", title: "The Sustainable Development Goals Report 2025", organization: "United Nations", url: "https://unstats.un.org/sdgs/report/2025/", usedFor: "Current SDG status, inequality, setbacks, and remaining challenges." },
];

export const METHOD_NOTES = [
  "Chronicle is an interpretive educational experience, not a statistical model.",
  "Early global values are historical reconstructions assembled from incomplete records and are shown as rounded approximations.",
  "Values between milestone years are visually interpolated. Interpolated values are storytelling guides, not annual observations.",
  "Extreme poverty depends on the poverty line and price methodology. The modern 8.5% figure uses the World Bank's $2.15-a-day line in 2017 purchasing-power-parity prices.",
  "Global averages can conceal large differences between countries, regions, genders, classes, and communities.",
  "The fictional life in Your Life is a lineage: each generation inherits the memory and choices of the one before it.",
];

export const UNFINISHED_GOALS = [
  { id: "poverty", sdg: "SDG 1", title: "End poverty", fact: "Almost 700 million people still live in extreme poverty, and progress has slowed sharply.", action: "Learn how poverty is measured, support locally accountable relief, and ask who is missing from an average." },
  { id: "health", sdg: "SDG 3", title: "Protect health", fact: "Preventable deaths persist, with access to care still shaped by income and geography.", action: "Support vaccination, primary care, clean water, and evidence-based public-health communication." },
  { id: "education", sdg: "SDG 4", title: "Defend education", fact: "Hundreds of millions of children and young people remain out of school, while learning gaps endure.", action: "Tutor, donate books or devices responsibly, and advocate for inclusive, high-quality public education." },
  { id: "climate", sdg: "SDG 13", title: "Act on climate", fact: "Historical gains are increasingly exposed to heat, disasters, displacement, and food insecurity.", action: "Reduce high-impact emissions where you can and support systemic, fair climate policy." },
];
