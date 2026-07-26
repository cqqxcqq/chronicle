"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import LegacyCard from "./LegacyCard";
import type { JourneyProfile } from "@/lib/survival-data";
import styles from "./ClosingSequence.module.css";

interface CounterProps {
  from: number;
  to: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
  delay?: number;
  label: string;
}

function AnimatedCounter({
  from,
  to,
  suffix = "",
  decimals = 0,
  duration = 3500,
  delay = 0,
  label,
}: CounterProps) {
  const [value, setValue] = useState(from);
  const [started, setStarted] = useState(false);
  const ref = useRef<number>(0);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;
      setValue(current);
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      }
    };
    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [started, from, to, duration]);

  const display = decimals > 0 ? value.toFixed(decimals) : Math.round(value);

  return (
    <div className={styles.counter}>
      <p className={styles.counterValue}>
        {display}{suffix}
      </p>
      <p className={styles.counterLabel}>{label}</p>
    </div>
  );
}

interface ClosingSequenceProps {
  onEnd: () => void;
  journeyProfile: JourneyProfile;
  choiceHistory?: { year: number; title: string; text: string; inheritance: string }[];
}

export default function ClosingSequence({ onEnd, journeyProfile, choiceHistory }: ClosingSequenceProps) {
  const reduceMotion = useReducedMotion();
  const lines = [
    "Nine hands have held the same archive.",
    "A kitchen rule. A road map. A name written in the margin.",
    "The last page is still blank.",
  ];

  const [lineIdx, setLineIdx] = useState(-1);
  const [showYear, setShowYear] = useState(false);
  const [showCounters, setShowCounters] = useState(false);
  const [showTitle, setShowTitle] = useState(Boolean(reduceMotion));
  const [showSkip, setShowSkip] = useState(false);

  const [year, setYear] = useState(1800);
  const yearRef = useRef<number>(0);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((id: number) => {
    timersRef.current.push(id);
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    const t = window.setTimeout(() => setLineIdx(0), 1000);
    addTimer(t);
    return () => clearTimeout(t);
  }, [addTimer, reduceMotion]);

  useEffect(() => {
    const t = window.setTimeout(() => setShowSkip(true), 2000);
    addTimer(t);
    return () => clearTimeout(t);
  }, [addTimer]);

  const onLineComplete = useCallback(() => {
    const next = lineIdx + 1;
    if (next < lines.length) {
      const t = window.setTimeout(() => setLineIdx(next), 1200);
      addTimer(t);
    } else {
      const t = window.setTimeout(() => setShowYear(true), 1500);
      addTimer(t);
    }
  }, [lineIdx, lines.length, addTimer]);

  useEffect(() => {
    if (!showYear) return;
    const YEAR_DURATION = 6000;
    const HOLD_AFTER = 1500;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / YEAR_DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setYear(Math.round(1800 + (2026 - 1800) * eased));
      if (progress < 1) {
        yearRef.current = requestAnimationFrame(animate);
      } else {
        const t = window.setTimeout(() => setShowCounters(true), HOLD_AFTER);
        addTimer(t);
      }
    };

    yearRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(yearRef.current);
  }, [showYear, addTimer]);

  useEffect(() => {
    if (!showCounters) return;
    const t = window.setTimeout(() => setShowTitle(true), 4500);
    addTimer(t);
    return () => clearTimeout(t);
  }, [showCounters, addTimer]);

  const handleClick = useCallback(() => {
    onEnd();
  }, [onEnd]);

  const handleSkip = useCallback(() => {
    setShowTitle(true);
    setShowYear(false);
    setShowCounters(false);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === " " || e.key === "Enter") && showTitle) {
        onEnd();
      } else if (e.key === "Escape" && !showTitle) {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showTitle, onEnd, handleSkip]);

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {!showYear && !showCounters && !showTitle && lineIdx >= 0 && lineIdx < lines.length && (
          <motion.div
            key={`line-${lineIdx}`}
            className={styles.lineBlock}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            transition={{ duration: 1.2 }}
            onAnimationComplete={onLineComplete}
          >
            <p className={styles.line}>{lines[lineIdx]}</p>
          </motion.div>
        )}

        {showYear && !showCounters && !showTitle && (
          <motion.div
            key="year"
            className={styles.yearScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              className={styles.yearValue}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0 }}
            >
              {year}
            </motion.p>
            <motion.p
              className={styles.yearLabel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.5 }}
            >
              1800 — PRESENT
            </motion.p>
          </motion.div>
        )}

        {showCounters && !showTitle && (
          <motion.div
            key="counters"
            className={styles.countersBlock}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 1.0 }}
          >
            <p className={styles.countersLabel}>WHAT CHANGED</p>
            <div className={styles.countersRow}>
              <AnimatedCounter from={89} to={8.5} suffix="%" label="SDG 1 · poverty" delay={500} duration={3000} decimals={1} />
              <div className={styles.counterDivider} />
              <AnimatedCounter from={460} to={37} label="SDG 3 · under-five deaths / 1,000" delay={1000} duration={3000} />
              <div className={styles.counterDivider} />
              <AnimatedCounter from={12} to={87} suffix="%" label="SDG 4 · literacy" delay={1400} duration={3000} />
            </div>
          </motion.div>
        )}

        {showTitle && (
          <motion.div
            key="title"
            className={styles.titleBlock}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 1.5 }}
          >
            <motion.h1
              className={styles.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              CHRONICLE
            </motion.h1>
            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.8 }}
            >
              A history of human progress.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 1.5 }}
            >
              <LegacyCard journeyProfile={journeyProfile} choiceHistory={choiceHistory} />
            </motion.div>
            <motion.div className={styles.nextActions} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
              <Link href="/timeline">RETURN TO THE TIMELINE</Link>
              <Link href="/about#sources" target="_blank" rel="noreferrer">OPEN THE EVIDENCE ↗</Link>
              <button type="button" onClick={handleClick}>BEGIN AGAIN</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showSkip && !showTitle && (
        <motion.button
          className={styles.skipBtn}
          onClick={handleSkip}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          whileHover={{ opacity: 0.8 }}
        >
          SKIP →
        </motion.button>
      )}
    </div>
  );
}
