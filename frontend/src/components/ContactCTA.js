'use client';

import Link from 'next/link';
import styles from './ContactCTA.module.css';

export default function ContactCTA() {
  return (
    <section className={styles.section} aria-labelledby="contact-title">
      <div className="container">
        <header className={styles.header}>
          <h2 id="contact-title" className={styles.title}>Contact Us Today!</h2>
          <p className={styles.blurb}>
            Phone, email or pop in for a visit today! Get in touch between
            <strong> 8:30am – 5:00pm, Monday – Friday</strong>.
          </p>
        </header>

        <div className={styles.actions}>
          <Link href="/contact" className={styles.primaryBtn} aria-label="Go to the contact page">
            Go to Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
