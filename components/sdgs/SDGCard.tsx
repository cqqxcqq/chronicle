"use client";

import ProgressRing from "./ProgressRing";
import styles from "./SDGCard.module.css";

interface SDGCardProps {
  number: number;
  name: string;
  description: string;
  progress: number;
  trend: "improving" | "stagnating" | "regressing";
  color: string;
}

function TrendIndicator({ trend }: { trend: string }) {
  if (trend === "improving") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 3L14 9H2L8 3Z"
          fill="var(--color-sage-glow)"
          opacity="0.8"
        />
      </svg>
    );
  }
  if (trend === "stagnating") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="7" width="12" height="2" fill="var(--color-amber)" opacity="0.8" />
      </svg>
    );
  }
  if (trend === "regressing") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 13L14 7H2L8 13Z"
          fill="var(--color-crimson)"
          opacity="0.8"
        />
      </svg>
    );
  }
  return null;
}

export default function SDGCard({
  number,
  name,
  description,
  progress,
  trend,
  color,
}: SDGCardProps) {
  return (
    <div
      className={styles.card}
      style={
        {
          "--sdg-color": color,
        } as React.CSSProperties
      }
    >
      <span className={styles.number}>SDG {String(number).padStart(2, "0")}</span>
      <h3 className={styles.name}>{name}</h3>
      <ProgressRing progress={progress} color={color} />
      <div className={styles.trend}>
        <TrendIndicator trend={trend} />
        <span className={styles.trendLabel}>{trend}</span>
      </div>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
