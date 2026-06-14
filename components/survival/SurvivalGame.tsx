"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { SURVIVAL_ROUNDS } from "@/lib/survival-data";
import { soundEngine } from "@/lib/sound-engine";
import ClosingSequence from "./ClosingSequence";
import styles from "./SurvivalGame.module.css";

type Phase = "start" | "context" | "choice" | "result" | "progress" | "complete" | "closing";

export default function SurvivalGame() {
  const [phase, setPhase] = useState<Phase>("start");
  const [roundIdx, setRoundIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [contextVisible, setContextVisible] = useState(false);
  const [eraVisible, setEraVisible] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [progressVisible, setProgressVisible] = useState(false);
  const [counterValues, setCounterValues] = useState<Record<number, number>>({});

  const round = SURVIVAL_ROUNDS[roundIdx];
  const timersRef = useRef<number[]>([]);
  const rafRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const clearRafs = useCallback(() => {
    rafRef.current.forEach(cancelAnimationFrame);
    rafRef.current = [];
  }, []);

  const addTimer = useCallback((id: number) => {
    timersRef.current.push(id);
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      clearRafs();
    };
  }, [clearTimers, clearRafs]);

  useEffect(() => {
    if (phase !== "context") return;
    setContextVisible(false);
    setEraVisible(false);
    setResultVisible(false);
    setProgressVisible(false);
    setSelectedChoice(null);
    setCounterValues({});

    const t1 = window.setTimeout(() => setContextVisible(true), 500);
    const t2 = window.setTimeout(() => setEraVisible(true), 1200);
    const t3 = window.setTimeout(() => setPhase("choice"), 2000);
    addTimer(t1); addTimer(t2); addTimer(t3);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase, roundIdx, addTimer]);

  const handleChoice = useCallback((choiceIdx: number) => {
    setSelectedChoice(choiceIdx);
    setPhase("result");
    if (!soundEngine.isMuted()) soundEngine.playClick();

    const t = window.setTimeout(() => setResultVisible(true), 400);
    addTimer(t);
  }, [addTimer]);

  useEffect(() => {
    if (phase !== "result" || !resultVisible) return;
    if (!soundEngine.isMuted()) soundEngine.playSurvive();

    const t = window.setTimeout(() => setPhase("progress"), 2200);
    addTimer(t);
    return () => clearTimeout(t);
  }, [phase, resultVisible, addTimer]);

  useEffect(() => {
    if (phase !== "progress") return;
    setProgressVisible(true);

    clearRafs();
    round.sdgProgress.forEach((prog, i) => {
      const startVal = prog.from;
      const endVal = prog.to;
      const duration = 2000;
      const startTime = Date.now() + i * 300;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed < 0) {
          const id = requestAnimationFrame(animate);
          rafRef.current.push(id);
          return;
        }
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = startVal + (endVal - startVal) * eased;
        setCounterValues(prev => ({ ...prev, [i]: current }));
        if (progress < 1) {
          const id = requestAnimationFrame(animate);
          rafRef.current.push(id);
        }
      };
      const id = requestAnimationFrame(animate);
      rafRef.current.push(id);
    });

    return () => clearRafs();
  }, [phase, round.sdgProgress, clearRafs]);

  const handleContinue = useCallback(() => {
    if (roundIdx < SURVIVAL_ROUNDS.length - 1) {
      setRoundIdx(i => i + 1);
      setPhase("context");
    } else {
      setPhase("complete");
    }
  }, [roundIdx]);

  const handleRestart = useCallback(() => {
    clearTimers();
    clearRafs();
    setPhase("start");
    setRoundIdx(0);
    setSelectedChoice(null);
    setContextVisible(false);
    setEraVisible(false);
    setResultVisible(false);
    setProgressVisible(false);
    setCounterValues({});
  }, [clearTimers, clearRafs]);

  const firstRound = SURVIVAL_ROUNDS[0];
  const lastRound = SURVIVAL_ROUNDS[SURVIVAL_ROUNDS.length - 1];

  const completeStats = useMemo(() => {
    const allSdgs = new Map<string, { label: string; from: number; to: number; suffix: string }>();
    for (const r of SURVIVAL_ROUNDS) {
      for (const p of r.sdgProgress) {
        const key = `${p.sdg}-${p.label}`;
        const existing = allSdgs.get(key);
        if (existing) {
          existing.to = p.to;
        } else {
          allSdgs.set(key, { label: p.label, from: p.from, to: p.to, suffix: p.suffix });
        }
      }
    }
    const results: { sdg: string; label: string; from: number; to: number; suffix: string }[] = [];
    const seen = new Set<string>();
    for (const r of SURVIVAL_ROUNDS) {
      for (const p of r.sdgProgress) {
        const key = `${p.sdg}-${p.label}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const entry = allSdgs.get(key)!;
        results.push({ sdg: p.sdg, label: p.label, from: entry.from, to: entry.to, suffix: entry.suffix });
      }
    }
    return results;
  }, []);

  useEffect(() => {
    if (phase !== "choice") return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "1" || e.key === "2") {
        const idx = parseInt(e.key) - 1;
        if (idx < round.choices.length) {
          if (!soundEngine.isMuted()) soundEngine.playClick();
          handleChoice(idx);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase, round.choices.length, handleChoice]);

  useEffect(() => {
    if (phase !== "progress") return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleContinue();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase, handleContinue]);

  if (!round) return null;

  if (phase === "closing") {
    return (
      <ClosingSequence onEnd={handleRestart} />
    );
  }

  if (phase === "start") {
    return (
      <div className={styles.container}>
        <div className={styles.startScreen}>
          <p className={styles.startTitle}>YOU WERE BORN IN 1800</p>
          <p className={styles.startBridge}>
            You have seen two centuries of progress. Now it is your turn.
          </p>
          <p className={styles.startSubtitle}>
            Two hundred years of human history. One journey.
          </p>
          <p className={styles.startInfo}>
            Make choices. Witness what changed. See how far we have come.
          </p>
          <button className={styles.btnStart} onClick={() => { if (!soundEngine.isMuted()) soundEngine.playClick(); setPhase("context"); }}>
            BEGIN
          </button>
        </div>
      </div>
    );
  }

  if (phase === "progress") {
    const hasProgress = round.sdgProgress.length > 0;
    return (
      <div className={styles.container}>
        <div className={styles.playingScreen}>
          <div className={styles.roundImageContainer}>
            <img src={round.image} alt={round.imageAlt} className={styles.roundImage} />
            <div className={styles.imageOverlay} />
            <div className={styles.imageYearOverlay}>
              <p className={styles.imageYear}>{round.year}</p>
              <p className={styles.imageAge}>Age {round.age}</p>
            </div>
          </div>
          <div className={styles.progressSection}>
            {hasProgress ? (
              <>
                <p className={styles.progressLabel}>WHAT CHANGED</p>
                <div className={styles.progressGrid}>
                  {round.sdgProgress.map((prog, i) => (
                    <div key={i} className={styles.progressItem}>
                      <p className={styles.progressValue}>
                        {prog.from}{prog.suffix} &rarr; {Math.round((counterValues[i] ?? prog.from) * 10) / 10}{prog.suffix}
                      </p>
                      <p className={styles.progressItemLabel}>
                        <span className={styles.sdgNum}>{prog.sdg}</span> &middot; {prog.label}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className={styles.progressLabel}>THE BEGINNING</p>
            )}
            <button className={styles.btnContinue} onClick={handleContinue}>
              {roundIdx < SURVIVAL_ROUNDS.length - 1 ? "CONTINUE" : "SEE THE FINAL"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className={styles.container}>
        <div className={styles.playingScreen}>
          <div className={styles.roundImageContainer}>
            <img src={round.image} alt={round.imageAlt} className={styles.roundImage} />
            <div className={styles.imageOverlay} />
            <div className={styles.imageYearOverlay}>
              <p className={styles.imageYear}>{round.year}</p>
              <p className={styles.imageAge}>Age {round.age}</p>
            </div>
          </div>
          <div className={styles.resultSection}>
            <p className={styles.roundTitle}>{round.title}</p>
            {resultVisible && (
              <div className={`${styles.resultContent} ${styles.fadeIn}`}>
                <p className={styles.resultNarrative}>{round.surviveNarrative}</p>
                {selectedChoice !== null && (
                  <p className={styles.choiceResult}>
                    You chose: {round.choices[selectedChoice].text}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "complete") {
    return (
      <div className={styles.completeOverlay}>
        <p className={styles.completeTitle}>YOU WITNESSED IT ALL</p>
        <p className={styles.completeSubtitle}>
          224 years. You witnessed the greatest transformation in human history.
        </p>
        <div className={styles.completeStats}>
          {completeStats.map((stat, i) => (
            <p key={i} className={styles.completeStat}>
              <span className={styles.sdgNum}>{stat.sdg}</span> &middot; {stat.label}: <span>{stat.from}{stat.suffix} &rarr; {stat.to}{stat.suffix}</span>
            </p>
          ))}
        </div>
        <p className={styles.rarityNote}>
          In 1800, no one imagined this world. You lived to see it.
        </p>
        <div className={styles.shockFacts}>
          <p className={styles.shockLabel}>WHAT YOU WITNESSED</p>
          {lastRound.shockFacts.map((fact, i) => (
            <p key={i} className={styles.shockFact}>{fact}</p>
          ))}
        </div>
        <div className={styles.completeActions}>
          <button className={styles.btnClosing} onClick={() => setPhase("closing")}>
            SEE YOUR LEGACY &rarr;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.playingScreen}>
        <div className={styles.roundImageContainer}>
          <img src={round.image} alt={round.imageAlt} className={styles.roundImage} />
          <div className={styles.imageOverlay} />
          <div className={styles.imageYearOverlay}>
            <p className={styles.imageYear}>{round.year}</p>
            <p className={styles.imageAge}>Age {round.age}</p>
          </div>
        </div>
        <div className={styles.contextSection}>
          <p className={styles.roundTitle}>{round.title}</p>
          {contextVisible && (
            <p className={`${styles.contextText} ${styles.fadeIn}`}>
              {round.context}
            </p>
          )}
          {eraVisible && (
            <p className={`${styles.eraContext} ${styles.fadeIn}`}>
              {round.eraContext}
            </p>
          )}
          {phase === "choice" && (
            <div className={`${styles.choiceArea} ${styles.fadeIn}`}>
              <p className={styles.choiceLabel}>WHAT DO YOU DO?</p>
              {round.choices.map((choice, i) => (
                <button
                  key={i}
                  className={styles.choiceBtn}
                  onClick={() => { if (!soundEngine.isMuted()) soundEngine.playClick(); handleChoice(i); }}
                >
                  <span className={styles.choiceKey}>{i + 1}</span>
                  {choice.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
