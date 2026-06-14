"use client";

import dynamic from "next/dynamic";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const OpeningSequence = dynamic(
  () => import("@/components/opening/OpeningSequence"),
  { ssr: false }
);

export default function HomePage() {
  return (
    <ErrorBoundary>
      <OpeningSequence />
    </ErrorBoundary>
  );
}
