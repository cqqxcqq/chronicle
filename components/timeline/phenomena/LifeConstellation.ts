import { linearInterpolate, DataPoint } from "@/lib/interpolate";
import mortalityData from "@/lib/data/mortality.json";
import { MAX_PARTICLES } from "@/lib/timeline-config";
import type { EraPalette } from "@/lib/timeline-config";

interface DrawConstellationParams {
  ctx: CanvasRenderingContext2D;
  displayYear: number;
  time: number;
  width: number;
  height: number;
  fogHeight: number;
  cursorX?: number;
  cursorY?: number;
  palette: EraPalette;
  strength: number;
}

const mortality = mortalityData as DataPoint[];

const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

interface Particle {
  baseX: number;
  baseY: number;
  seed: number;
  driftFreqX: number;
  driftFreqY: number;
  driftPhaseX: number;
  driftPhaseY: number;
  amplitude: number;
  size: number;
  repelX: number;
  repelY: number;
}

const particles: Particle[] = [];

if (typeof window !== "undefined") {
  for (let i = 0; i < MAX_PARTICLES; i++) {
    particles.push({
      baseX: seededRandom(i * 3 + 1),
      baseY: seededRandom(i * 3 + 2),
      seed: i * 3 + 5,
      driftFreqX: 0.2 + seededRandom(i * 7 + 1) * 0.5,
      driftFreqY: 0.2 + seededRandom(i * 7 + 2) * 0.5,
      driftPhaseX: seededRandom(i * 7 + 3) * Math.PI * 2,
      driftPhaseY: seededRandom(i * 7 + 4) * Math.PI * 2,
      amplitude: 5 + seededRandom(i * 7 + 5) * 15,
      size: 1 + seededRandom(i * 11 + 1) * 1.5,
      repelX: 0,
      repelY: 0,
    });
  }
}

const REPEL_RADIUS = 150;
const REPEL_FORCE = 120;

export const drawLifeConstellation = ({
  ctx,
  displayYear,
  time,
  width,
  height,
  fogHeight,
  cursorX = -999,
  cursorY = -999,
  palette,
  strength,
}: DrawConstellationParams) => {
  const mortalityRate = linearInterpolate(mortality, displayYear);
  const survivalRate = 1 - mortalityRate / 1000;
  const visibleCount = Math.round(MAX_PARTICLES * Math.max(0, survivalRate));

  const topMargin = height * 0.02;
  const availableHeight = height * 0.96;
  const availableWidth = width;

  ctx.save();

  for (let i = 0; i < MAX_PARTICLES; i++) {
    const p = particles[i];
    const isVisible = i < visibleCount;

    const flickerThreshold = 0.7 + palette.flickerIntensity * 0.6;
    const flicker = Math.sin(time * (1.2 + palette.driftSpeed) + p.seed) > flickerThreshold ? 0.3 : 0;
    const alpha = (isVisible ? 0.8 : 0) * (1 - flicker) * strength;

    if (alpha < 0.01) continue;

    const dx = Math.sin(time * p.driftFreqX * palette.driftSpeed + p.driftPhaseX) * p.amplitude;
    const dy = Math.cos(time * p.driftFreqY * palette.driftSpeed + p.driftPhaseY) * p.amplitude;

    let baseX = p.baseX * availableWidth + dx;
    let baseY = topMargin + p.baseY * availableHeight + dy;

    if (cursorX >= 0 && cursorY >= 0) {
      const distX = baseX - cursorX;
      const distY = baseY - cursorY;
      const dist = Math.sqrt(distX * distX + distY * distY);

      if (dist < REPEL_RADIUS && dist > 0) {
        const force = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
        const normX = distX / dist;
        const normY = distY / dist;

        p.repelX += (normX * force - p.repelX) * 0.1;
        p.repelY += (normY * force - p.repelY) * 0.1;
      } else {
        p.repelX *= 0.95;
        p.repelY *= 0.95;
      }

      if (Math.abs(p.repelX) > 0.5 || Math.abs(p.repelY) > 0.5) {
        baseX += p.repelX;
        baseY += p.repelY;
      }
    }

    ctx.globalAlpha = alpha * 0.3;
    ctx.fillStyle = `${palette.particleGlow} 1)`;
    ctx.fillRect(baseX - p.size * 2, baseY - p.size * 2, p.size * 4, p.size * 4);

    ctx.globalAlpha = alpha;
    ctx.fillStyle = `${palette.particleCore} 1)`;
    ctx.fillRect(baseX - p.size * 0.5, baseY - p.size * 0.5, p.size, p.size);
  }

  ctx.restore();
};
