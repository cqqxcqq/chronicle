import { linearInterpolate, DataPoint } from "@/lib/interpolate";
import literacyData from "@/lib/data/literacy.json";

interface DrawLiteracyParams {
  ctx: CanvasRenderingContext2D;
  displayYear: number;
  width: number;
  height: number;
  fogHeight: number;
  strength: number;
}

const data = literacyData as DataPoint[];

const literature = [
  "To be, or not to be, that is the question",
  "For every action there is an equal and opposite reaction",
  "I am the master of my fate, I am the captain of my soul",
  "All human beings are born free and equal in dignity and rights",
  "It was the best of times, it was the worst of times",
  "The only thing we have to fear is fear itself",
  "I think, therefore I am",
  "We hold these truths to be self-evident",
  "The unexamined life is not worth living",
  "That which does not kill us makes us stronger",
  "Knowledge is power",
  "Injustice anywhere is a threat to justice everywhere",
  "The arc of the moral universe is long, but it bends toward justice",
  "Nothing in life is to be feared, it is only to be understood",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit",
  "The beginning is the most important part of the work",
  "Science is a way of thinking much more than it is a body of knowledge",
  "We shall overcome",
  "The best way to predict the future is to create it",
  "Happiness depends upon ourselves",
  "To improve is to change; to be perfect is to change often",
  "I have a dream",
  "We the peoples of the United Nations",
  "Be the change that you wish to see in the world",
  "Education is the most powerful weapon which you can use to change the world",
  "The child is father of the man",
  "Time is the longest distance between two places",
  "We do not inherit the earth from our ancestors; we borrow it from our children",
  "Darkness cannot drive out darkness; only light can do that",
  "Every child is an artist. The problem is how to remain an artist once we grow up",
  "It is not the strongest of the species that survives, but the most adaptable",
  "The only impossible journey is the one you never begin",
  "Speech is power: speech is to persuade, to convert, to compel",
  "To read is to voyage through time",
  "The more that you read, the more things you will know",
  "A room without books is like a body without a soul",
  "Imagination is more important than knowledge",
  "First they ignore you, then they laugh at you, then they fight you, then you win",
  "We are what we repeatedly do",
  "The mind is everything. What you think you become",
];

let textCache: HTMLCanvasElement | null = null;
let cachedLiteracyRate = -1;
let cachedBlur = -1;

const buildCache = (literacyRate: number, w: number, h: number) => {
  const blurAmount = 4 - literacyRate * 3.5;

  if (
    textCache &&
    textCache.width === w &&
    textCache.height === h &&
    Math.abs(cachedBlur - blurAmount) < 0.1
  ) {
    return;
  }

  cachedBlur = blurAmount;
  cachedLiteracyRate = literacyRate;

  textCache = document.createElement("canvas");
  textCache.width = w;
  textCache.height = h;
  const tc = textCache.getContext("2d")!;

  tc.clearRect(0, 0, w, h);
  tc.filter = `blur(${blurAmount}px)`;
  tc.textBaseline = "middle";
  tc.textAlign = "center";

  const gridCols = 10;
  const gridRows = Math.ceil(literature.length / gridCols);

  for (let i = 0; i < literature.length; i++) {
    const col = i % gridCols;
    const row = Math.floor(i / gridCols);
    const x = ((col + 0.5) / gridCols) * w;
    const y = ((row + 0.5) / gridRows) * h;
    const size = 8 + (i % 7) * 1 + literacyRate * 2;

    tc.font = `${size}px "EB Garamond", serif`;
    tc.fillStyle = `rgba(200, 184, 154, ${0.3 + row / gridRows * 0.4})`;
    tc.fillText(literature[i], x, y);
  }
};

export const drawLiteracyText = ({
  ctx,
  displayYear,
  width,
  height,
  fogHeight,
  strength,
}: DrawLiteracyParams) => {
  const literacyRate = linearInterpolate(data, displayYear) / 100;
  const opacity = (0.04 + literacyRate * 0.08) * strength;

  if (opacity < 0.01) return;

  buildCache(literacyRate, width, height);

  ctx.save();
  ctx.globalAlpha = opacity;

  const clipH = height - fogHeight - height * 0.02;
  ctx.beginPath();
  ctx.rect(0, height * 0.02, width, clipH);
  ctx.clip();

  ctx.drawImage(textCache!, 0, 0, width, height);
  ctx.restore();
};
