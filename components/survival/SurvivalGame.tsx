"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { SURVIVAL_ROUNDS } from "@/lib/survival-data";
import { getJourneyProfile } from "@/lib/survival-data";
import { soundEngine } from "@/lib/sound-engine";
import ClosingSequence from "./ClosingSequence";
import UnfinishedChapter from "./UnfinishedChapter";
import styles from "./SurvivalGame.module.css";

type Phase = "start" | "context" | "choice" | "result" | "progress" | "complete" | "unfinished" | "closing";
function inheritedFrom(text: string): string {
  const lower = text.toLowerCase();
  if (/breast|nurse|water|boiled/.test(lower)) return "a rule kept in every kitchen: protect the water";
  if (/share|volunteer|rebuild/.test(lower)) return "an empty place kept at the table for a neighbour";
  if (/document|memoir/.test(lower)) return "a bundle of pages passed from hand to hand";
  if (/medicine|hospital/.test(lower)) return "trust in the clinic, tempered by memory";
  if (/isolate/.test(lower)) return "the knowledge that distance can also be care";
  if (/flee|rural|forage/.test(lower)) return "a map of the roads that once led to safety";
  if (/traditional|remedies/.test(lower)) return "a cabinet of remedies, some useful and some dangerous";
  return "a story the next generation refuses to lose";
}

type EraSound = "want" | "industry" | "catastrophe" | "recovery" | "acceleration" | "goals";

function getEraForYear(year: number): EraSound {
  if (year < 1850) return "want";
  if (year < 1910) return "industry";
  if (year < 1950) return "catastrophe";
  if (year < 1990) return "recovery";
  if (year < 2020) return "acceleration";
  return "goals";
}

export default function SurvivalGame() {
  const [phase, setPhase] = useState<Phase>("start");
  const [roundIdx, setRoundIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [contextVisible, setContextVisible] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [counterValues, setCounterValues] = useState<Record<number, number>>({});
  const [transitionYear, setTransitionYear] = useState(SURVIVAL_ROUNDS[0].year);
  const [isPivotal, setIsPivotal] = useState(false);
  const [choiceHistory, setChoiceHistory] = useState<{ year: number; title: string; text: string; inheritance: string }[]>([]);
  const [lastInheritance, setLastInheritance] = useState("");

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
      soundEngine.stopAll();
    };
  }, [clearTimers, clearRafs]);

  useEffect(() => {
    SURVIVAL_ROUNDS.forEach((r) => {
      const img = new window.Image();
      img.src = r.image;
    });
  }, []);

  useEffect(() => {
    if (phase !== "context") return;

    if (!soundEngine.isMuted()) {
      soundEngine.playEra(getEraForYear(round.year));
    }

    const t1 = window.setTimeout(() => setContextVisible(true), 300);
    const t2 = window.setTimeout(() => setPhase("choice"), 1200);
    addTimer(t1); addTimer(t2);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase, roundIdx, addTimer, round.year]);

const handleChoice = useCallback((choiceIdx: number) => {
    const inheritance = inheritedFrom(round.choices[choiceIdx].text);
    setSelectedChoice(choiceIdx);
    setResultVisible(false);
    setCounterValues({});
    setIsPivotal(round.choices[choiceIdx].pivotal === true);
    setChoiceHistory(prev => [...prev, { year: round.year, title: round.title, text: round.choices[choiceIdx].text, inheritance }]);
    setLastInheritance(inheritance);
    setPhase("result");
    if (!soundEngine.isMuted()) soundEngine.playClick();

    const t = window.setTimeout(() => setResultVisible(true), 400);
    addTimer(t);
  }, [addTimer, round.choices, round.title, round.year]);

  useEffect(() => {
    if (phase !== "result" || !resultVisible) return;
    if (!soundEngine.isMuted()) soundEngine.playSurvive();
  }, [phase, resultVisible]);

useEffect(() => {
    if (phase !== "progress") return;

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
      setSelectedChoice(null);
      setContextVisible(false);
      setResultVisible(false);
      setCounterValues({});
      setPhase("context");
    } else {
      soundEngine.stopAll();
      setPhase("complete");
    }
  }, [roundIdx]);

  useEffect(() => {
    if (phase !== "progress") return;
    const isLastRound = roundIdx === SURVIVAL_ROUNDS.length - 1;
    const nextYear = isLastRound ? round.year : SURVIVAL_ROUNDS[roundIdx + 1].year;
    const holdDuration = round.sdgProgress.length > 0 ? 2600 : 900;
    const transitionDuration = isLastRound ? 900 : 1800;
    let transitionRaf = 0;

    const startTimer = window.setTimeout(() => {
      const startedAt = performance.now();
      const animateYear = (now: number) => {
        const progress = Math.min((now - startedAt) / transitionDuration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setTransitionYear(Math.round(round.year + (nextYear - round.year) * eased));
        if (progress < 1) {
          transitionRaf = requestAnimationFrame(animateYear);
        } else {
          handleContinue();
        }
      };
      transitionRaf = requestAnimationFrame(animateYear);
    }, holdDuration);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(transitionRaf);
    };
  }, [phase, roundIdx, round.year, round.sdgProgress.length, handleContinue]);

