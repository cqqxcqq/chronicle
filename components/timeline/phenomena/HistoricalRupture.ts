import conflictsData from "@/lib/data/conflicts.json";
import type { EraPalette } from "@/lib/timeline-config";

interface DrawRuptureParams {
  ctx: CanvasRenderingContext2D;
  displayYear: number;
  time: number;
  width: number;
  height: number;
  fogHeight: number;
  palette: EraPalette;
  strength: number;
}

interface Conflict {
  year: number;
  name: string;
  type: string;
  severity: number;
  description: string;
}

const conflicts = conflictsData as Conflict[];

const getActiveConflict = (
  year: number
): { conflict: Conflict; intensity: number } | null => {
  for (const c of conflicts) {
    const dist = Math.abs(year - c.year);
    if (dist <= 2) {
      const intensity = Math.max(0, 1 - dist / 2);
      return { conflict: c, intensity };
    }
  }
  return null;
};

export const drawHistoricalRupture = ({
  ctx,
  displayYear,
  time,
  width,
  height,
  fogHeight,
  palette,
  strength,
}: DrawRuptureParams) => {
  const active = getActiveConflict(displayYear);
  if (!active) return;

  const { conflict, intensity } = active;
  const severityFactor = conflict.severity / 10 * strength;

  ctx.save();

  const centerX = width * 0.5;
  const segments = 20;

  ctx.beginPath();

  const sway = Math.sin(time * 2) * 10 * (1 + palette.flickerIntensity);
  const xPos = centerX + sway;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = t * (height - fogHeight * 0.5);

    const jitter =
      Math.sin(i * 1.3 + time * 0.5) * 8 * severityFactor +
      Math.sin(i * 2.7 + time * 0.3) * 4 * severityFactor +
      Math.cos(i * 1.1 + time * 0.7) * 3 * severityFactor;

    const lineX = xPos + jitter * intensity;

    if (i === 0) ctx.moveTo(lineX, y);
    else ctx.lineTo(lineX, y);
  }

  ctx.strokeStyle = `${palette.rupturePrimary} ${intensity * 0.8 * strength})`;
  ctx.lineWidth = 4 * intensity * strength;
  ctx.stroke();

  ctx.beginPath();
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = t * (height - fogHeight * 0.5);
    const jitter =
      Math.sin(i * 1.3 + time * 0.5) * 8 * severityFactor +
      Math.sin(i * 2.7 + time * 0.3) * 4 * severityFactor +
      Math.cos(i * 1.1 + time * 0.7) * 3 * severityFactor;
    const lineX = xPos + jitter * intensity;
    if (i === 0) ctx.moveTo(lineX + 8, y);
    else ctx.lineTo(lineX + 8, y);
  }

  ctx.strokeStyle = `${palette.ruptureSecondary} ${intensity * 0.4 * strength})`;
  ctx.lineWidth = 1.5 * intensity * strength;
  ctx.stroke();

  ctx.restore();

  return active;
};
