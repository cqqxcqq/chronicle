import { ERAS } from "@/lib/timeline-config";
import type { EraPalette } from "@/lib/timeline-config";

interface DrawBackgroundParams {
  ctx: CanvasRenderingContext2D;
  displayYear: number;
  width: number;
  height: number;
  palette: EraPalette;
}

const IMAGE_FILES: Record<string, string> = {
  "age-of-want": "/age-of-want.jpg",
  "age-of-industry": "/age-of-industry.jpg",
  "age-of-catastrophe": "/age-of-catastrophe.jpg",
  "age-of-recovery": "/age-of-recovery.jpg",
  "age-of-acceleration": "/age-of-acceleration.jpg",
  "age-of-goals": "/age-of-goals.jpg",
};

const TINT_COLORS: Record<string, string> = {
  "age-of-want": "rgba(30, 18, 10, 0.45)",
  "age-of-industry": "rgba(25, 20, 12, 0.42)",
  "age-of-catastrophe": "rgba(20, 8, 8, 0.48)",
  "age-of-recovery": "rgba(10, 18, 12, 0.44)",
  "age-of-acceleration": "rgba(8, 12, 18, 0.43)",
  "age-of-goals": "rgba(6, 10, 16, 0.42)",
};

const loadedImages: Record<string, HTMLImageElement> = {};
const attemptedLoads: Record<string, boolean> = {};

function loadImage(src: string): HTMLImageElement | null {
  if (loadedImages[src]) return loadedImages[src];
  if (attemptedLoads[src]) return null;

  attemptedLoads[src] = true;
  const img = new Image();
  img.src = src;
  img.onload = () => { loadedImages[src] = img; };
  return null;
}

export const drawEraBackground = ({
  ctx,
  displayYear,
  width,
  height,
  palette,
}: DrawBackgroundParams) => {
  const era = ERAS.find((e) => displayYear >= e.start && displayYear <= e.end);
  if (!era) return;

  const img = loadImage(IMAGE_FILES[era.id] ?? "");

  if (img && img.complete && img.naturalWidth > 0) {
    ctx.save();

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;
    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (imgRatio > canvasRatio) {
      drawH = height;
      drawW = height * imgRatio;
      drawX = (width - drawW) / 2;
      drawY = 0;
    } else {
      drawW = width;
      drawH = width / imgRatio;
      drawX = 0;
      drawY = (height - drawH) / 2;
    }

    ctx.globalAlpha = 0.65;
    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    ctx.globalAlpha = 0.45;
    ctx.fillStyle = TINT_COLORS[era.id] ?? "rgba(8, 6, 4, 0.45)";
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  } else {
    ctx.save();
    ctx.fillStyle = TINT_COLORS[era.id] ?? "rgba(8, 6, 4, 0.5)";
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
};
