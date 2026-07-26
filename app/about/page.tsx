import Nav from "@/components/ui/Nav";
import BackToExperience from "@/components/ui/BackToExperience";
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
        <section><h2>The premise</h2><p>Nine people keep the same family archive between 1800 and the present. Each receives a practice, object, or memory from the generation before. Their decisions shape what reaches the next keeper; they do not rewrite global history.</p></section>
        <section id="methodology"><h2>Methodology and uncertainty</h2><ul>{METHOD_NOTES.map((note) => <li key={note}>{note}</li>)}</ul></section>
        <section id="sources"><h2>Sources</h2><div className={styles.sources}>{SOURCES.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noreferrer"><span>{source.organization}</span><strong>{source.title}</strong><p>{source.usedFor}</p></a>)}</div></section>
        <section id="credits"><h2>Image note</h2><p>The historical scenes are interpretive illustrations, not documentary records of a particular person or location. They establish atmosphere; the cited datasets and publications carry the historical claims.</p></section>
        <BackToExperience className={styles.returnLink} />
      </main>
    </>
  );
}
