"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { soundEngine } from "@/lib/sound-engine";
import styles from "./OpeningSequence.module.css";

const line1 = "In 1800, nine of every ten people on earth lived in extreme poverty.";
const line2 = "Most children did not live to see their fifth birthday.";
const line3 = "This is what happened next.";

export default function OpeningSequence() {
  const router = useRouter();
  const [sequence, setSequence] = useState<
    "init" | "lines" | "title" | "exit"
  >("init");

  useEffect(() => {
    const t = setTimeout(() => setSequence("lines"), 400);
    return () => clearTimeout(t);
  }, []);

  const onLinesComplete = useCallback(() => {
    setTimeout(() => {
      setSequence("title");
    }, 1500);
  }, []);

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

  useEffect(() => {
    if (sequence === "lines") {
      onLinesComplete();
    }
  }, [sequence, onLinesComplete]);

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {sequence === "lines" && (
          <motion.div
            key="lines"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className={styles.lineBlock}
          >
            <motion.p className={styles.line} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0 }}>
              {line1}
            </motion.p>
            <motion.p className={styles.line} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              {line2}
            </motion.p>
            <motion.p className={styles.line} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }}>
              {line3}
            </motion.p>
          </motion.div>
        )}

        {sequence === "title" && (
          <motion.div
            key="title"
            className={styles.titleBlock}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            transition={{ duration: 1.0 }}
          >
            <motion.h1
              className={styles.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              CHRONICLE
            </motion.h1>
            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
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
                duration: 1.5,
                delay: 0.8,
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
