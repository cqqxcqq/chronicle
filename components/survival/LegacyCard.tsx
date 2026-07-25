"use client";

import { useState, useCallback } from "react";
import styles from "./LegacyCard.module.css";

export default function LegacyCard() {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: "CHRONICLE",
      text: "I lived 226 years and witnessed humanity's greatest transformation. Poverty: 89% → 8.5%. Child mortality: 460 → 37. Literacy: 12% → 87%.",
      url: typeof window !== "undefined" ? window.location.origin : "",
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // fallback to copy
      }
    }

    try {
      await navigator.clipboard.writeText(
        `${shareData.text}\n\n${shareData.url}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  }, []);

  const handleScreenshot = useCallback(() => {
    const card = document.getElementById("legacy-card");
    if (!card) return;
    const range = document.createRange();
    range.selectNodeContents(card);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, []);

  return (
    <div className={styles.cardOuter}>
      <div id="legacy-card" className={styles.card}>
        <p className={styles.cardLabel}>MY JOURNEY</p>
        <div className={styles.cardDivider} />
        <p className={styles.cardTitle}>I WAS BORN IN 1800</p>
        <p className={styles.cardSubtitle}>I LIVED TO SEE 2026</p>
        <div className={styles.cardStats}>
          <div className={styles.cardStat}>
            <span className={styles.cardStatValue}>89% &rarr; 8.5%</span>
            <span className={styles.cardStatLabel}>POVERTY</span>
          </div>
          <div className={styles.cardStat}>
            <span className={styles.cardStatValue}>460 &rarr; 37</span>
            <span className={styles.cardStatLabel}>CHILD DEATHS</span>
          </div>
          <div className={styles.cardStat}>
            <span className={styles.cardStatValue}>12% &rarr; 87%</span>
            <span className={styles.cardStatLabel}>LITERACY</span>
          </div>
          <div className={styles.cardStat}>
            <span className={styles.cardStatValue}>29 &rarr; 73 yr</span>
            <span className={styles.cardStatLabel}>LIFE EXPECTANCY</span>
          </div>
        </div>
        <div className={styles.cardDivider} />
        <p className={styles.cardFooter}>
          I witnessed humanity&apos;s greatest transformation.
        </p>
        <p className={styles.cardBrand}>CHRONICLE</p>
      </div>

      <div className={styles.actions}>
        <button className={styles.shareBtn} onClick={handleShare}>
          {copied ? "COPIED" : "SHARE MY STORY"}
        </button>
        <button className={styles.shareBtn} onClick={handleScreenshot}>
          SELECT TO SCREENSHOT
        </button>
      </div>
    </div>
  );
}
