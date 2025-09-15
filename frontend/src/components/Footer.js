'use client';

import { useId, useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  // Unique pattern id so multiple instances won’t clash
  const uid = useId();
  const topPatternId = `footer-wave-top-${uid}`;

  // Authoring size for the wave tile; scaled in SVG via patternTransform
  const TILE_W = 700;   // one full sine period
  const TILE_H = 120;   // authoring height
  const waveHeight = 72; // keep in sync with --wave-h in CSS
  const waveScale = waveHeight / TILE_H;

  // Random horizontal offset (X) applied after mount to avoid SSR hydration issues
  const [offsetX, setOffsetX] = useState(0);
  useEffect(() => {
    setOffsetX(Math.floor(Math.random() * TILE_W)); // 0..TILE_W-1
  }, []);

  // Build seamless sine path (filled) for one tile
  const wavePathD = useMemo(() => {
    const steps = 72;
    const A = 28;                // amplitude in authoring units
    const baseline = TILE_H / 2; // 60 when TILE_H=120
    const twoPiOverW = (Math.PI * 2) / TILE_W;

    let d = `M0,${baseline}`;
    for (let i = 1; i <= steps; i++) {
      const x = (i / steps) * TILE_W;
      const y = baseline + A * Math.sin(twoPiOverW * x);
      d += ` L${x.toFixed(2)},${y.toFixed(2)}`;
    }
    d += ` L${TILE_W},${TILE_H} L0,${TILE_H} Z`;
    return d;
  }, []);

  return (
    <footer className={styles.footer} aria-labelledby="footer-title">
      {/* Top wave (tiled, flipped) — random X offset each mount */}
      <div className={styles.waveTop} aria-hidden="true">
        <svg className={styles.waveSvg} width="100%" height="100%">
          <defs>
            <pattern
              id={topPatternId}
              patternUnits="userSpaceOnUse"
              patternContentUnits="userSpaceOnUse"
              width={TILE_W}
              height={TILE_H}
              // translate(-offsetX, 0) then scale Y to waveHeight
              patternTransform={`translate(${-offsetX} 0) scale(1 ${waveScale})`}
            >
              <path d={wavePathD} className={styles.waveTopFill} />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill={`url(#${topPatternId})`} />
        </svg>
      </div>

      <div className="container">
        <div className={styles.grid}>
          {/* Left: Anything Electronic logo + copyright */}
          <div className={styles.colBrand}>
            <h2 id="footer-title" className={styles.logo}>
              <Link href="/" className={styles.logoLink} aria-label="Anything Electronic home">
                <Image
                  src="/icons/logow.svg"
                  alt="Anything Electronic logo"
                  width={180}
                  height={48}
                  priority
                  className={styles.logoImg}
                />
              </Link>
            </h2>
            <p className={styles.copyUnderLogo}>© 2025 Anything Electronic.</p>
          </div>

          {/* Center: Contact details with icons */}
          <div className={styles.colContact} aria-label="Contact">
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon} aria-hidden="true">
                  {/* location pin */}
                  <svg viewBox="0 0 24 24" width="20" height="20" role="img">
                    <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" fill="none" stroke="currentColor" strokeWidth="1.6"/>
                    <circle cx="12" cy="10" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.6"/>
                  </svg>
                </span>
                <address className={styles.contactText}>
                  <a
                    href="https://maps.google.com/?q=7+Bullen+Street+Tahunanui+Nelson+7011"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactLink}
                  >
                    7 Bullen Street, Tahunanui, Nelson 7011
                  </a>
                </address>
              </li>

              <li className={styles.contactItem}>
                <span className={styles.contactIcon} aria-hidden="true">
                  {/* phone */}
                  <svg viewBox="0 0 24 24" width="20" height="20" role="img">
                    <path d="M4 5a2 2 0 0 1 2-2h2l2 4-2 2c1.2 2.4 3.6 4.8 6 6l2-2 4 2v2a2 2 0 0 1-2 2c-8.3 0-14-5.7-14-14z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <a href="tel:+6435485336" className={styles.contactLink}>+64 3 548 5336</a>
              </li>

              <li className={styles.contactItem}>
                <span className={styles.contactIcon} aria-hidden="true">
                  {/* email */}
                  <svg viewBox="0 0 24 24" width="20" height="20" role="img">
                    <path d="M4 6h16v12H4z" fill="none" stroke="currentColor" strokeWidth="1.6"/>
                    <path d="M4 8l8 5 8-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </span>
                <a href="mailto:sales@anythingelectronic.co.nz" className={styles.contactLink}>
                  sales@anythingelectronic.co.nz
                </a>
              </li>
            </ul>
          </div>

          {/* Right: Made by Sidewalk (text link, centered) */}
          <div className={styles.colSite}>
            <a
              href="https://sidewalks.co.nz"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.siteTextLink}
              aria-label="Made by Sidewalk — visit sidewalks.co.nz"
            >
              Made by Sidewalk
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
