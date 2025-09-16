// src/app/catalog/page.jsx
import Image from 'next/image';
import { getCatalog } from '@/lib/catalog';
import styles from './CatalogPage.module.css';
import SearchBox from './SearchBox';
import AddButton from './AddButton';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Product Catalog · Anything Electronic',
  description: 'Browse our electronics manufacturing and service catalog.',
};

export default async function CatalogPage({ searchParams }) {
  const q = (searchParams?.q || '').toString().toLowerCase();
  const items = await getCatalog();

  const filtered = items.filter((i) => {
    if (!q) return true;
    const hay = [i.title, i.category, i.description, i.partnumber, ...(i.tags || [])]
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });

  return (
    <main className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>Product Catalog</h1>
        <p className={styles.subtitle}>
          Browse devices, interfaces, and assemblies we manufacture or service.
        </p>
        <SearchBox initialQ={q} />
      </header>

      <ul className={styles.grid} aria-label="Products">
        {filtered.map((item) => (
          <li key={item.partnumber} className={styles.card}>
            <div className={styles.thumb}>
              <Image
                src={item.image}
                alt={item.title}
                width={640}
                height={480}
                sizes="(max-width: 1000px) 100vw, 380px"
                className={styles.thumbImg}
              />
            </div>

            <div className={styles.cardBody}>
              <div className={styles.topRow}>
                <h2 className={styles.cardTitle}>{item.title}</h2>
                <code className={styles.part}>{item.partnumber}</code>
              </div>

              <div className={styles.metaRow}>
                <span className={styles.cat}>{item.category}</span>
                <ul className={styles.tags}>
                  {item.tags.map((t) => (
                    <li key={t} className={styles.tag}>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              {item.description && <p className={styles.cardDesc}>{item.description}</p>}

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

                {/* New add button */}
                <AddButton item={item} />
              </div>
            </div>
          </li>
        ))}

        {filtered.length === 0 && (
          <li className={styles.empty}>No products matched your search.</li>
        )}
      </ul>
    </main>
  );
}
