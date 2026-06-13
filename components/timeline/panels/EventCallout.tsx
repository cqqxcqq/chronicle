"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./EventCallout.module.css";

interface EventItem {
  year: number;
  title: string;
  detail: string;
}

interface EventCalloutProps {
  displayYear: number;
  events: EventItem[];
}

export default function EventCallout({ displayYear, events }: EventCalloutProps) {
  const [visible, setVisible] = useState<EventItem | null>(null);
  const lastEventYearRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const roundYear = Math.round(displayYear);
    if (roundYear === lastEventYearRef.current) return;

    const match = events.find((e) => e.year === roundYear);
    if (match) {
      if (timerRef.current) clearTimeout(timerRef.current);
      lastEventYearRef.current = roundYear;
      setVisible(match);
      timerRef.current = setTimeout(() => setVisible(null), 4000);
    }
  }, [displayYear, events]);

  if (!visible) return null;

  return (
    <div className={styles.callout}>
      <span className={styles.year}>{visible.year}</span>
      <span className={styles.title}>{visible.title}</span>
      <span className={styles.detail}>{visible.detail}</span>
    </div>
  );
}
