"use client";

import Link from "next/link";
import { useMemo } from "react";
import { MILESTONES, MILESTONE_STATS, ERAS } from "@/lib/timeline-config";
import figuresData from "@/lib/data/figures.json";
import styles from "./EraNarrative.module.css";

interface Figure {
  year: number;
  name: string;
  role: string;
  quote: string;
}

const figures = figuresData as Figure[];

function getFigureForMilestone(milestoneYear: number): Figure | null {
  const era = ERAS.find((e) => milestoneYear >= e.start && milestoneYear <= e.end);
  if (!era) return null;
  return figures.find((f) => f.year >= era.start && f.year <= era.end) ?? null;
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
  const stat = MILESTONE_STATS[milestoneIndex];
  const isLast = milestoneIndex === MILESTONES.length - 1;
  const figure = useMemo(() => getFigureForMilestone(milestone.year), [milestone.year]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.yearRow}>
        <span className={styles.year}>{displayYear}</span>
      </div>

      <div className={styles.panel} key={milestoneIndex}>
        <p className={styles.eraTitle}>{milestone.label}</p>

        <hr className={styles.divider} />

        <p className={styles.hook}>{stat.hook}</p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stat.poverty}%</span>
            <span className={styles.statLabel}><span className={styles.sdgNum}>SDG 1</span> · poverty</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>{stat.lifeExpectancy} yr</span>
            <span className={styles.statLabel}><span className={styles.sdgNum}>SDG 3</span> · life expectancy</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>{stat.childMortality}</span>
            <span className={styles.statLabel}><span className={styles.sdgNum}>SDG 3</span> · infant deaths</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>{stat.literacy}%</span>
            <span className={styles.statLabel}><span className={styles.sdgNum}>SDG 4</span> · literacy</span>
          </div>
        </div>

        {figure && (
          <div className={styles.figure}>
            <hr className={styles.divider} />
            <p className={styles.figureQuote}>&ldquo;{figure.quote}&rdquo;</p>
            <p className={styles.figureName}>{figure.name}</p>
            <p className={styles.figureRole}>{figure.role}</p>
          </div>
        )}

        {isLast && (
          <Link href="/survival" className={styles.survivalBtn}>
            YOUR STORY &rarr;
          </Link>
        )}
      </div>

      {!isLast && (
        <p className={styles.scrollHint}>
          scroll to travel through time
        </p>
      )}
    </div>
  );
}
