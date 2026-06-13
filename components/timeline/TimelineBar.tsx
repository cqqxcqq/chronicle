"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { MILESTONES, START_YEAR, END_YEAR, ERAS } from "@/lib/timeline-config";
import styles from "./TimelineBar.module.css";

interface TimelineBarProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  onSnapToMilestone: (index: number) => void;
}

export default function TimelineBar({
  currentYear,
  onYearChange,
  onSnapToMilestone,
}: TimelineBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const yearToPercent = (year: number) =>
    ((year - START_YEAR) / (END_YEAR - START_YEAR)) * 100;

  const percentToYear = (pct: number) =>
    START_YEAR + (pct / 100) * (END_YEAR - START_YEAR);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromPointer(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updateFromPointer(e);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const year = percentToYear(getPercentFromEvent(e));
    let closestMilestone = 0;
    let closestDist = Infinity;
    MILESTONES.forEach((m, i) => {
      const dist = Math.abs(m.year - year);
      if (dist < closestDist) {
        closestDist = dist;
        closestMilestone = i;
      }
    });

    if (closestDist < 8) {
      onSnapToMilestone(closestMilestone);
    }
  };

  const updateFromPointer = (e: React.PointerEvent) => {
    const pct = getPercentFromEvent(e);
    const year = percentToYear(Math.max(0, Math.min(100, pct)));
    onYearChange(Math.round(year));
  };

  const getPercentFromEvent = (e: React.PointerEvent): number => {
    const bar = barRef.current;
    if (!bar) return 0;
    const rect = bar.getBoundingClientRect();
    return ((e.clientX - rect.left) / rect.width) * 100;
  };

  const handleMilestoneClick = (index: number) => {
    onSnapToMilestone(index);
  };

  const roundedYear = Math.round(currentYear);

  return (
    <div className={styles.bar}>
      <div
        className={styles.track}
        ref={barRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {ERAS.map((era) => {
          const left = yearToPercent(era.start);
          const width = yearToPercent(era.end) - left;
          return (
            <div
              key={era.id}
              className={styles.eraSegment}
              style={{ left: `${left}%`, width: `${width}%` }}
            >
              <span className={styles.eraLabel}>{era.label.replace("The ", "")}</span>
            </div>
          );
        })}

        {MILESTONES.map((m, i) => (
          <button
            key={m.year}
            className={styles.milestone}
            style={{ left: `${yearToPercent(m.year)}%` }}
            onClick={() => handleMilestoneClick(i)}
            title={m.label}
          >
            <span className={styles.milestoneDot} />
          </button>
        ))}

        <div
          className={styles.handle}
          style={{ left: `${yearToPercent(roundedYear)}%` }}
        >
          <span className={styles.handleLabel}>{roundedYear}</span>
        </div>
      </div>
    </div>
  );
}
