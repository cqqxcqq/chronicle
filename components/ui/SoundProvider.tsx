"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
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

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const init = useCallback(() => {
    if (!initialized) {
      soundEngine.init();
      setInitialized(true);
    }
  }, [initialized]);

  const toggle = useCallback(() => {
    init();
    const next = !muted;
    setMuted(next);
    soundEngine.setMuted(next);
  }, [muted, init]);

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
