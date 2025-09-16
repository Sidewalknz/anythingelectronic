'use client';

import { useEffect, useState } from 'react';
import { addItem, getSelection } from '@/lib/selection';
import styles from './CatalogPage.module.css';

export default function AddButton({ item }) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const sync = () =>
      setAdded(getSelection().some((x) => x.partnumber === item.partnumber));
    sync();
    window.addEventListener('ae-selection-change', sync);
    return () => window.removeEventListener('ae-selection-change', sync);
  }, [item.partnumber]);

  function onClick() {
    addItem({ partnumber: item.partnumber, title: item.title, image: item.image });
    setAdded(true);
  }

  return (
    <button
      type="button"
      className={`${styles.addBtn} ${added ? styles.added : ''}`}
      onClick={onClick}
      aria-pressed={added}
      title={added ? 'Added to enquiry' : 'Add to enquiry'}
    >
      {added ? 'Added' : 'Add'}
    </button>
  );
}
