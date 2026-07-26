import Nav from "@/components/ui/Nav";
import Link from "next/link";
import { METHOD_NOTES, SOURCES } from "@/lib/evidence";
import styles from "./page.module.css";

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className={styles.page}>
        <p className={styles.kicker}>ABOUT THE PROJECT</p>
        <h1>Progress is real.<br />It is not finished.</h1>
        <p className={styles.lede}>Chronicle is an interactive historical essay created for CPM 2026. It follows humanity&apos;s uneven movement toward four Sustainable Development Goals through a timeline, a fictional generational journey, and a final invitation to act.</p>
        <section><h2>The premise</h2><p>The 226-year-old narrator is not a literal person. It is one lineage carrying memory from one generation to the next. Your decisions shape that lineage; they do not rewrite global history.</p></section>
        <section id="methodology"><h2>Methodology and uncertainty</h2><ul>{METHOD_NOTES.map((note) => <li key={note}>{note}</li>)}</ul></section>
        <section id="sources"><h2>Sources</h2><div className={styles.sources}>{SOURCES.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noreferrer"><span>{source.organization}</span><strong>{source.title}</strong><p>{source.usedFor}</p></a>)}</div></section>
        <section id="credits"><h2>Credits and image note</h2><p>Research is synthesized from the organizations listed above. Historical scenes are illustrative and should not be read as documentary evidence of a specific person or location. Add the original creator, license, and source URL for every competition image before submission.</p></section>
        <Link className={styles.returnLink} href="/timeline">RETURN TO THE TIMELINE →</Link>
      </main>
    </>
  );
}
