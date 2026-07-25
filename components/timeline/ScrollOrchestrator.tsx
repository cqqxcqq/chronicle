"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { MILESTONES, START_YEAR, END_YEAR } from "@/lib/timeline-config";
import styles from "./ScrollOrchestrator.module.css";

export interface ScrollContext {
  displayYear: number;
  milestoneIndex: number;
  canAdvance: boolean;
  canRetreat: boolean;
  onYearChange: (year: number) => void;
  onSnapToMilestone: (index: number) => void;
}

interface ScrollOrchestratorProps {
  children: (ctx: ScrollContext) => React.ReactNode;
}

const SCROLL_SENSITIVITY = 0.35;

function findMilestoneAtYear(year: number): number {
  for (let i = MILESTONES.length - 1; i >= 0; i--) {
    if (year >= MILESTONES[i].year) return i;
  }
  return 0;
}

export default function ScrollOrchestrator({
  children,
}: ScrollOrchestratorProps) {
  const [freeYear, setFreeYear] = useState(START_YEAR);
  const freeYearRef = useRef(START_YEAR);
  const targetSnapRef = useRef<number | null>(null);
  const snapAnimRef = useRef<number | null>(null);

  const milestoneIndex = findMilestoneAtYear(freeYear);
  const canAdvance = milestoneIndex < MILESTONES.length - 1;
  const canRetreat = milestoneIndex > 0;

  const onYearChange = useCallback((year: number) => {
    const clamped = Math.max(START_YEAR, Math.min(END_YEAR, year));
    freeYearRef.current = clamped;
    setFreeYear(clamped);
    targetSnapRef.current = null;
    if (snapAnimRef.current) {
      cancelAnimationFrame(snapAnimRef.current);
      snapAnimRef.current = null;
    }
  }, []);

  const onSnapToMilestone = useCallback((index: number) => {
    const target = MILESTONES[index].year;
    targetSnapRef.current = target;

    const animate = () => {
      const current = freeYearRef.current;
      const diff = targetSnapRef.current! - current;
      if (Math.abs(diff) < 0.5) {
        freeYearRef.current = targetSnapRef.current!;
        setFreeYear(targetSnapRef.current!);
        snapAnimRef.current = null;
        return;
      }
      const next = current + diff * 0.12;
      freeYearRef.current = next;
      setFreeYear(next);
      snapAnimRef.current = requestAnimationFrame(animate);
    };

    if (snapAnimRef.current) cancelAnimationFrame(snapAnimRef.current);
    snapAnimRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
      const yearDelta = delta * SCROLL_SENSITIVITY;
      const newYear = Math.max(START_YEAR, Math.min(END_YEAR, freeYearRef.current + yearDelta));
      freeYearRef.current = newYear;
      setFreeYear(newYear);
      targetSnapRef.current = null;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touchY = e.touches[0].clientY;
      const delta = touchStartY - touchY;
      touchStartY = touchY;
      const yearDelta = delta * SCROLL_SENSITIVITY * 1.5;
      const newYear = Math.max(START_YEAR, Math.min(END_YEAR, freeYearRef.current + yearDelta));
      freeYearRef.current = newYear;
      setFreeYear(newYear);
      targetSnapRef.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const next = Math.min(milestoneIndex + 1, MILESTONES.length - 1);
        onSnapToMilestone(next);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const prev = Math.max(milestoneIndex - 1, 0);
        onSnapToMilestone(prev);
      } else if (e.key >= "1" && e.key <= "6") {
        const idx = parseInt(e.key) - 1;
        if (idx < MILESTONES.length) {
          onSnapToMilestone(idx);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [milestoneIndex, onSnapToMilestone]);

  useEffect(() => {
    return () => {
      if (snapAnimRef.current) cancelAnimationFrame(snapAnimRef.current);
    };
  }, []);

  const ctx: ScrollContext = useMemo(() => ({
    displayYear: freeYear,
    milestoneIndex,
    canAdvance,
    canRetreat,
    onYearChange,
    onSnapToMilestone,
  }), [freeYear, milestoneIndex, canAdvance, canRetreat, onYearChange, onSnapToMilestone]);

  return (
    <div className={styles.container}>
      {/* eslint-disable-next-line react-hooks/refs */}
      <div className={styles.viewport}>{children(ctx)}</div>
    </div>
  );
}
