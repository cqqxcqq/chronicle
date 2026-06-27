"use client";

import { useEffect, useRef } from "react";
import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  suffix?: string;
}

export default function AnimatedNumber({
  value,
  decimals = 0,
  suffix = "",
}: AnimatedNumberProps) {
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: shouldReduceMotion ? 0 : 0.8,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value, motionValue]);

  useMotionValueEvent(motionValue, "change", (latest) => {
    if (ref.current) {
      ref.current.textContent = `${latest.toFixed(decimals)}${suffix}`;
    }
  });

  return <span ref={ref}>{value.toFixed(decimals)}{suffix}</span>;
}
