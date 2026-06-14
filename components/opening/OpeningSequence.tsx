"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { soundEngine } from "@/lib/sound-engine";
import DustCanvas from "./DustCanvas";
import styles from "./OpeningSequence.module.css";

const line1 = "In 1800, nine of every ten people on earth lived in extreme poverty.";
const line2 = "Most children did not live to see their fifth birthday.";
const line3 = "This is what happened next.";

const CHAR_DELAY = 0.065;

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

export default function OpeningSequence() {
  const router = useRouter();
  const [sequence, setSequence] = useState<
    "init" | "line1" | "line2" | "line3" | "fadeout" | "title" | "exit"
  >("init");

  useEffect(() => {
    const t = setTimeout(() => setSequence("line1"), 800);
    return () => clearTimeout(t);
  }, []);

  const onLine1Complete = useCallback(() => {
    setTimeout(() => setSequence("line2"), 2000);
  }, []);

  const onLine2Complete = useCallback(() => {
    setTimeout(() => setSequence("line3"), 2000);
  }, []);

  const onLine3Complete = useCallback(() => {
    setTimeout(() => {
      setSequence("fadeout");
      setTimeout(() => setSequence("title"), 1000);
    }, 3000);
  }, []);

  const skipToEnd = useCallback(() => {
    setSequence("fadeout");
    setTimeout(() => setSequence("title"), 600);
  }, []);

  const exit = useCallback(() => {
    if (!soundEngine.isMuted()) soundEngine.playClick();
    setSequence("exit");
    setTimeout(() => router.push("/timeline"), 800);
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

  const showSkip = sequence === "line1" || sequence === "line2" || sequence === "line3";

  return (
    <div className={styles.container}>
      <DustCanvas />
      <AnimatePresence mode="wait">
        {(sequence === "line1" || sequence === "line2" || sequence === "line3") && (
          <motion.div
            key={`s-${sequence}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className={styles.lineBlock}
          >
            <StaggeredLine
              text={sequence === "line1" ? line1 : sequence === "line2" ? line2 : line3}
              onComplete={
                sequence === "line1"
                  ? onLine1Complete
                  : sequence === "line2"
                  ? onLine2Complete
                  : onLine3Complete
              }
            />
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
              Two centuries of human progress.
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
                delay: 1.4,
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
          animate={{ opacity: 0.4 }}
          whileHover={{ opacity: 0.8 }}
        >
          SKIP →
        </motion.button>
      )}
    </div>
  );
}
