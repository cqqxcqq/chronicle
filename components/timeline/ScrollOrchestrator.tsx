"use client";

import { useState, useCallback, useEffect } from "react";
import { MILESTONES } from "@/lib/timeline-config";
import TimelineBar from "./TimelineBar";
import styles from "./ScrollOrchestrator.module.css";

export interface ScrollContext {
  displayYear: number;
  milestoneIndex: number;
  onAdvance: () => void;
  onRetreat: () => void;
  canAdvance: boolean;
  canRetreat: boolean;
  onYearChange: (year: number) => void;
  onSnapToMilestone: (index: number) => void;
}

interface ScrollOrchestratorProps {
  children: (ctx: ScrollContext) => React.ReactNode;
}

export default function ScrollOrchestrator({
  children,
}: ScrollOrchestratorProps) {
  const [milestoneIndex, setMilestoneIndex] = useState(0);
  const [freeYear, setFreeYear] = useState(MILESTONES[0].year);

  const canAdvance = milestoneIndex < MILESTONES.length - 1;
  const canRetreat = milestoneIndex > 0;

  const onAdvance = useCallback(() => {
    setMilestoneIndex((i) => {
      const next = Math.min(i + 1, MILESTONES.length - 1);
      setFreeYear(MILESTONES[next].year);
      return next;
    });
  }, []);

  const onRetreat = useCallback(() => {
    setMilestoneIndex((i) => {
      const prev = Math.max(i - 1, 0);
      setFreeYear(MILESTONES[prev].year);
      return prev;
    });
  }, []);

  const onYearChange = useCallback((year: number) => {
    setFreeYear(year);
  }, []);

  const onSnapToMilestone = useCallback((index: number) => {
    setMilestoneIndex(index);
    setFreeYear(MILESTONES[index].year);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        onAdvance();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        onRetreat();
      } else if (e.key >= "1" && e.key <= "6") {
        const idx = parseInt(e.key) - 1;
        if (idx < MILESTONES.length) {
          onSnapToMilestone(idx);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onAdvance, onRetreat, onSnapToMilestone]);

  const ctx: ScrollContext = {
    displayYear: freeYear,
    milestoneIndex,
    onAdvance,
    onRetreat,
    canAdvance,
    canRetreat,
    onYearChange,
    onSnapToMilestone,
  };

  return (
    <div className={styles.container}>
      <div className={styles.viewport}>{children(ctx)}</div>
      <TimelineBar
        currentYear={freeYear}
        onYearChange={onYearChange}
        onSnapToMilestone={onSnapToMilestone}
      />
    </div>
  );
}
