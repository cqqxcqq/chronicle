"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./CrossroadPanel.module.css";

interface CrossroadData {
  year: number;
  question: string;
  optionA: string;
  outcomeA: string;
  optionB: string;
  outcomeB: string;
  era: string;
}

interface CrossroadPanelProps {
  crossroad: CrossroadData;
  onContinue: () => void;
}

export default function CrossroadPanel({
  crossroad,
  onContinue,
}: CrossroadPanelProps) {
  const [chosen, setChosen] = useState<"A" | "B" | null>(null);
  const [showContinue, setShowContinue] = useState(false);

  const handleChoose = (option: "A" | "B") => {
    setChosen(option);
    setTimeout(() => setShowContinue(true), 2500);
  };

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className={styles.panel}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <p className={styles.eraLabel}>{crossroad.era}</p>
        <p className={styles.yearLabel}>{crossroad.year}</p>
        <hr className={styles.divider} />
        <p className={styles.question}>{crossroad.question}</p>

        <AnimatePresence mode="wait">
          {!chosen && (
            <motion.div
              key="choices"
              className={styles.choices}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                className={styles.choiceBtn}
                onClick={() => handleChoose("A")}
              >
                <span className={styles.choiceLabel}>{crossroad.optionA}</span>
              </button>
              <button
                className={styles.choiceBtn}
                onClick={() => handleChoose("B")}
              >
                <span className={styles.choiceLabel}>{crossroad.optionB}</span>
              </button>
            </motion.div>
          )}

          {chosen && (
            <motion.div
              key="outcome"
              className={styles.outcome}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <p className={styles.outcomeLabel}>
                {chosen === "A"
                  ? "The path of optimism:"
                  : "The path of caution:"}
              </p>
              <p className={styles.outcomeText}>
                {chosen === "A" ? crossroad.outcomeA : crossroad.outcomeB}
              </p>
              {showContinue && (
                <motion.button
                  className={styles.continueBtn}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  onClick={onContinue}
                >
                  CONTINUE
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
