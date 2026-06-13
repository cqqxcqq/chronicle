"use client";

import sdgData from "@/lib/data/sdg-progress.json";
import SDGCard from "./SDGCard";
import styles from "./SDGGrid.module.css";

export default function SDGGrid() {
  return (
    <div className={styles.grid}>
      {sdgData.map((sdg) => (
        <SDGCard
          key={sdg.number}
          number={sdg.number}
          name={sdg.name}
          description={sdg.description}
          progress={sdg.progress}
          trend={sdg.trend as "improving" | "stagnating" | "regressing"}
          color={sdg.color}
        />
      ))}
    </div>
  );
}
