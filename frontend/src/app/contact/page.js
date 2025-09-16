'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getSelection, removeItem, clearSelection, updateQuantity } from '@/lib/selection';
import styles from './ContactPage.module.css';

/** Build a .webp path under /public/products, or placeholder if none provided */
const toWebpPath = (image) => {
  if (!image) return '/products/placeholder.webp';
  const safe = image.replace(/\.(jpe?g|png|gif|webp)$/i, '');
  return `/products/${safe}.webp`;
};

/** Small component to handle onError fallback to placeholder.webp */
function RowThumbImage({ image, alt, className, width = 120, height = 90, sizes = '120px' }) {
  const [errored, setErrored] = useState(false);
  const src = errored ? '/products/placeholder.webp' : toWebpPath(image);
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}

export default function ContactPage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const sync = () => setItems(getSelection());
    sync();
    window.addEventListener('ae-selection-change', sync);
    return () => window.removeEventListener('ae-selection-change', sync);
  }, []);

  const mailtoSelected = useMemo(() => {
    const subject = encodeURIComponent('Product enquiry');
    const lines = items
      .map(i => `- ${i.partnumber} — ${i.title} (Qty: ${i.qty ?? 1})`)
      .join('%0D%0A');
    const body = encodeURIComponent(
      `Hello Anything Electronic,%0D%0A%0D%0AI’m interested in:%0D%0A${lines}%0D%0A%0D%0AThanks,`
    );
    return `mailto:sales@anythingelectronic.co.nz?subject=${subject}&body=${body}`;
  }, [items]);

  const mailtoGeneral = useMemo(() => {
    const subject = encodeURIComponent('General enquiry');
    const sig = `%0D%0A%0D%0A— ${encodeURIComponent(name)}${
      email ? encodeURIComponent(` <${email}>`) : ''
    }`;
    const body = encodeURIComponent(message).replace(/%0A/g, '%0D%0A');
    return `mailto:sales@anythingelectronic.co.nz?subject=${subject}&body=${body}${sig}`;
  }, [name, email, message]);

  const canSend =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    message.trim().length > 0;

  const onSubmitGeneral = (e) => {
    e.preventDefault();
    if (!canSend) return;
    window.location.href = mailtoGeneral;
  };

  const onQtyChange = (partnumber, value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return;
    updateQuantity(partnumber, n);
    // state will refresh via 'ae-selection-change' event
  };

  return (
    <main className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>Get in touch</h1>
        <p className={styles.subtitle}>
          Add items from the <Link href="/catalog">catalog</Link>, or send us a general enquiry below.
        </p>
      </header>

      {/* Selected items panel */}
      <section className={styles.panel}>
        <div className={styles.panelTop}>
          <h2 className={styles.sectionTitle}>Your selected items</h2>
          <div className={styles.actions}>
            {items.length > 0 && (
              <>
                <a className={styles.primary} href={mailtoSelected}>Email selection</a>
                <button className={styles.linkBtn} onClick={clearSelection}>Clear all</button>
              </>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <p className={styles.empty}>
            You haven’t added anything yet. Browse the <Link href="/catalog">catalog</Link> and click <strong>Add</strong>.
          </p>
        ) : (
          <ul className={styles.selList} aria-label="Selected products">
            {items.map((i) => (
              <li key={i.partnumber} className={styles.rowCard}>
                <div className={styles.rowThumb}>
                  <RowThumbImage
                    image={i.image}
                    alt={i.title}
                    className={styles.rowThumbImg}
                    width={120}
                    height={90}
                    sizes="120px"
                  />
                </div>

                <div className={styles.rowBody}>
                  <div className={styles.rowText}>
                    <h3 className={styles.rowTitle}>{i.title}</h3>
                    <code className={styles.part}>{i.partnumber}</code>
                  </div>

                  <div className={styles.rowActions}>
                    <label className={styles.qtyWrap}>
                      <input
                        type="number"
                        min={1}
                        inputMode="numeric"
                        className={styles.qtyInput}
                        value={i.qty ?? 1}
                        onChange={(e) => onQtyChange(i.partnumber, e.target.value)}
                        aria-label="Quantity"
                      />
                    </label>

                    <button
                      className={styles.remove}
                      onClick={() => removeItem(i.partnumber)}
                      aria-label={`Remove ${i.title} (${i.partnumber})`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Form + Contact info side-by-side */}
      <section className={styles.contactSplit} aria-labelledby="general-enquiry-title">
        <div className={styles.formCol}>
          <div className={styles.formHeader}>
            <h2 id="general-enquiry-title" className={styles.sectionTitle}>Something else?</h2>
            <p className={styles.formSubtitle}>
              Tell us about a repair, quote, R&amp;D idea, or any other question. We’re open 8:30am–5:00pm Mon–Fri.
            </p>
          </div>

          <form className={styles.form} onSubmit={onSubmitGeneral} noValidate>
            <label className={styles.field}>
              <span className={styles.label}>Your name</span>
              <input
                className={styles.input}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="name"
                autoComplete="name"
                required
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Your email</span>
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                autoComplete="email"
                required
              />
            </label>

            <label className={`${styles.field} ${styles.fieldFull}`}>
              <span className={styles.label}>Message</span>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                required
              />
            </label>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.primary}
                disabled={!canSend}
                aria-disabled={!canSend}
                title={!canSend ? 'Please enter your name, email, and message' : 'Send email'}
              >
                Email us
              </button>
            </div>
          </form>
        </div>

        <aside className={styles.infoCol} aria-labelledby="contact-info-title">
          <h2 id="contact-info-title" className={styles.infoTitle}>Contact Information</h2>
          <div className={styles.infoGrid}>
            <article className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Contact</h3>
                <address className={styles.addr}>
                  <div className={styles.addrBlock}>
                    7 Bullen street<br />
                    Tahunanui<br />
                    Nelson, 7011
                  </div>
                  <div className={styles.addrBlock}>
                    <a className={styles.link} href="tel:+6435485336">+64 3 548 5336</a>
                  </div>
                  <div className={styles.addrBlock}>
                    <a className={styles.link} href="mailto:sales@anythingelectronic.co.nz">
                      sales@anythingelectronic.co.nz
                    </a>
                  </div>
                </address>
            </article>

            <article className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Delivery Address</h3>
              <address className={styles.addr}>
                <div className={styles.addrLine}><strong>Anything Electronic (NZ) Ltd.</strong></div>
                <div className={styles.addrBlock}>
                  7 Bullen Street<br />
                  Tahunanui<br />
                  Nelson 7011<br />
                  New Zealand
                </div>
              </address>
            </article>

            <article className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Correspondence</h3>
              <address className={styles.addr}>
                <div className={styles.addrLine}><strong>Anything Electronic (NZ) Ltd.</strong></div>
                <div className={styles.addrBlock}>
                  PO Box 273<br />
                  Nelson 7040<br />
                  New Zealand
                </div>
              </address>
            </article>
          </div>
        </aside>
      </section>
    </main>
  );
}
