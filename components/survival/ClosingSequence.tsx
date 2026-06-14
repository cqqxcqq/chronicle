"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ClosingSequence.module.css";

const lines = [
  "You have seen two hundred years of human struggle.",
  "From darkness to light. From ignorance to knowledge.",
  "460 children per thousand once died before five. Now it is 37.",
  "89% of humanity once lived in extreme poverty. Now it is 8.5%.",
  "12% of the world could read. Now it is 87%.",
  "The story is not over.",
];

const CHAR_DELAY = 0.05;

function StaggeredLine({
  text,
  onComplete,
}: {
  text: string;
  onComplete?: () => void;
}) {
  const revealTime = text.length * CHAR_DELAY + 0.5;

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
          className={styles.char}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: i * CHAR_DELAY }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </p>
  );
}

interface ClosingSequenceProps {
  onEnd: () => void;
}

export default function ClosingSequence({ onEnd }: ClosingSequenceProps) {
  const [lineIdx, setLineIdx] = useState(-1);
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLineIdx(0), 1000);
    return () => clearTimeout(t);
  }, []);

  const onLineComplete = useCallback(() => {
    const next = lineIdx + 1;
    if (next < lines.length) {
      setTimeout(() => setLineIdx(next), 2000);
    } else {
      setTimeout(() => setShowTitle(true), 2500);
    }
  }, [lineIdx]);

  const handleClick = useCallback(() => {
    onEnd();
  }, [onEnd]);

  return (
    <div className={styles.container} onClick={handleClick}>
      <AnimatePresence mode="wait">
        {!showTitle && lineIdx >= 0 && lineIdx < lines.length && (
          <motion.div
            key={`line-${lineIdx}`}
            className={styles.lineBlock}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <StaggeredLine text={lines[lineIdx]} onComplete={onLineComplete} />
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
            <motion.p
              className={styles.closing}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, delay: 2.0 }}
            >
              The future is not written. What happens next is up to you.
            </motion.p>
            <motion.p
              className={styles.prompt}
              initial={{ opacity: 0, y: 0 }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
                y: [0, -6, 0],
              }}
              transition={{
                duration: 2.0,
                delay: 3.0,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              CLICK TO BEGIN AGAIN
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
