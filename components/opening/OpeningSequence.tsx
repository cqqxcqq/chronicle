"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { soundEngine } from "@/lib/sound-engine";
import styles from "./OpeningSequence.module.css";

const lines = [
  "In 1800, nine of every ten people on earth lived in extreme poverty.",
  "Most children did not live to see their fifth birthday.",
  "Follow one family's memory, carried from generation to generation.",
  "This is what happened next.",
];

const CHAR_DELAY = 0.04;

function CharReveal({
  text,
  onComplete,
}: {
  text: string;
  onComplete?: () => void;
}) {
  const revealTime = text.length * CHAR_DELAY + 0.6;

  useEffect(() => {
    const t = setTimeout(() => {
      onComplete?.();
    }, revealTime * 1000);
    return () => clearTimeout(t);
  }, [revealTime, onComplete]);

  return (
    <p className={styles.line}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: i * CHAR_DELAY }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </p>
  );
}

export default function OpeningSequence() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [sequence, setSequence] = useState<
    "init" | "lines" | "title" | "exit"
  >(reduceMotion ? "title" : "init");
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    router.prefetch("/timeline");
    if (reduceMotion) {
      return;
    }
    const t = setTimeout(() => setSequence("lines"), 500);
    return () => clearTimeout(t);
  }, [router, reduceMotion]);

  const onLineComplete = useCallback(() => {
    const next = lineIdx + 1;
    if (next < lines.length) {
      setTimeout(() => setLineIdx(next), 1200);
    } else {
      setTimeout(() => setSequence("title"), 2000);
    }
  }, [lineIdx]);

  const skipToEnd = useCallback(() => {
    setSequence("title");
  }, []);

  const exit = useCallback(() => {
    if (!soundEngine.isMuted()) soundEngine.playClick();
    setSequence("exit");
    setTimeout(() => router.push("/timeline"), 400);
  }, [router]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        if (sequence === "title") {
          exit();
        } else if (sequence !== "exit" && sequence !== "init") {
          skipToEnd();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [sequence, exit, skipToEnd]);

  const handleContainerClick = useCallback(() => {
    if (sequence === "title") {
      exit();
    } else if (sequence !== "exit" && sequence !== "init") {
      skipToEnd();
    }
  }, [sequence, exit, skipToEnd]);

  const showSkip = sequence === "lines";

  return (
    <div className={styles.container} onClick={handleContainerClick}>
      <AnimatePresence mode="wait">
        {sequence === "lines" && (
          <motion.div
            key={`line-${lineIdx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className={styles.lineBlock}
          >
            <CharReveal text={lines[lineIdx]} onComplete={onLineComplete} />
          </motion.div>
        )}

        {sequence === "title" && (
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
            >
              CHRONICLE
            </motion.h1>
            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.6 }}
            >
              Tracking humanity&apos;s progress toward the Sustainable Development Goals.
            </motion.p>
            <motion.button
              type="button"
              className={styles.prompt}
              initial={{ opacity: 0, y: 0 }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
                y: [0, -6, 0],
              }}
              transition={{
                duration: 2.0,
                delay: 2.0,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              onClick={exit}
            >
              CLICK TO BEGIN
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {showSkip && (
        <motion.button
          className={styles.skipBtn}
          onClick={skipToEnd}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          whileHover={{ opacity: 1 }}
        >
          SKIP &rarr;
        </motion.button>
      )}
    </div>
  );
}
