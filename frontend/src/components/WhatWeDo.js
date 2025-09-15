'use client';

import Link from 'next/link';
import styles from './WhatWeDo.module.css';

export default function WhatWeDo() {
  return (
    <section className={styles.section} aria-labelledby="what-title">
      {/* curved top blend into this section */}
      <div className={styles.topBlend} aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path
            d="M0,70 C220,120 440,18 720,66 C1000,114 1200,16 1440,64 L1440,0 L0,0 Z"
            className={styles.topHighlight}
          />
          <path
            d="M0,64 C220,120 440,0 720,48 C1000,96 1200,16 1440,64 L1440,120 L0,120 Z"
            className={styles.topFill}
          />
        </svg>
      </div>

      <div className="container">
        <header className={styles.header}>
          <span className={styles.kicker}>What we do</span>
          <h2 id="what-title" className={styles.title}>
            Design, build &amp; service electronics
          </h2>
        </header>

        <ul className={styles.grid} aria-label="Our services">
          <li className={styles.card}>
            <div className={styles.iconWrap} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28" role="img">
                <path d="M4 6h16v12H4z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="8" cy="10" r="1.25" fill="currentColor" />
                <circle cx="12" cy="10" r="1.25" fill="currentColor" />
                <circle cx="16" cy="10" r="1.25" fill="currentColor" />
                <path d="M8 10v6M12 10v6M16 10v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Product Manufacturing</h3>
            <p className={styles.cardText}>
              As a production and manufacturing company, we provide a full range of services: design, production and
              assembly of printed circuit boards. We offer prototypes, wiring and cable assembly, plus enclosures and
              product labelling.
            </p>
            <div className={styles.ctaRow}>
              <Link href="/shop" className={styles.cardLink}>
                Explore manufacturing <span className={styles.arrow} aria-hidden="true">→</span>
              </Link>
            </div>
          </li>

          <li className={styles.card}>
            <div className={styles.iconWrap} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28" role="img">
                <path d="M4 7h16v10H4z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 12h3l2 3 2-6 2 3h3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Specialized Electronic Servicing</h3>
            <p className={styles.cardText}>
              We service automotive electronic components and equipment that are difficult or expensive to replace.
              Our work covers a wide range of manufacturers, models, and applications—trucks, buses, heavy equipment,
              and machinery.
            </p>
            <div className={styles.ctaRow}>
              <Link href="/servicing" className={styles.cardLink}>
                View servicing <span className={styles.arrow} aria-hidden="true">→</span>
              </Link>
            </div>
          </li>

          <li className={styles.card}>
            <div className={styles.iconWrap} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28" role="img">
                <path d="M12 3a6 6 0 0 0-3 11.2V17h6v-2.8A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9 20h6M10 22h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Research &amp; Development</h3>
            <p className={styles.cardText}>
              We build solutions for markets where electronics are limited or don’t exist, and create alternatives
              where products are expensive, restricted in functionality, or not tailored to the job.
            </p>
            <div className={styles.ctaRow}>
              <Link href="/rnd" className={styles.cardLink}>
                Explore R&amp;D <span className={styles.arrow} aria-hidden="true">→</span>
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
