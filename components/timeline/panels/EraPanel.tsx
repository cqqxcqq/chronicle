"use client";

import { motion } from "framer-motion";
import type { Era } from "@/lib/timeline-config";
import styles from "./EraPanel.module.css";

interface EraPanelProps {
  era: Era;
}

export default function EraPanel({ era }: EraPanelProps) {
  return (
    <motion.div
      className={styles.panel}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <p className={styles.eraName}>{era.label}</p>
      <hr className={styles.divider} />
      <p className={styles.eraDuration}>
        {era.start} &mdash; {era.end}
      </p>
      <p className={styles.description}>{era.description}</p>
    </motion.div>
  );
}
