"use client";

import { useRef, useEffect, useState } from "react";
import {
  START_YEAR,
  LERP_RATE,
  getEraForYear,
  getEraPalette,
} from "@/lib/timeline-config";
import { getFogHeight } from "./phenomena/PovertyFog";
import { drawPovertyFog } from "./phenomena/PovertyFog";
import { drawLiteracyText } from "./phenomena/LiteracyText";
import { drawEraBackground } from "./phenomena/EraBackground";
import { drawAtmosphericDarkness } from "./phenomena/AtmosphericDarkness";
import { drawHistoricalRupture } from "./phenomena/HistoricalRupture";
import { soundEngine } from "@/lib/sound-engine";
import EraNarrative from "./panels/EraNarrative";
import EventCallout from "./panels/EventCallout";
import eventsData from "@/lib/data/events.json";
import styles from "./TimelineContainer.module.css";

const ERA_SOUND_MAP: Record<string, "want" | "industry" | "catastrophe" | "recovery" | "acceleration" | "goals"> = {
  "age-of-want": "want",
  "age-of-industry": "industry",
  "age-of-catastrophe": "catastrophe",
  "age-of-recovery": "recovery",
  "age-of-acceleration": "acceleration",
  "age-of-goals": "goals",
};

interface TimelineContainerProps {
  displayYear: number;
  milestoneIndex: number;
  onAdvance: () => void;
  onRetreat: () => void;
  canAdvance: boolean;
  canRetreat: boolean;
}

export default function TimelineContainer({
  displayYear: targetYear,
  milestoneIndex,
  onAdvance,
  onRetreat,
  canAdvance,
  canRetreat,
}: TimelineContainerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const displayYearRef = useRef(START_YEAR);
  const targetYearRef = useRef(START_YEAR);
  const lastYearRef = useRef(-1);
  const lastEraRef = useRef<string | null>(null);
  const cursorRef = useRef({ x: -999, y: -999 });

  const [uiYear, setUiYear] = useState(START_YEAR);

  targetYearRef.current = targetYear;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let isRunning = true;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseLeave = () => {
      cursorRef.current = { x: -999, y: -999 };
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const animate = (timestamp: number) => {
      if (!isRunning) return;
      const time = timestamp / 1000;

      const gap = Math.abs(targetYearRef.current - displayYearRef.current);
      const rate = gap > 5 ? 0.025 : LERP_RATE;
      displayYearRef.current +=
        (targetYearRef.current - displayYearRef.current) * rate;

      const currentYear = displayYearRef.current;
      const roundYear = Math.round(currentYear);

      if (roundYear !== lastYearRef.current) {
        lastYearRef.current = roundYear;
        setUiYear(roundYear);
      }

      const w = window.innerWidth;
      const h = window.innerHeight;
      const { x: cx, y: cy } = cursorRef.current;

      ctx.clearRect(0, 0, w, h);

      const fogHeight = getFogHeight(currentYear, h);

      const era = getEraForYear(roundYear);
      const palette = getEraPalette(era?.id ?? null);

      if (era && era.id !== lastEraRef.current) {
        lastEraRef.current = era.id;
        if (!soundEngine.isMuted()) {
          const soundEra = ERA_SOUND_MAP[era.id];
          if (soundEra) soundEngine.playEra(soundEra);
        }
      }

      drawEraBackground({ ctx, displayYear: currentYear, width: w, height: h, palette });
      drawAtmosphericDarkness({ ctx, displayYear: currentYear, time, width: w, height: h, palette, strength: 1 });
      drawPovertyFog({
        ctx, displayYear: currentYear, time, width: w, height: h,
        cursorX: cx, cursorY: cy, palette, strength: 1,
      });
      drawHistoricalRupture({ ctx, displayYear: currentYear, time, width: w, height: h, fogHeight, palette, strength: 1 });
      drawLiteracyText({ ctx, displayYear: currentYear, width: w, height: h, fogHeight, strength: 1 });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationId);
      soundEngine.stopAll();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <EraNarrative
        displayYear={uiYear}
        milestoneIndex={milestoneIndex}
        canAdvance={canAdvance}
        canRetreat={canRetreat}
        onAdvance={onAdvance}
        onRetreat={onRetreat}
      />

      <EventCallout displayYear={uiYear} events={eventsData} />
    </div>
  );
}
