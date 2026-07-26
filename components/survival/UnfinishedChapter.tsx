"use client";

import { useState } from "react";
import Link from "next/link";
import { UNFINISHED_GOALS } from "@/lib/evidence";
import styles from "./UnfinishedChapter.module.css";

export default function UnfinishedChapter({ onContinue }: { onContinue: () => void }) {
  const [selected, setSelected] = useState(UNFINISHED_GOALS[0]);
  return (
    <section className={styles.wrap} aria-labelledby="unfinished-title">
      <p className={styles.kicker}>THE UNFINISHED CHAPTER</p>
      <h2 id="unfinished-title">What should the next generation inherit?</h2>
      <p className={styles.intro}>Progress was built by choices, institutions, struggle, and cooperation. Choose one promise to carry forward.</p>
      <div className={styles.goals}>
        {UNFINISHED_GOALS.map((goal) => (
          <button key={goal.id} aria-pressed={selected.id === goal.id} className={selected.id === goal.id ? styles.active : ""} onClick={() => setSelected(goal)}>
            <span>{goal.sdg}</span>{goal.title}
          </button>
        ))}
      </div>
      <div className={styles.pledge} aria-live="polite">
        <span>{selected.sdg} · YOUR NEXT STEP</span>
        <h3>{selected.title}</h3>
        <p>{selected.fact}</p>
        <strong>{selected.action}</strong>
      </div>
      <p className={styles.question}>When Chronicle is opened again in 2030, what do you want it to record?</p>
      <div className={styles.actions}>
        <button onClick={onContinue}>CARRY THIS FORWARD →</button>
        <Link href="/about#sources">CHECK THE EVIDENCE</Link>
      </div>
    </section>
  );
}
