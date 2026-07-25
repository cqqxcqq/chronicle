import { linearInterpolate, DataPoint } from "@/lib/interpolate";
import povertyData from "@/lib/data/poverty.json";
import type { EraPalette } from "@/lib/timeline-config";

interface DrawFogParams {
  ctx: CanvasRenderingContext2D;
  displayYear: number;
  time: number;
  width: number;
  height: number;
  cursorX?: number;
  cursorY?: number;
  palette: EraPalette;
  strength: number;
}

const data = povertyData as DataPoint[];

export const getFogHeight = (
  displayYear: number,
  height: number
): number => {
  const povertyRate = linearInterpolate(data, displayYear) / 100;
  const maxFogHeight = height * 0.82;
  const minFogHeight = height * 0.04;
  return minFogHeight + (maxFogHeight - minFogHeight) * povertyRate;
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  baseAlpha: number;
  driftSpeed: number;
  driftPhase: number;
  layer: number;
}

const PARTICLE_COUNT = 280;
const particles: Particle[] = [];

function initParticles(width: number, height: number) {
  particles.length = 0;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const seed = i * 7.31;
    const x = seededRandom(seed) * width;
    const layer = Math.floor(seededRandom(seed + 1) * 4);
    const yBias = seededRandom(seed + 2);
    const baseY = height * 0.45 + yBias * height * 0.55;

    particles.push({
      x,
      y: baseY,
      baseX: x,
      baseY,
      radius: 1 + seededRandom(seed + 3) * 4,
      baseAlpha: 0.08 + seededRandom(seed + 4) * 0.18,
      driftSpeed: 0.15 + seededRandom(seed + 5) * 0.35,
      driftPhase: seededRandom(seed + 6) * Math.PI * 2,
      layer,
    });
  }
}

export const drawPovertyFog = ({
  ctx,
  displayYear,
  time,
  width,
  height,
  cursorX = -999,
  cursorY = -999,
  palette,
  strength,
}: DrawFogParams) => {
  const povertyRate = linearInterpolate(data, displayYear) / 100;
  const fogHeight = getFogHeight(displayYear, height);
  const fogTop = height - fogHeight;

  if (particles.length === 0 || particles[0]?.baseX === undefined) {
    initParticles(width, height);
  }

  const cursorRadius = 100 + (1 - povertyRate) * 80;

  for (let l = 0; l < 4; l++) {
    const layerParticles = particles.filter((p) => p.layer === l);
    const layerAlpha = (0.4 + l * 0.2) * strength;

    for (const p of layerParticles) {
      const drift = Math.sin(time * p.driftSpeed + p.driftPhase);
      const px = p.baseX + drift * 20 + Math.sin(time * 0.3 + p.driftPhase * 2) * 8;
      const py = p.baseY + Math.sin(time * p.driftSpeed * 0.6 + p.driftPhase + 1) * 6;

      if (py < fogTop - 30) continue;

      const distFromTop = (py - fogTop) / fogHeight;
      const verticalFade = Math.min(1, distFromTop * 2.5);
      const edgeFade = Math.max(0, 1 - Math.abs(px / width - 0.5) * 1.2);

      const dx = px - cursorX;
      const dy = py - cursorY;
      const distFromCursor = Math.sqrt(dx * dx + dy * dy);
      const cursorClear = Math.min(1, distFromCursor / cursorRadius);

      const alpha = p.baseAlpha * layerAlpha * verticalFade * edgeFade * cursorClear * povertyRate;
      if (alpha < 0.005) continue;

      const r = parseInt(palette.fogMid.slice(1, 3), 16);
      const g = parseInt(palette.fogMid.slice(3, 5), 16);
      const b = parseInt(palette.fogMid.slice(5, 7), 16);

      ctx.beginPath();
      ctx.arc(px, py, p.radius + Math.sin(time * 0.8 + p.driftPhase) * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.fill();
    }
  }

  const br = parseInt(palette.fogBottom.slice(1, 3), 16);
  const bg = parseInt(palette.fogBottom.slice(3, 5), 16);
  const bb = parseInt(palette.fogBottom.slice(5, 7), 16);

  const bottomGrad = ctx.createLinearGradient(0, height * 0.75, 0, height);
  bottomGrad.addColorStop(0, `rgba(${br}, ${bg}, ${bb}, 0)`);
  bottomGrad.addColorStop(0.5, `rgba(${br}, ${bg}, ${bb}, ${0.15 * povertyRate * strength})`);
  bottomGrad.addColorStop(1, `rgba(${br}, ${bg}, ${bb}, ${0.45 * povertyRate * strength})`);
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, height * 0.75, width, height * 0.25);
};
