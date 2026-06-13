"use client";

import dynamic from "next/dynamic";

const OpeningSequence = dynamic(
  () => import("@/components/opening/OpeningSequence"),
  { ssr: false }
);

export default function HomePage() {
  return <OpeningSequence />;
}
