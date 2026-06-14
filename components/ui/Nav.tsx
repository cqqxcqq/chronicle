"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSound } from "./SoundProvider";
import styles from "./Nav.module.css";

const links = [
  { href: "/", label: "Opening" },
  { href: "/timeline", label: "Timeline" },
  { href: "/survival", label: "Your Life" },
];

export default function Nav() {
  const pathname = usePathname();
  const { muted, toggle } = useSound();

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            CHRONICLE
          </Link>
          <span className={styles.separator} />
          <span className={styles.tagline}>A HISTORY OF HUMAN PROGRESS</span>
        </div>
        <div className={styles.right}>
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.link} ${isActive ? styles.active : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            className={styles.soundBtn}
            onClick={toggle}
            aria-label={muted ? "Unmute sound" : "Mute sound"}
          >
            {muted ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L4 5.5H1V10.5H4L8 14V2Z" stroke="currentColor" strokeWidth="1" fill="none"/>
                <line x1="11" y1="5" x2="15" y2="11" stroke="currentColor" strokeWidth="1"/>
                <line x1="15" y1="5" x2="11" y2="11" stroke="currentColor" strokeWidth="1"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L4 5.5H1V10.5H4L8 14V2Z" stroke="currentColor" strokeWidth="1" fill="none"/>
                <path d="M10.5 5.5C11.5 6.5 12 7.7 12 8C12 9.1 11.3 10.2 10.5 11" stroke="currentColor" strokeWidth="1" fill="none"/>
                <path d="M12.5 3.5C14 5 15 6.5 15 8C15 9.5 14 11 12.5 12.5" stroke="currentColor" strokeWidth="1" fill="none"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
