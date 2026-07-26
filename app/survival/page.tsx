"use client";

import Nav from "@/components/ui/Nav";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import SurvivalGame from "@/components/survival/SurvivalGame";
import styles from "./page.module.css";

export default function SurvivalPage() {
  return (
    <ErrorBoundary>
      <main id="main-content" className={styles.page}>
        <Nav />
        <SurvivalGame />
      </main>
    </ErrorBoundary>
  );
}
