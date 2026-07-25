"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { soundEngine } from "@/lib/sound-engine";
import styles from "./OpeningSequence.module.css";

const lines = [
  "In 1800, nine of every ten people on earth lived in extreme poverty.",
  "Most children did not live to see their fifth birthday.",
  "This is what happened next.",
];

export default function OpeningSequence() {
  const router = useRouter();
  const [sequence, setSequence] = useState<
    "init" | "lines" | "title" | "exit"
  >("init");
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    router.prefetch("/timeline");
    const t = setTimeout(() => setSequence("lines"), 500);
    return () => clearTimeout(t);
  }, [router]);

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

  const showSkip = sequence === "lines";

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {sequence === "lines" && (
          <motion.div
            key={`line-${lineIdx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className={styles.lineBlock}
          >
            <motion.p
              className={styles.line}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              onAnimationComplete={onLineComplete}
            >
              {lines[lineIdx]}
            </motion.p>
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
            <motion.p
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
            </motion.p>
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
