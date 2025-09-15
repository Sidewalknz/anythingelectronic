'use client';

import Link from 'next/link';
import styles from './Capabilities.module.css';

export default function Capabilities() {
  return (
    <section className={styles.section} aria-labelledby="capabilities-title">
      <div className="container">
        <header className={styles.header}>
          <span className={styles.kicker}>Capabilities</span>
          <h2 id="capabilities-title" className={styles.title}>
            From idea to integrated systems
          </h2>
        </header>

        <ul className={styles.grid} aria-label="Our capabilities">
          <li className={styles.card}>
            <div className={styles.iconWrap} aria-hidden="true">
              {/* Pick & Place / SMT */}
              <svg viewBox="0 0 24 24" width="28" height="28" role="img">
                <path d="M4 18h16M6 15h4l2-3 2 3h4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 4v5m0 0l2 2m-2-2l-2 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Pick and Place</h3>
            <p className={styles.cardText}>
              High speed SMT placement of SMD parts on PCBs. We place resistors, capacitors, ICs and odd-form parts with
              tight accuracy. Suitable for prototypes and production across computers, consumer, industrial, medical,
              automotive and telecom.
            </p>
            <div className={styles.ctaRow}>
              <Link href="/contact" className={styles.cardLink}>
                Ask about SMT <span className={styles.arrow} aria-hidden="true">→</span>
              </Link>
            </div>
          </li>

          <li className={styles.card}>
            <div className={styles.iconWrap} aria-hidden="true">
              {/* PCB & Circuit Design */}
              <svg viewBox="0 0 24 24" width="28" height="28" role="img">
                <rect x="4" y="5" width="16" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="9" cy="10" r="1.25" fill="currentColor"/>
                <circle cx="15" cy="10" r="1.25" fill="currentColor"/>
                <path d="M9 10v6M15 10v6M12 12h0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>PCB &amp; Circuit Design</h3>
            <p className={styles.cardText}>
              We turn ideas into manufacturable boards. From schematic and simulation to placement and routing, we handle
              DFM, stackups and clear fabrication outputs so your design moves to build without surprises.
            </p>
            <div className={styles.ctaRow}>
              <Link href="/rnd" className={styles.cardLink}>
                See design approach <span className={styles.arrow} aria-hidden="true">→</span>
              </Link>
            </div>
          </li>

          <li className={styles.card}>
            <div className={styles.iconWrap} aria-hidden="true">
              {/* Box Builds */}
              <svg viewBox="0 0 24 24" width="28" height="28" role="img">
                <path d="M12 3l8 4v10l-8 4-8-4V7l8-4z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 7l8 4M12 7L4 11M12 7v10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Box Builds</h3>
            <p className={styles.cardText}>
              Complete assemblies from a single PCBA in a small case to cabinet level systems. We manage mechanicals,
              wiring, labeling and full system test so the finished unit is ready to deploy.
            </p>
            <div className={styles.ctaRow}>
              <Link href="/contact" className={styles.cardLink}>
                Discuss integration <span className={styles.arrow} aria-hidden="true">→</span>
              </Link>
            </div>
          </li>

          <li className={styles.card}>
            <div className={styles.iconWrap} aria-hidden="true">
              {/* Specification Writing */}
              <svg viewBox="0 0 24 24" width="28" height="28" role="img">
                <rect x="4" y="3" width="12" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 7h4M8 10h6M8 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M16 15l3 3-4 1 1-4z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Specification Writing</h3>
            <p className={styles.cardText}>
              Clear specs that define scope, interfaces and acceptance tests. We map phases and deliverables so
              requirements stay traceable and the work stays on time and on budget.
            </p>
            <div className={styles.ctaRow}>
              <Link href="/contact" className={styles.cardLink}>
                Start a spec <span className={styles.arrow} aria-hidden="true">→</span>
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
