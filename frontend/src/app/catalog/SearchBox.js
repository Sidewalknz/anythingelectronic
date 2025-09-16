// src/app/catalog/SearchBox.jsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './CatalogPage.module.css';

export default function SearchBox({ initialQ = '' }) {
  const [value, setValue] = useState(initialQ);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timer = useRef(null);
  const composing = useRef(false);

  // Keep local state in sync if user navigates with back/forward
  useEffect(() => {
    const q = (searchParams.get('q') || '').toLowerCase();
    setValue(q);
  }, [searchParams]);

  // Debounced URL update
  useEffect(() => {
    if (composing.current) return; // don't update mid-IME composition

    // Clear prior timer
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));

      if (value && value.trim()) {
        params.set('q', value.trim());
      } else {
        params.delete('q');
      }

      const next = `${pathname}${params.toString() ? `?${params}` : ''}`;
      router.replace(next, { scroll: false });
    }, 250); // 250ms feels snappy without spamming

    return () => timer.current && clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, pathname, router, searchParams]);

  return (
    <div className={styles.filters} role="search">
      <input
        type="search"
        name="q"
        inputMode="search"
        enterKeyHint="search"
        placeholder="Search by name, category, part number, tag…"
        aria-label="Search catalog"
        autoComplete="off"
        className={styles.search}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onCompositionStart={() => { composing.current = true; }}
        onCompositionEnd={(e) => {
          composing.current = false;
          // ensure we commit the final composed value
          setValue(e.currentTarget.value);
        }}
      />
    </div>
  );
}
