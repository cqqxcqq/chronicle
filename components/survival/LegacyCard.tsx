"use client";

import { useState, useCallback } from "react";
import type { JourneyProfile } from "@/lib/survival-data";
import styles from "./LegacyCard.module.css";

interface LegacyCardProps {
  journeyProfile?: JourneyProfile;
  choiceHistory?: { year: number; title: string; text: string; inheritance: string }[];
}

export default function LegacyCard({ journeyProfile, choiceHistory }: LegacyCardProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const tierText = journeyProfile ? ` I was "${journeyProfile.title}."` : "";
    const shareData = {
      title: "CHRONICLE",
      text: `Nine generations carried our family archive from 1800 to the present.${tierText} Poverty: about 89% → 8.5%. Under-five mortality: about 460 → 37 per 1,000.`,
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
        <p className={styles.cardTitle}>OUR STORY BEGAN IN 1800</p>
        <p className={styles.cardSubtitle}>OUR MEMORY REACHED THE PRESENT</p>
        {journeyProfile && (
          <div className={styles.journeyTier}>
            <p className={styles.tierLabel}>{journeyProfile.title}</p>
            <p className={styles.tierDesc}>{journeyProfile.description}</p>
          </div>
        )}
        <div className={styles.cardStats}>
          <div className={styles.cardStat}>
            <span className={styles.cardStatFrom}>89%</span>
            <span className={styles.cardStatArrow}>&rarr;</span>
            <span className={styles.cardStatTo}>8.5%</span>
            <span className={styles.cardStatLabel}>POVERTY</span>
          </div>
          <div className={styles.cardStat}>
            <span className={styles.cardStatFrom}>460</span>
            <span className={styles.cardStatArrow}>&rarr;</span>
            <span className={styles.cardStatTo}>37</span>
            <span className={styles.cardStatLabel}>UNDER-FIVE / 1,000</span>
          </div>
          <div className={styles.cardStat}>
            <span className={styles.cardStatFrom}>12%</span>
            <span className={styles.cardStatArrow}>&rarr;</span>
            <span className={styles.cardStatTo}>87%</span>
            <span className={styles.cardStatLabel}>LITERACY</span>
          </div>
          <div className={styles.cardStat}>
            <span className={styles.cardStatFrom}>29 yr</span>
            <span className={styles.cardStatArrow}>&rarr;</span>
            <span className={styles.cardStatTo}>73 yr</span>
            <span className={styles.cardStatLabel}>LIFE EXPECTANCY</span>
          </div>
        </div>
        {choiceHistory && choiceHistory.length > 0 && (
          <>
            <div className={styles.cardDivider} />
            <div className={styles.cardJourney}>
              <p className={styles.cardJourneyLabel}>YOUR CHOICES</p>
              <div className={styles.cardJourneyTimeline}>
                {choiceHistory.map((entry, i) => (
                  <div key={i} className={styles.cardJourneyStep}>
                    <span className={styles.cardJourneyYear}>{entry.year}</span>
                    <span className={styles.cardJourneyDot} />
                    <span className={styles.cardJourneyText}>{entry.inheritance}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        <div className={styles.cardDivider} />
        <p className={styles.cardFooter}>
          The archive reached another pair of hands.
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
