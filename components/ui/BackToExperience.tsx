"use client";

import { useRouter } from "next/navigation";

export default function BackToExperience({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <button type="button" className={className} style={{ background: "transparent", cursor: "pointer" }} onClick={() => router.back()}>
      ← RETURN TO WHERE I WAS
    </button>
  );
}
