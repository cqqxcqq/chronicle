import { linearInterpolate, DataPoint } from "@/lib/interpolate";
import co2Data from "@/lib/data/co2.json";
import type { EraPalette } from "@/lib/timeline-config";

interface DrawAtmosphereParams {
  ctx: CanvasRenderingContext2D;
  displayYear: number;
  time: number;
  width: number;
  height: number;
  palette: EraPalette;
  strength: number;
}

const data = co2Data as DataPoint[];

export const drawAtmosphericDarkness = ({
  ctx,
  displayYear,
  time,
  width,
  height,
  palette,
  strength,
}: DrawAtmosphereParams) => {
  const co2Emissions = linearInterpolate(data, displayYear);

  const maxOpacity = 0.18;
  const baseOpacity = Math.min(maxOpacity, maxOpacity * (co2Emissions / 40)) * strength;

  if (baseOpacity < 0.005) return;

  const breathFrequency = 0.5 + (co2Emissions / 40) * 1.5;
  const breathDepth = (co2Emissions / 40) * 0.02;
  const breath = 1 + Math.sin(time * breathFrequency) * breathDepth;
  const opacity = Math.min(0.2, baseOpacity * breath);

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = `${palette.atmosphereTint} 1)`;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
};
