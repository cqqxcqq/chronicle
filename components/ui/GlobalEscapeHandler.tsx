"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function GlobalEscapeHandler() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (pathname === "/") {
        router.push("/timeline");
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [pathname, router]);

  return null;
}
