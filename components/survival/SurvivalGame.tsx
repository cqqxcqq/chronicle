"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SURVIVAL_ROUNDS } from "@/lib/survival-data";
import { soundEngine } from "@/lib/sound-engine";
import { useSound } from "@/components/ui/SoundProvider";
import ClosingSequence from "./ClosingSequence";
import styles from "./SurvivalGame.module.css";

type Phase = "start" | "context" | "rolling" | "result" | "dead" | "complete" | "closing";

export default function SurvivalGame() {
  const [phase, setPhase] = useState<Phase>("start");
  const [roundIdx, setRoundIdx] = useState(0);
  const [rollValue, setRollValue] = useState<number | null>(null);
  const [survived, setSurvived] = useState<boolean | null>(null);
  const [lives, setLives] = useState(0);
  const [bestAge, setBestAge] = useState(0);
  const [rollingNumber, setRollingNumber] = useState(0);
  const [showRollBtn, setShowRollBtn] = useState(false);
  const [showContinueBtn, setShowContinueBtn] = useState(false);
  const [contextVisible, setContextVisible] = useState(false);
  const [eraVisible, setEraVisible] = useState(false);

  const round = SURVIVAL_ROUNDS[roundIdx];
  const timersRef = useRef<number[]>([]);
  const rollIntervalRef = useRef<number | null>(null);
  const { muted } = useSound();

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((id: number) => {
    timersRef.current.push(id);
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      if (rollIntervalRef.current) {
        clearInterval(rollIntervalRef.current);
        rollIntervalRef.current = null;
      }
    };
  }, [clearTimers]);

  // Phase transition to "context"
  useEffect(() => {
    if (phase !== "context") return;
    setRollValue(null);
    setSurvived(null);
    setShowRollBtn(false);
    setShowContinueBtn(false);
    setContextVisible(false);
    setEraVisible(false);

    const t1 = window.setTimeout(() => setContextVisible(true), 500);
    const t2 = window.setTimeout(() => setEraVisible(true), 1400);
    const t3 = window.setTimeout(() => setShowRollBtn(true), 2400);
    addTimer(t1); addTimer(t2); addTimer(t3);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase, roundIdx, addTimer]);

  const handleRoll = useCallback(() => {
    if (rollIntervalRef.current) return;
    setPhase("rolling");
    if (!muted) soundEngine.playHeartbeat();
    const thresholdPct = Math.round(round.survivalChance * 100);
    let count = 0;

    rollIntervalRef.current = window.setInterval(() => {
      count++;
      setRollingNumber(Math.floor(Math.random() * 100) + 1);
      if (count >= 28) {
        if (rollIntervalRef.current) {
          clearInterval(rollIntervalRef.current);
          rollIntervalRef.current = null;
        }
        const finalRoll = Math.floor(Math.random() * 100) + 1;
        const didSurvive = finalRoll <= thresholdPct;
        setRollValue(finalRoll);
        setSurvived(didSurvive);
        setPhase("result");
      }
    }, 55);
  }, [round]);

  useEffect(() => {
    if (phase !== "result" || survived === null) return;
    if (survived) {
      if (!muted) soundEngine.playSurvive();
      setBestAge((prev) => Math.max(prev, round.age));
      const t = window.setTimeout(() => setShowContinueBtn(true), 2200);
      addTimer(t);
      return () => clearTimeout(t);
    } else {
      if (!muted) soundEngine.playDeath();
      setLives((prev) => prev + 1);
      const t = window.setTimeout(() => setPhase("dead"), 2200);
      addTimer(t);
      return () => clearTimeout(t);
    }
  }, [phase, survived, round.age, addTimer, muted]);

  const handleContinue = useCallback(() => {
    if (roundIdx < SURVIVAL_ROUNDS.length - 1) {
      setRoundIdx((i) => i + 1);
      setPhase("context");
    } else {
      setPhase("complete");
    }
  }, [roundIdx]);

  const handleRetry = useCallback(() => {
    clearTimers();
    if (rollIntervalRef.current) {
      clearInterval(rollIntervalRef.current);
      rollIntervalRef.current = null;
    }
    setPhase("start");
    setRoundIdx(0);
    setRollValue(null);
    setSurvived(null);
    setShowRollBtn(false);
    setShowContinueBtn(false);
    setContextVisible(false);
    setEraVisible(false);
    setRollingNumber(0);
  }, [clearTimers]);

  // ─── CLOSING SCREEN ───
  if (phase === "closing") {
    return <ClosingSequence onEnd={handleRetry} />;
  }

  // ─── START SCREEN ───
  if (phase === "start") {
    return (
      <div className={styles.container}>
        <div className={styles.startScreen}>
          <p className={styles.startTitle}>YOU WERE BORN IN 1800</p>
          <p className={styles.startSubtitle}>
            Two hundred years of human history. One human life.
            <br />
            You will almost certainly die young.
          </p>
          <p className={styles.startWarning}>
            Most people born in 1800 never saw 40.
          </p>
          <button className={styles.btnStart} onClick={() => { if (!muted) soundEngine.playClick(); setPhase("context"); }}>
            BEGIN
          </button>
        </div>
      </div>
    );
  }

  // ─── DEATH SCREEN ───
  if (phase === "dead") {
    return (
      <div className={styles.deathOverlay}>
        <p className={styles.deathTitle}>YOU DIED</p>
        <p className={styles.deathSubtitle}>{round.deathNarrative}</p>
        <p className={styles.deathYear}>
          {round.year} — Age {round.age}
        </p>
        <p className={styles.deathCause}>{round.title}</p>
        <div className={styles.statsRow}>
          <div className={styles.statBlock}>
            <p className={styles.statLabel}>Lives</p>
            <p className={styles.statValue}>{lives}</p>
          </div>
          <div className={styles.statBlock}>
            <p className={styles.statLabel}>Best Age</p>
            <p className={styles.statValue}>{bestAge}</p>
          </div>
          <div className={styles.statBlock}>
            <p className={styles.statLabel}>Survived To</p>
            <p className={styles.statValue}>{round.year}</p>
          </div>
        </div>
        <p className={styles.livesRow}>
          When you were born, {Math.round(round.survivalChance * 100)}% of people
          survived this stage.
        </p>
        <div className={styles.shockFacts}>
          <p className={styles.shockLabel}>HISTORICAL SHOCK</p>
          {round.shockFacts.map((fact, i) => (
            <p key={i} className={styles.shockFact}>{fact}</p>
          ))}
        </div>
        <div className={styles.deathActions}>
          <button className={styles.btnRetry} onClick={handleRetry}>
            TRY AGAIN
          </button>
          <button className={styles.btnClosing} onClick={() => setPhase("closing")}>
            THE STORY CONTINUES →
          </button>
        </div>
      </div>
    );
  }

  // ─── COMPLETE SCREEN ───
  if (phase === "complete") {
    return (
      <div className={styles.completeOverlay}>
        <p className={styles.completeTitle}>YOU SURVIVED</p>
        <p className={styles.completeSubtitle}>
          224 years. You witnessed the greatest transformation in human history.
        </p>
        <div className={styles.completeStats}>
          <p className={styles.completeStat}>
            Poverty: <span>89% → 8.5%</span>
          </p>
          <p className={styles.completeStat}>
            Child mortality: <span>460 → 37</span> per 1,000
          </p>
          <p className={styles.completeStat}>
            Literacy: <span>12% → 87%</span>
          </p>
          <p className={styles.completeStat}>
            Life expectancy: <span>29 → 73</span> years
          </p>
        </div>
        <p className={styles.rarityNote}>
          You are 1 in 3 million. Most never lived past 40.
        </p>
        <div className={styles.shockFacts}>
          <p className={styles.shockLabel}>WHAT YOU WITNESSED</p>
          {SURVIVAL_ROUNDS[SURVIVAL_ROUNDS.length - 1].shockFacts.map((fact, i) => (
            <p key={i} className={styles.shockFact}>{fact}</p>
          ))}
        </div>
        <div className={styles.deathActions}>
          <button className={styles.btnAgain} onClick={handleRetry}>
            PLAY AGAIN
          </button>
          <button className={styles.btnClosing} onClick={() => setPhase("closing")}>
            THE STORY CONTINUES →
          </button>
        </div>
      </div>
    );
  }

  // ─── ROLLING ANIMATION ───
  if (phase === "rolling") {
    return (
      <div className={styles.container}>
        <div className={styles.playingScreen}>
          <p className={styles.yearDisplay}>{round.year}</p>
          <p className={styles.ageDisplay}>Age {round.age}</p>
          <div className={styles.eraDivider} />
          <div className={styles.rollContainer}>
            <p className={styles.rollPercent}>{rollingNumber}%</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULT SCREEN ───
  if (phase === "result" && rollValue !== null && survived !== null) {
    const threshold = Math.round(round.survivalChance * 100);
    return (
      <div className={styles.container}>
        <div className={styles.playingScreen}>
          <p className={styles.yearDisplay}>{round.year}</p>
          <p className={styles.ageDisplay}>Age {round.age}</p>
          <div className={styles.eraDivider} />
          <div className={styles.rollContainer}>
            <p
              className={`${styles.rollPercent} ${
                survived ? "" : styles.dead
              }`}
            >
              {rollValue}%
            </p>
            <p
              className={`${styles.resultNarrative} ${
                survived ? styles.survived : styles.died
              }`}
            >
              {survived ? round.surviveNarrative : round.deathNarrative}
            </p>
            {survived && showContinueBtn && (
              <button
                className={styles.btnContinue}
                onClick={handleContinue}
              >
                {roundIdx < SURVIVAL_ROUNDS.length - 1
                  ? "CONTINUE"
                  : "SEE THE FINAL"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── CONTEXT SCREEN ───
  return (
    <div className={styles.container}>
      <div className={styles.playingScreen}>
        <p className={styles.yearDisplay}>{round.year}</p>
        <p className={styles.ageDisplay}>Age {round.age}</p>
        <div className={styles.eraDivider} />
        <p className={styles.roundTitle}>{round.title}</p>
        {contextVisible && (
          <p className={styles.contextText} style={{ animation: "fadeIn 0.6s ease-out" }}>
            {round.context}
          </p>
        )}
        {eraVisible && (
          <p className={styles.eraContext} style={{ animation: "fadeIn 0.6s ease-out" }}>
            {round.eraContext}
          </p>
        )}
        {showRollBtn && (
          <div className={styles.rollArea}>
            <p className={styles.eraContext} style={{ fontSize: "13px", marginBottom: 0 }}>
              Survival chance: {Math.round(round.survivalChance * 100)}%
            </p>
            <button className={styles.btnRoll} onClick={handleRoll}>
              ROLL FOR SURVIVAL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
