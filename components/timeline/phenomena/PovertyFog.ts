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
  const fogHeight = getFogHeight(displayYear, height);
  const boundaryY = height - fogHeight;
  const povertyRate = linearInterpolate(data, displayYear) / 100;

  const layers = 5;
  for (let l = 0; l < layers; l++) {
    const layerOffset = l * (fogHeight * 0.05);
    const waveAmp = fogHeight * (0.04 + l * 0.015);

    ctx.beginPath();
    ctx.moveTo(0, height);

    for (let x = 0; x <= width; x += 2) {
      const wave1 = Math.sin(x * 0.006 + time * 0.25 + l * 1.7) * waveAmp;
      const wave2 = Math.sin(x * 0.013 + time * 0.45 + l * 2.3) * (waveAmp * 0.7);
      const wave3 = Math.sin(x * 0.003 - time * 0.18 + l * 0.9) * (waveAmp * 0.5);
      const wave4 = Math.sin(x * 0.022 + time * 0.35 + l * 3.1) * (waveAmp * 0.3);

      const y = boundaryY - layerOffset + wave1 + wave2 + wave3 + wave4;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(width, height);
    ctx.closePath();

    const alpha = (0.15 + l * 0.18) * strength;
    const gradient = ctx.createLinearGradient(0, boundaryY - layerOffset, 0, height);
    gradient.addColorStop(0, `${palette.fogTop} 0)`);
    gradient.addColorStop(0.1, `${palette.fogMid} ${0.15 * alpha})`);
    gradient.addColorStop(0.3, `${palette.fogMid} ${0.5 * alpha})`);
    gradient.addColorStop(0.6, `${palette.fogBottom} ${0.8 * alpha})`);
    gradient.addColorStop(1, `${palette.fogBottom} ${alpha})`);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  const isCursorInFog =
    cursorY > boundaryY - 20 && cursorY < height && cursorX >= 0 && cursorX <= width;

  if (isCursorInFog) {
    const cursorRadius = 80 + (1 - povertyRate) * 120 / Math.max(0.1, povertyRate + 0.1);
    const edgeSoftness = cursorRadius * 0.6;

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";

    const radialGrad = ctx.createRadialGradient(
      cursorX, cursorY, 0,
      cursorX, cursorY, cursorRadius
    );
    radialGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
    radialGrad.addColorStop(
      edgeSoftness / cursorRadius,
      "rgba(255, 255, 255, 0.5)"
    );
    radialGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = radialGrad;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, cursorRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.beginPath();
  for (let x = 0; x <= width; x += 2) {
    const wave1 = Math.sin(x * 0.006 + time * 0.25) * (fogHeight * 0.04);
    const wave2 = Math.sin(x * 0.013 + time * 0.45) * (fogHeight * 0.028);
    const wave3 = Math.sin(x * 0.003 - time * 0.18) * (fogHeight * 0.02);
    const wave4 = Math.sin(x * 0.022 + time * 0.35) * (fogHeight * 0.012);
    const y = boundaryY + wave1 + wave2 + wave3 + wave4;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  const edgeAlpha = (povertyRate < 0.7
    ? 0.15 + (1 - povertyRate / 0.7) * 0.25
    : 0.08 + (1 - (povertyRate - 0.7) / 0.3) * 0.07) * strength;

  ctx.strokeStyle = `${palette.fogEdge} ${edgeAlpha})`;
  ctx.lineWidth = 2;
  ctx.shadowColor = `${palette.fogEdge} ${edgeAlpha * 0.5})`;
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.shadowBlur = 0;

  if (povertyRate > 0.3) {
    for (let i = 0; i < 60; i++) {
      const seed = i * 7.3 + time * 0.1;
      const px = ((Math.sin(seed * 1.1 + 0.3) * 0.5 + 0.5) * width) % width;
      const pyOffset = Math.sin(seed * 0.7 + 0.5) * 0.5 + 0.5;
      const py = boundaryY + (fogHeight - fogHeight * 0.2) * pyOffset;
      const pSize = 0.5 + Math.sin(seed * 2.3) * 0.5 + 0.5;
      const pAlpha = (0.02 + Math.sin(seed * 1.7 + time) * 0.01 + 0.01) * strength;

      ctx.fillStyle = `${palette.fogMid} ${pAlpha})`;
      ctx.beginPath();
      ctx.arc(px, py, pSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};
