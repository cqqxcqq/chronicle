"use client";

import { useState } from "react";
import Link from "next/link";
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
  canAdvance: boolean;
  canRetreat: boolean;
  onAdvance: () => void;
  onRetreat: () => void;
}

export default function EraNarrative({
  displayYear,
  milestoneIndex,
  canAdvance,
  canRetreat,
  onAdvance,
  onRetreat,
}: EraNarrativeProps) {
  const [expanded, setExpanded] = useState(false);
  const milestone = MILESTONES[milestoneIndex];
  const stat = MILESTONE_STATS[milestoneIndex];
  const isLast = milestoneIndex === MILESTONES.length - 1;
  const figure = getFigureForMilestone(milestone.year);

  return (
    <div className={styles.wrapper}>
      <div className={styles.yearRow}>
        <span className={styles.year}>{displayYear}</span>
      </div>

      <div className={styles.panel}>
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

        <button
          className={styles.expandBtn}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "LESS" : "READ MORE"}
        </button>

        <div className={`${styles.details} ${expanded ? styles.detailsOpen : ""}`}>
          <p className={styles.context}>{stat.context}</p>
          <p className={styles.keyFact}>{stat.keyFact}</p>
        </div>

        {figure && (
          <div className={styles.figure}>
            <hr className={styles.divider} />
            <p className={styles.figureQuote}>&ldquo;{figure.quote}&rdquo;</p>
            <p className={styles.figureName}>{figure.name}</p>
            <p className={styles.figureRole}>{figure.role}</p>
          </div>
        )}

        <div className={styles.actions}>
          {canRetreat && (
            <button className={styles.retreatBtn} onClick={onRetreat}>
              ← BACK
            </button>
          )}

          {canAdvance && (
            <button className={styles.advanceBtn} onClick={onAdvance}>
              CONTINUE
              <span className={styles.arrow}> →</span>
            </button>
          )}

          {isLast && !canAdvance && (
            <Link href="/survival" className={styles.survivalBtn}>
              YOUR STORY →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
