"use client";

import { useState, useCallback } from "react";
import type { JourneyProfile } from "@/lib/survival-data";
import styles from "./LegacyCard.module.css";

interface LegacyCardProps {
  journeyProfile?: JourneyProfile;
}

export default function LegacyCard({ journeyProfile }: LegacyCardProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const tierText = journeyProfile ? ` I was "${journeyProfile.title}."` : "";
    const shareData = {
      title: "CHRONICLE",
      text: `I lived 226 years and witnessed humanity's greatest transformation.${tierText} Poverty: 89% → 8.5%. Child mortality: 460 → 37. Literacy: 12% → 87%.`,
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
  }, [journeyProfile]);

  return (
    <div className={styles.cardOuter}>
      <div id="legacy-card" className={styles.card}>
        <p className={styles.cardLabel}>MY JOURNEY</p>
        <div className={styles.cardDivider} />
        <p className={styles.cardTitle}>I WAS BORN IN 1800</p>
        <p className={styles.cardSubtitle}>I LIVED TO SEE 2026</p>
        {journeyProfile && (
          <div className={styles.journeyTier}>
            <p className={styles.tierLabel}>{journeyProfile.title}</p>
            <p className={styles.tierDesc}>{journeyProfile.description}</p>
          </div>
        )}
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
      </div>
    </div>
  );
}
