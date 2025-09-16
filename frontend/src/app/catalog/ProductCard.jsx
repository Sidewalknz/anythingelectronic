'use client';

import { useState } from 'react';
import Image from 'next/image';
import AddButton from './AddButton';
import styles from './CatalogPage.module.css';

export default function ProductCard({ item }) {
  const [errored, setErrored] = useState(false);

  // Resolve image path with fallback
  const toWebpPath = (image) => {
    if (!image) return '/products/placeholder.webp';
    const safe = image.replace(/\.(jpe?g|png|gif|webp)$/i, '');
    return `/products/${safe}.webp`;
  };

  const imageSrc = errored ? '/products/placeholder.webp' : toWebpPath(item.image);

  return (
    <div className={styles.card}>
      <div className={styles.thumb}>
        <Image
          src={imageSrc}
          alt={item.title}
          width={640}
          height={480}
          sizes="(max-width: 1000px) 100vw, 380px"
          className={styles.thumbImg}
          onError={() => setErrored(true)}
        />
      </div>

      <div className={styles.cardBody}>
        <div className={styles.topRow}>
          <h2 className={styles.cardTitle}>{item.title}</h2>
          <code className={styles.part}>{item.partnumber}</code>
        </div>

        <div className={styles.metaRow}>
          <span className={styles.cat}>{item.category}</span>
        </div>

        {item.description && (
          <p className={`${styles.cardDesc} ${styles.descScroll}`}>
            {item.description}
          </p>
        )}

        {(item.retailPriceText || item.memberPriceText) && (
          <div className={styles.priceRow}>
            {item.retailPriceText && (
              <span className={styles.priceRetail} title="Retail price">
                {item.retailPriceText}
              </span>
            )}
            {item.memberPriceText && (
              <span className={styles.priceMember} title="Member / Trade price">
                {item.memberPriceText}
              </span>
            )}
          </div>
        )}

        <div className={styles.linksRow}>
          {item.instructionSheet && (
            <a
              href={item.instructionSheet}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.pillLink}
            >
              Instruction sheet
            </a>
          )}
          {item.extraLinks.map((l, idx) => (
            <a
              key={`${l.url}-${idx}`}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.pillLink}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>

      {/* Unified bottom bar: tags + add/check button */}
      <div className={styles.bottomBar}>
        <ul className={styles.tagsRow} aria-label="Tags">
          {item.tags.map((t) => (
            <li key={t} className={styles.tagPill}>{t}</li>
          ))}
        </ul>

        <AddButton item={item} />
      </div>
    </div>
  );
}
