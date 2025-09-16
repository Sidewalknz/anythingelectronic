import { getCatalog } from '@/lib/catalog';
import styles from './CatalogPage.module.css';
import SearchBox from './SearchBox';
import ProductCard from './ProductCard';

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
          Browse devices, interfaces, and assemblies we manufacture.
        </p>
        <SearchBox initialQ={q} />
      </header>

      <ul className={styles.grid} aria-label="Products">
        {filtered.map((item) => (
          <li key={item.partnumber}>
            <ProductCard item={item} />
          </li>
        ))}

        {filtered.length === 0 && (
          <li className={styles.empty}>No products matched your search.</li>
        )}
      </ul>
    </main>
  );
}
