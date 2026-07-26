"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MILESTONES, MILESTONE_STATS } from "@/lib/timeline-config";
import styles from "./EraNarrative.module.css";

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

interface EraNarrativeProps {
  displayYear: number;
  milestoneIndex: number;
}

export default function EraNarrative({
  displayYear,
  milestoneIndex,
}: EraNarrativeProps) {
  const milestone = MILESTONES[milestoneIndex];
  const [expandedEra, setExpandedEra] = useState<number | null>(null);
  const detailsOpen = expandedEra === milestoneIndex;
  const isLast = milestoneIndex === MILESTONES.length - 1;
  const dataKind = displayYear >= 2026
    ? "LATEST AVAILABLE ESTIMATES"
    : displayYear === milestone.year
      ? (displayYear < 1990 ? "RECONSTRUCTED MILESTONE" : "ESTIMATED MILESTONE")
      : "VISUAL INTERPOLATION";

  const interpolated = useMemo(() => {
    const currentStat = MILESTONE_STATS[milestoneIndex];
    if (isLast) {
      const t = (displayYear - 2015) / (2026 - 2015);
      return {
        ...currentStat,
        poverty: Math.round(lerp(10, 8.5, t) * 10) / 10,
        lifeExpectancy: Math.round(lerp(72, 73, t)),
        childMortality: Math.round(lerp(43, 37, t)),
        literacy: Math.round(lerp(86, 87, t)),
      };
    }

    const nextStat = MILESTONE_STATS[milestoneIndex + 1];
    const currentYear = MILESTONES[milestoneIndex].year;
    const nextYear = MILESTONES[milestoneIndex + 1].year;
    const t = (displayYear - currentYear) / (nextYear - currentYear);

    return {
      hook: currentStat.hook,
      context: currentStat.context,
      keyFact: currentStat.keyFact,
      poverty: Math.round(lerp(currentStat.poverty, nextStat.poverty, t)),
      lifeExpectancy: Math.round(lerp(currentStat.lifeExpectancy, nextStat.lifeExpectancy, t)),
      childMortality: Math.round(lerp(currentStat.childMortality, nextStat.childMortality, t)),
      literacy: Math.round(lerp(currentStat.literacy, nextStat.literacy, t)),
    };
  }, [milestoneIndex, displayYear, isLast]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.yearRow}>
        <h1 className={styles.year}>{displayYear}</h1>
      </div>

      <div className={styles.panel} key={milestoneIndex}>
        <p className={styles.eraTitle}>{milestone.label}</p>

        <hr className={styles.divider} />

        <p className={styles.hook}>{interpolated.hook}</p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{interpolated.poverty}%</span>
            <span className={styles.statLabel}><span className={styles.sdgNum}>SDG 1</span> · poverty <Link className={styles.sourceMark} href="/about#sources" aria-label="Source for poverty data">↗</Link></span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>{interpolated.lifeExpectancy} yr</span>
            <span className={styles.statLabel}><span className={styles.sdgNum}>SDG 3</span> · life expectancy <Link className={styles.sourceMark} href="/about#sources" aria-label="Source for life expectancy data">↗</Link></span>
          </div>
          {detailsOpen && <>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>{interpolated.childMortality}</span>
              <span className={styles.statLabel}><span className={styles.sdgNum}>SDG 3</span> · under-five / 1,000 <Link className={styles.sourceMark} href="/about#sources" aria-label="Source for under-five mortality data">↗</Link></span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>{interpolated.literacy}%</span>
              <span className={styles.statLabel}><span className={styles.sdgNum}>SDG 4</span> · literacy <Link className={styles.sourceMark} href="/about#sources" aria-label="Source for literacy data">↗</Link></span>
            </div>
          </>}
        </div>

        <button className={styles.detailsBtn} type="button" aria-expanded={detailsOpen} onClick={() => setExpandedEra(detailsOpen ? null : milestoneIndex)}>
          {detailsOpen ? "LESS" : "CONTEXT + EVIDENCE"}
        </button>
        {detailsOpen && <div className={styles.details}>
          <p className={styles.caveat}>
            {isLast
              ? "War displaces families, heat erases harvests, and debt closes classrooms; the global average hides each reversal."
              : "Rounded reconstruction. Records thin out as the timeline moves backward; local lives rarely resembled the global average."}
          </p>
          <p className={styles.dataKind}>{dataKind}</p>
          {isLast && <p className={styles.unfinished}>In the UN&apos;s 2025 assessment, only 35% of measurable targets were on track or making moderate progress.</p>}
          <Link href="/about#methodology" className={styles.evidenceLink}>SOURCES · METHOD · UNCERTAINTY</Link>
        </div>}
        {isLast && (
          <Link href="/survival" className={styles.survivalBtn}>YOUR STORY →</Link>
        )}
      </div>

      {!isLast && (
        <p className={styles.scrollHint}>
          scroll or swipe · arrow keys jump eras · drag the timeline
        </p>
      )}
    </div>
  );
}
