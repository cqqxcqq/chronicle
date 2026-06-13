"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./Nav.module.css";

const links = [
  { href: "/", label: "Opening" },
  { href: "/timeline", label: "Timeline" },
  { href: "/survival", label: "Your Life" },
];

export default function Nav() {
  const pathname = usePathname();

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
        </div>
      </div>
    </nav>
  );
}
