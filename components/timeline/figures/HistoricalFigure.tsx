"use client";

import { motion } from "framer-motion";
import styles from "./HistoricalFigure.module.css";

interface HistoricalFigureData {
  year: number;
  name: string;
  role: string;
  quote: string;
}

interface HistoricalFigureProps {
  figure: HistoricalFigureData;
}

export default function HistoricalFigure({ figure }: HistoricalFigureProps) {
  return (
    <motion.div
      className={styles.panel}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <p className={styles.year}>{figure.year}</p>
      <p className={styles.name}>{figure.name}</p>
      <p className={styles.role}>{figure.role}</p>
      <hr className={styles.divider} />
      <p className={styles.quote}>&ldquo;{figure.quote}&rdquo;</p>
    </motion.div>
  );
}
