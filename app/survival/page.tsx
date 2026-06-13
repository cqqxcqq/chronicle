"use client";

import Nav from "@/components/ui/Nav";
import SurvivalGame from "@/components/survival/SurvivalGame";
import styles from "./page.module.css";

export default function SurvivalPage() {
  return (
    <div className={styles.page}>
      <Nav />
      <SurvivalGame />
    </div>
  );
}
