"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SURVIVAL_ROUNDS, getTotalDeaths, addDeath } from "@/lib/survival-data";
import { soundEngine } from "@/lib/sound-engine";
import ClosingSequence from "./ClosingSequence";
import styles from "./SurvivalGame.module.css";

type Phase = "start" | "context" | "choice" | "rolling" | "result" | "dead" | "complete" | "closing";

export default function SurvivalGame() {
  const [phase, setPhase] = useState<Phase>("start");
  const [roundIdx, setRoundIdx] = useState(0);
  const [rollValue, setRollValue] = useState<number | null>(null);
  const [survived, setSurvived] = useState<boolean | null>(null);
  const [lives, setLives] = useState(0);
  const [bestAge, setBestAge] = useState(0);
  const [rollingNumber, setRollingNumber] = useState(0);
  const [showContinueBtn, setShowContinueBtn] = useState(false);
  const [contextVisible, setContextVisible] = useState(false);
  const [eraVisible, setEraVisible] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [totalDeaths, setTotalDeaths] = useState(0);
  const [deathRound, setDeathRound] = useState<number>(0);
  const [deathAge, setDeathAge] = useState<number>(0);

  const round = SURVIVAL_ROUNDS[roundIdx];
  const timersRef = useRef<number[]>([]);
  const rollIntervalRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((id: number) => {
    timersRef.current.push(id);
  }, []);

  useEffect(() => {
    setTotalDeaths(getTotalDeaths());
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

  useEffect(() => {
    if (phase !== "context") return;
    setRollValue(null);
    setSurvived(null);
    setShowContinueBtn(false);
    setContextVisible(false);
    setEraVisible(false);
    setSelectedChoice(null);

    const t1 = window.setTimeout(() => setContextVisible(true), 500);
    const t2 = window.setTimeout(() => setEraVisible(true), 1200);
    const t3 = window.setTimeout(() => setPhase("choice"), 2000);
    addTimer(t1); addTimer(t2); addTimer(t3);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase, roundIdx, addTimer]);

  const handleChoice = useCallback((choiceIdx: number) => {
    setSelectedChoice(choiceIdx);
    setPhase("rolling");
    if (!soundEngine.isMuted()) soundEngine.playHeartbeat();

    const choice = round.choices[choiceIdx];
    const effectiveChance = Math.min(0.95, round.survivalChance + choice.modifier);
    const thresholdPct = Math.round(effectiveChance * 100);
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
      if (!soundEngine.isMuted()) soundEngine.playSurvive();
      setBestAge((prev) => Math.max(prev, round.age));
      const t = window.setTimeout(() => setShowContinueBtn(true), 2200);
      addTimer(t);
      return () => clearTimeout(t);
    } else {
      if (!soundEngine.isMuted()) soundEngine.playDeath();
      const newDeaths = addDeath();
      setTotalDeaths(newDeaths);
      setDeathRound(roundIdx);
      setDeathAge(round.age);
      setLives((prev) => prev + 1);
      const t = window.setTimeout(() => setPhase("dead"), 2200);
      addTimer(t);
      return () => clearTimeout(t);
    }
  }, [phase, survived, round.age, addTimer, roundIdx]);

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
    setShowContinueBtn(false);
    setContextVisible(false);
    setEraVisible(false);
    setRollingNumber(0);
    setSelectedChoice(null);
  }, [clearTimers]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        if (phase === "choice" && selectedChoice === null) return;
        if (phase === "result" && survived && showContinueBtn) handleContinue();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase, survived, showContinueBtn, handleContinue, selectedChoice]);

  const canSkipToClosing = totalDeaths >= 3;

  if (phase === "closing") {
    return (
      <ClosingSequence
        onEnd={handleRetry}
        totalDeaths={totalDeaths}
        diedAtRound={deathRound}
        diedAtAge={deathAge}
      />
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
            Two hundred years of human history. One human life.
            <br />
            You will almost certainly die young.
          </p>
          <p className={styles.startWarning}>
            Most people born in 1800 never saw 40.
          </p>
          {totalDeaths > 0 && (
            <p className={styles.deathCount}>You have died {totalDeaths} time{totalDeaths !== 1 ? "s" : ""}.</p>
          )}
          <button className={styles.btnStart} onClick={() => { if (!soundEngine.isMuted()) soundEngine.playClick(); setPhase("context"); }}>
            BEGIN
          </button>
        </div>
      </div>
    );
  }

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
            <p className={styles.statLabel}>Deaths</p>
            <p className={styles.statValue}>{totalDeaths}</p>
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
          {canSkipToClosing && (
            <button className={styles.btnClosing} onClick={() => setPhase("closing")}>
              THE STORY CONTINUES →
            </button>
          )}
        </div>
      </div>
    );
  }

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

  if (phase === "result" && rollValue !== null && survived !== null) {
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
            {selectedChoice !== null && (
              <p className={styles.choiceResult}>
                You chose: {round.choices[selectedChoice].text}
              </p>
            )}
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
        {phase === "choice" && (
          <div className={styles.choiceArea} style={{ animation: "fadeIn 0.5s ease-out" }}>
            <p className={styles.choiceLabel}>WHAT DO YOU DO?</p>
            {round.choices.map((choice, i) => (
              <button
                key={i}
                className={styles.choiceBtn}
                onClick={() => { if (!soundEngine.isMuted()) soundEngine.playClick(); handleChoice(i); }}
              >
                {choice.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
