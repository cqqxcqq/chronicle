"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./OpeningSequence.module.css";

const line1 = "In 1800, nine of every ten people on earth lived in extreme poverty.";
const line2 = "Most children did not live to see their fifth birthday.";
const line3 = "This is what happened next.";

function StaggeredLine({
  text,
  onComplete,
}: {
  text: string;
  onComplete?: () => void;
}) {
  return (
    <motion.p
      className={styles.line}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onAnimationComplete={onComplete}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className={styles.char}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: i * 0.065 }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.p>
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

  const exit = useCallback(() => {
    setSequence("exit");
    setTimeout(() => router.push("/timeline"), 800);
  }, [router]);

  useEffect(() => {
    const handler = () => exit();
    window.addEventListener("keydown", handler);
    window.addEventListener("wheel", handler, { passive: true });
    window.addEventListener("touchstart", handler, { passive: true });
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("wheel", handler);
      window.removeEventListener("touchstart", handler);
    };
  }, [exit]);

  return (
    <div className={styles.container} onClick={exit}>
      <AnimatePresence mode="wait">
        {sequence === "line1" && (
          <motion.div
            key="s1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <StaggeredLine text={line1} onComplete={onLine1Complete} />
          </motion.div>
        )}

        {sequence === "line2" && (
          <motion.div
            key="s2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <StaggeredLine text={line2} onComplete={onLine2Complete} />
          </motion.div>
        )}

        {sequence === "line3" && (
          <motion.div
            key="s3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <StaggeredLine text={line3} onComplete={onLine3Complete} />
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
            >
              CLICK TO BEGIN
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
