"use client";

import styles from "./IndicatorTabs.module.css";

export type Indicator = "poverty" | "mortality" | "literacy" | "co2" | "lifeexp";

interface IndicatorTabsProps {
  active: Indicator;
  onChange: (indicator: Indicator) => void;
}

const INDICATORS: { id: Indicator; label: string }[] = [
  { id: "poverty", label: "POVERTY" },
  { id: "mortality", label: "MORTALITY" },
  { id: "literacy", label: "LITERACY" },
  { id: "co2", label: "CO\u2082" },
  { id: "lifeexp", label: "LIFE EXPECTANCY" },
];

export default function IndicatorTabs({ active, onChange }: IndicatorTabsProps) {
  return (
    <div className={styles.tabs}>
      {INDICATORS.map((ind) => (
        <button
          key={ind.id}
          className={`${styles.tab} ${active === ind.id ? styles.active : ""}`}
          onClick={() => onChange(ind.id)}
        >
          {ind.label}
        </button>
      ))}
    </div>
  );
}
