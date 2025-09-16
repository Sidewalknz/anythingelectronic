'use client';

import { useEffect, useState } from 'react';
import { addItem, getSelection } from '@/lib/selection';
import styles from './CatalogPage.module.css';

export default function AddButton({ item }) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const sync = () => setAdded(getSelection().some((x) => x.partnumber === item.partnumber));
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
      className={`${styles.addFab} ${added ? styles.addedFab : ''}`}
      onClick={onClick}
      aria-pressed={added}
      aria-label={added ? 'Added to enquiry' : 'Add to enquiry'}
      title={added ? 'Added to enquiry' : 'Add to enquiry'}
    >
      {added ? (
        /* check mark */
        <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M20.285 6.708a1 1 0 0 1 0 1.414l-9.193 9.193a1 1 0 0 1-1.414 0L3.715 11.35a1 1 0 1 1 1.414-1.414l4.036 4.036 8.486-8.486a1 1 0 0 1 1.414 0Z"
            fill="currentColor"
          />
        </svg>
      ) : (
        /* plus icon */
        <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1Z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  );
}
