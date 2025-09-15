'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    const onScroll = () => setScrolled(window.scrollY > 10);

    onScroll(); // set initial state on mount
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : styles.atTop}`}>
      <a href="#main" className={styles.skip}>Skip to content</a>

      <div className={styles.container}>
        {/* Logo only — black at top, white after scroll */}
        <div className={styles.left}>
          <Link href="/" className={styles.brand} aria-label="Go to Anything Electronic home">
            <Image
              src={scrolled ? "/icons/logow.svg" : "/icons/logo.svg"}
              alt="Anything Electronic"
              width={56}
              height={56}
              priority
              className={styles.logoImg}
            />
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.list}>
            <li><Link className={styles.link} href="/">Home</Link></li>
            <li><Link className={styles.link} href="/shop">Shop</Link></li>
            <li><Link className={styles.link} href="/servicing">Servicing</Link></li>
            <li><Link className={styles.link} href="/rnd">R&amp;D</Link></li>
            <li>
              <Link className={`${styles.link} ${styles.cta}`} href="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile menu button */}
        <button
          className={styles.menuBtn}
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(v => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className={`${styles.overlay} ${open ? styles.show : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile slideout */}
      <nav
        id="mobile-menu"
        className={`${styles.mobile} ${open ? styles.open : ""}`}
        aria-label="Mobile primary"
      >
        <ul className={styles.mobileList} onClick={() => setOpen(false)}>
          <li><Link className={styles.mobileLink} href="/">Home</Link></li>
          <li><Link className={styles.mobileLink} href="/shop">Shop</Link></li>
          <li><Link className={styles.mobileLink} href="/servicing">Servicing</Link></li>
          <li><Link className={styles.mobileLink} href="/rnd">R&amp;D</Link></li>
          <li><Link className={`${styles.mobileLink} ${styles.cta}`} href="/contact">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
}
