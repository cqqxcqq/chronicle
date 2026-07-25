"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { soundEngine } from "@/lib/sound-engine";

interface SoundContextValue {
  muted: boolean;
  toggle: () => void;
  init: () => void;
}

const SoundContext = createContext<SoundContextValue>({
  muted: true,
  toggle: () => {},
  init: () => {},
});

export function useSound() {
  return useContext(SoundContext);
}

function getInitialMuted(): boolean {
  if (typeof window === "undefined") return true;
  const saved = localStorage.getItem("chronicle-muted");
  if (saved !== null) return JSON.parse(saved);
  return true;
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(getInitialMuted);
  const initializedRef = useRef(false);

  const init = useCallback(() => {
    soundEngine.init();
  }, []);

  const toggle = useCallback(() => {
    soundEngine.init();
    const next = !muted;
    setMuted(next);
    soundEngine.setMuted(next);
    localStorage.setItem("chronicle-muted", JSON.stringify(next));
  }, [muted]);

  useEffect(() => {
    if (!initializedRef.current) {
      soundEngine.setMuted(muted);
      initializedRef.current = true;
    }
  }, [muted]);

  useEffect(() => {
    const handleFirstInteraction = () => {
      soundEngine.init();
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };
    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);
    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    return () => {
      soundEngine.destroy();
    };
  }, []);

  return (
    <SoundContext.Provider value={{ muted, toggle, init }}>
      {children}
    </SoundContext.Provider>
  );
}