const handleRestart = useCallback(() => {
    clearTimers();
    clearRafs();
    soundEngine.stopAll();
    setPhase("start");
    setRoundIdx(0);
    setSelectedChoice(null);
    setContextVisible(false);
    setResultVisible(false);
    setCounterValues({});
    setChoiceHistory([]);
    setLastInheritance("");
  }, [clearTimers, clearRafs]);

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

  const progressPct = ((roundIdx + 1) / SURVIVAL_ROUNDS.length) * 100;

  const progressBar = (
    <div className={styles.progressWrap}>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
      </div>
      <p className={styles.progressText}>ROUND {roundIdx + 1} OF {SURVIVAL_ROUNDS.length}</p>
    </div>
  );

  if (phase === "closing") {
    const profile = getJourneyProfile();
    return (
      <ClosingSequence onEnd={handleRestart} journeyProfile={profile} choiceHistory={choiceHistory} />
    );
  }
  if (phase === "unfinished") return <div className={styles.completeOverlay}><UnfinishedChapter inheritances={choiceHistory.map((entry) => entry.inheritance)} onContinue={() => setPhase("closing")} /></div>;

  if (phase === "start") {
    return (
      <div className={styles.container}>
        <div className={styles.startScreen}>
          <h1 className={styles.startTitle}>THE ARCHIVE BEGINS IN 1800</h1>
          <p className={styles.startBridge}>
            Carry one family archive across nine generations. Each life receives something unfinished from the one before it.
          </p>
          <p className={styles.startSubtitle}>
            Nine generations, from 1800 to the latest available global estimates.
          </p>
          <p className={styles.startInfo}>
            You cannot change the record. You can decide what survives it.
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
          {progressBar}
          <div className={styles.roundImageContainer}>
            <Image src={round.image} alt={round.imageAlt} fill sizes="100vw" priority className={styles.roundImage} />
            <div className={styles.imageOverlay} />
            <div className={styles.imageYearOverlay}>
              <h1 className={styles.imageYear} aria-live="polite">{transitionYear}</h1>
              <p className={styles.imageAge}>Generation {roundIdx + 1} of {SURVIVAL_ROUNDS.length}</p>
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
            <p className={styles.autoAdvance}>
              {roundIdx < SURVIVAL_ROUNDS.length - 1 ? "THE NEXT GENERATION IS APPROACHING" : "PREPARING THE ARCHIVE"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "result") {
    const choice = selectedChoice !== null ? round.choices[selectedChoice] : null;
    const outcome = choice?.outcome ?? "";
    return (
      <div className={styles.container}>
        {isPivotal && <div className={styles.pivotalFlash} />}
        <div className={styles.playingScreen}>
          {progressBar}
          <div className={styles.roundImageContainer}>
            <Image src={round.image} alt={round.imageAlt} fill sizes="100vw" priority className={styles.roundImage} />
            <div className={styles.imageOverlay} />
            <div className={styles.imageYearOverlay}>
              <h1 className={styles.imageYear}>{round.year}</h1>
              <p className={styles.imageAge}>Generation {roundIdx + 1} of {SURVIVAL_ROUNDS.length}</p>
            </div>
          </div>
          <div className={styles.resultSection}>
            <p className={styles.roundTitle}>{round.title}</p>
            {resultVisible && (
              <div className={`${styles.resultContent} ${styles.fadeIn}`}>
                <p className={styles.resultNarrative}>{outcome}</p>
                <p className={styles.inheritance} aria-live="polite"><span>CARRIED FORWARD</span>{lastInheritance}</p>
                {choice?.altOutcome && <details className={styles.roadNotTaken}><summary>THE ROAD NOT TAKEN</summary><p>{choice.altOutcome}</p></details>}
              </div>
            )}
            {resultVisible && (
              <button className={styles.btnContinue} onClick={() => { setTransitionYear(round.year); setPhase("progress"); }}>
                CONTINUE
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "complete") {
    const profile = getJourneyProfile();
    return (
      <div className={styles.completeOverlay}>
        <h1 className={styles.completeTitle}>THE ARCHIVE REACHED THE PRESENT</h1>
        <p className={styles.completeSubtitle}>
          Nine generations carried the archive from 1800 to the present.
        </p>
        <div className={styles.journeyBadge}>
          <p className={styles.journeyTitle}>{profile.title}</p>
          <p className={styles.journeyDesc}>{profile.description}</p>
        </div>
        <div className={styles.journeyTimeline}>
          <p className={styles.journeyTimelineLabel}>YOUR JOURNEY</p>
          {choiceHistory.map((entry, i) => (
            <div key={i} className={styles.journeyStep}>
              <span className={styles.journeyYear}>{entry.year}</span>
              <span className={styles.journeyDot} />
              <span className={styles.journeyText}>{entry.inheritance}</span>
            </div>
          ))}
        </div>
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
        <div className={styles.completeActions}>
          <button className={styles.btnClosing} onClick={() => setPhase("unfinished")}>
            FACE WHAT REMAINS →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.playingScreen}>
        {progressBar}
        <div className={styles.roundImageContainer}>
          <Image src={round.image} alt={round.imageAlt} fill sizes="100vw" className={styles.roundImage} />
          <div className={styles.imageOverlay} />
          <div className={styles.imageYearOverlay}>
            <h1 className={styles.imageYear}>{round.year}</h1>
            <p className={styles.imageAge}>Generation {roundIdx + 1} of {SURVIVAL_ROUNDS.length}</p>
          </div>
        </div>
<div className={styles.contextSection}>
          <p className={styles.roundTitle}>{round.title}</p>
          {contextVisible && (
            <p className={`${styles.contextText} ${styles.fadeIn}`}>
              {round.context}
            </p>
          )}
          {phase === "choice" && (
            <div className={`${styles.choiceArea} ${styles.fadeIn}`}>
              <p className={styles.choiceLabel}>{round.prompt ?? "WHAT DOES THIS GENERATION DO?"}</p>
              {round.choices.map((choice, i) => (
                <button
                  key={i}
                  className={`${styles.choiceBtn} ${choice.pivotal ? styles.pivotalBtn : ""}`}
                  onClick={() => { if (!soundEngine.isMuted()) soundEngine.playClick(); handleChoice(i); }}
                >
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
